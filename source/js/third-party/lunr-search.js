/**
 * Lunr.js Enhanced Local Search
 * 使用 Lunr.js 提供更快更智能的搜索体验，支持中文/日文/韩文搜索
 * 
 * PREREQUISITES:
 * 1. Install hexo-generator-search plugin:
 *    npm install hexo-generator-search --save
 * 
 * 2. Add to your site's _config.yml (NOT theme config):
 *    search:
 *      path: search.json      # JSON format recommended for Lunr
 *      field: post            # search scope: post, page, all
 *      content: true          # include post content in search
 *      format: html           # strip or html (recommended: html for better highlighting)
 * 
 * 3. Configure theme's _config.yml:
 *    search:
 *      enable: true
 *      engine: lunr
 *      lunr:
 *        path: search.json    # must match site config
 *        maxResults: 30
 *        minQueryLength: 1    # allows single character search for Chinese
 *        debounceTime: 300
 */

class LunrSearch {
    constructor(options = {}) {
        // 简化路径处理
        const searchPath = options.searchPath || options.path || 'search.json';
        
        this.options = {
            searchPath: searchPath,
            inputId: options.inputId || 'local-search-input',
            resultId: options.resultId || 'local-search-result',
            debounceTime: options.debounceTime || 300,
            maxResults: options.maxResults || 30,
            minQueryLength: options.minQueryLength || 1,
            ...options
        };
        
        this.searchIndex = null;
        this.documentsStore = null;
        this.lunrIndex = null;
        this.isLoading = false;
        this.isIndexBuilt = false;
        
        this.init();
    }
    
    // 获取正确的基础 URL
    getBaseUrl() {
        // 获取站点根目录
        const root = (window.CONFIG && window.CONFIG.root) || '/';
        const origin = window.location.origin;
        
        // 确保 root 以 / 结尾
        const normalizedRoot = root.endsWith('/') ? root : root + '/';
        
        return origin + normalizedRoot;
    }
    
    init() {
        this.bindElements();
        this.setupEventListeners();
        this.loadLunrLibrary();
    }
    
    bindElements() {
        this.inputElement = document.getElementById(this.options.inputId);
        this.resultElement = document.getElementById(this.options.resultId);
        
        if (!this.inputElement || !this.resultElement) {
            console.warn('Lunr Search: Required elements not found');
            return;
        }
    }
    
    setupEventListeners() {
        if (!this.inputElement) return;
        
        // 防抖搜索
        this.inputElement.addEventListener('input', this.debounce(
            this.handleSearch.bind(this), 
            this.options.debounceTime
        ));
    }
    
    // 加载 Lunr.js 库
    async loadLunrLibrary() {
        if (typeof lunr !== 'undefined') {
            console.log('Lunr.js already loaded');
            return true;
        }
        
        try {
            await this.loadScript('https://cdn.jsdelivr.net/npm/lunr@2.3.9/lunr.min.js');
            console.log('Lunr.js loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load Lunr.js:', error);
            return false;
        }
    }
    
    // 解析搜索文件路径
    resolveSearchPath() {
        const path = this.options.searchPath;
        
        // 如果已经是完整URL，直接返回
        if (path.startsWith('http')) {
            return path;
        }
        
        // 获取基础URL
        const baseUrl = this.getBaseUrl();
        
        // 如果路径以 / 开头，从根目录开始
        if (path.startsWith('/')) {
            return baseUrl + path.substring(1);
        }
        
        // 相对路径
        return baseUrl + path;
    }
    
    // 加载并构建搜索索引
    async loadSearchIndex() {
        if (this.isIndexBuilt) return true;
        
        if (this.isLoading) {
            // 如果正在加载，等待完成
            while (this.isLoading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.isIndexBuilt;
        }
        
        this.isLoading = true;
        this.showLoadingState();
        
        try {
            // 确保 Lunr.js 已加载
            const lunrLoaded = await this.loadLunrLibrary();
            if (!lunrLoaded) {
                throw new Error('Lunr.js failed to load');
            }
            
            // 获取搜索数据 - 修复路径问题
            const searchPath = this.resolveSearchPath();
            console.log('Attempting to load search data from:', searchPath);
            
            const response = await fetch(searchPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const searchData = await response.json();
            
            // 构建 Lunr 索引
            await this.buildLunrIndex(searchData);
            
            this.isIndexBuilt = true;
            console.log('Lunr search index built successfully');
            return true;
            
        } catch (error) {
            console.error('Failed to load search index:', error);
            const attemptedPath = this.resolveSearchPath();
            console.error('Search path attempted:', attemptedPath);
            console.error('Current location:', window.location.href);
            this.showErrorState();
            return false;
            
        } finally {
            this.isLoading = false;
        }
    }
    
    // 构建 Lunr.js 索引
    async buildLunrIndex(data) {
        return new Promise((resolve) => {
            // 存储文档数据
            this.documentsStore = {};
            
            // 预处理数据
            const documents = data.map((item, index) => {
                const doc = {
                    id: index.toString(),
                    title: item.title || 'Untitled',
                    content: (item.content || '').replace(/<[^>]+>/g, ''), // 去除HTML标签
                    url: item.url,
                    categories: item.categories || [],
                    tags: item.tags || []
                };
                
                // 存储完整文档信息
                this.documentsStore[doc.id] = doc;
                
                return doc;
            });
            
            // 构建 Lunr 索引
            this.lunrIndex = lunr(function () {
                // 设置参考字段
                this.ref('id');
                
                // 添加搜索字段，设置权重
                this.field('title', { boost: 10 });     // 标题权重最高
                this.field('content', { boost: 1 });    // 内容权重正常
                this.field('categories', { boost: 5 }); // 分类权重较高
                this.field('tags', { boost: 3 });       // 标签权重中等
                
                // 添加文档到索引
                documents.forEach((doc) => {
                    this.add(doc);
                });
            });
            
            console.log(`Lunr index built with ${documents.length} documents`);
            resolve();
        });
    }
    
    // 处理搜索
    async handleSearch(event) {
        const query = event.target.value.trim();
        
        if (query.length < this.options.minQueryLength) {
            this.clearResults();
            return;
        }
        
        // 确保索引已构建
        const indexReady = await this.loadSearchIndex();
        if (!indexReady) {
            return;
        }
        
        try {
            const results = this.performLunrSearch(query);
            this.displayResults(results, query);
        } catch (error) {
            console.error('Search failed:', error);
            this.showErrorState();
        }
    }
    
    // 执行 Lunr 搜索
    performLunrSearch(query) {
        // 检查查询是否包含中文、日文、韩文字符
        const hasCJK = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(query);
        
        console.log('Search query:', query, 'Has CJK:', hasCJK);
        
        if (hasCJK) {
            // 对于包含中日韩字符的查询，直接使用 fallback 搜索
            console.log('CJK characters detected, using fallback search');
            return this.fallbackSearch(query);
        }
        
        try {
            // 对于英文查询，使用 Lunr 搜索
            let lunrResults = this.lunrIndex.search(query);
            
            // 如果结果不够，尝试处理后的查询
            if (lunrResults.length < 5) {
                const processedQuery = this.processQuery(query);
                const additionalResults = this.lunrIndex.search(processedQuery);
                
                // 合并结果，去重
                const combinedResults = [...lunrResults];
                additionalResults.forEach(result => {
                    if (!combinedResults.find(r => r.ref === result.ref)) {
                        combinedResults.push(result);
                    }
                });
                lunrResults = combinedResults;
            }
            
            // 转换结果格式并标准化分数
            const maxScore = lunrResults.length > 0 ? lunrResults[0].score : 1;
            const results = lunrResults
                .slice(0, this.options.maxResults)
                .map(result => {
                    const doc = this.documentsStore[result.ref];
                    if (!doc) return null;
                    // 标准化分数到 0-5 范围，便于显示
                    const normalizedScore = Math.min(5, (result.score / maxScore) * 5);
                    return {
                        ...doc,
                        score: normalizedScore,
                        originalScore: result.score,
                        highlightedTitle: this.highlightKeywords(doc.title, query),
                        highlightedContent: this.getHighlightedExcerpt(doc, query)
                    };
                })
                .filter(result => result !== null);
            
            return results;
            
        } catch (error) {
            console.warn('Lunr search failed, falling back to simple search:', error);
            return this.fallbackSearch(query);
        }
    }
    
    // 处理搜索查询，支持中文和其他语言
    processQuery(query) {
        // 清理查询，保留中文、日文、韩文和英文字符
        const cleaned = query.replace(/[^\w\s\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g, ' ').trim();
        
        if (!cleaned) return '';
        
        // 按空格分割词组，保持中文词组的完整性
        const words = cleaned.split(/\s+/).filter(word => word.length > 0);
        const terms = [];
        
        words.forEach(word => {
            // 检查是否包含中文、日文或韩文字符
            const hasCJK = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(word);
            
            if (hasCJK) {
                // 对于包含中日韩字符的词，使用精确匹配和通配符
                terms.push(word);
                terms.push(word + '*');
                
                // 如果词很长，也添加子串搜索
                if (word.length > 2) {
                    for (let i = 0; i < word.length - 1; i++) {
                        const substr = word.substring(i, i + 2);
                        terms.push(substr);
                    }
                }
            } else {
                // 对于英文词，使用通配符和模糊搜索
                terms.push(word);
                terms.push(word + '*');
                if (word.length > 3) {
                    terms.push(word + '~1');
                }
            }
        });
        
        return terms.join(' ');
    }
    
    // fallback 简单搜索 - 支持中文，优化精确匹配
    fallbackSearch(query) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        // 按空格分割搜索词，保持中文词组完整
        const keywords = query.split(/\s+/).filter(word => word.trim().length > 0);
        
        console.log('Fallback search for:', query, 'Keywords:', keywords);
        
        for (const [id, doc] of Object.entries(this.documentsStore)) {
            let score = 0;
            let hasDirectMatch = false; // 标记是否有直接匹配
            const titleLower = doc.title.toLowerCase();
            const contentLower = doc.content.toLowerCase();
            
            // 完整查询匹配（最高权重）
            if (titleLower.includes(queryLower)) {
                score += 100;
                hasDirectMatch = true;
            }
            if (contentLower.includes(queryLower)) {
                score += 50;
                hasDirectMatch = true;
            }
            
            // 逐词匹配
            keywords.forEach(keyword => {
                const keywordLower = keyword.toLowerCase();
                
                // 精确匹配 - 提高权重
                if (titleLower.includes(keywordLower)) {
                    score += 30;
                    hasDirectMatch = true;
                }
                if (contentLower.includes(keywordLower)) {
                    score += 15;
                    hasDirectMatch = true;
                }
                
                // 对于中文/日文，只有在没有直接匹配时才进行字符级匹配
                if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/.test(keyword) && !hasDirectMatch) {
                    // 提高门槛，只有长度大于1的关键词才进行部分匹配
                    if (keyword.length > 1) {
                        // 双字匹配 - 降低权重，避免过多误匹配
                        for (let i = 0; i < keyword.length - 1; i++) {
                            const substr = keyword.substring(i, i + 2);
                            if (titleLower.includes(substr)) score += 2;
                            if (contentLower.includes(substr)) score += 1;
                        }
                        
                        // 三字匹配 - 稍高权重
                        if (keyword.length > 2) {
                            for (let i = 0; i < keyword.length - 2; i++) {
                                const substr = keyword.substring(i, i + 3);
                                if (titleLower.includes(substr)) score += 5;
                                if (contentLower.includes(substr)) score += 2;
                            }
                        }
                    }
                    
                    // 单字匹配 - 权重很低，只在没有其他匹配时使用
                    if (keyword.length === 1) {
                        if (titleLower.includes(keywordLower)) score += 1;
                        if (contentLower.includes(keywordLower)) score += 0.5;
                    }
                }
            });
            
            // 提高过滤门槛，减少无关结果
            const minScore = hasDirectMatch ? 1 : 5; // 有直接匹配的结果门槛低，否则门槛高
            
            if (score >= minScore) {
                // 将简单搜索的分数标准化到 0-5 范围
                const normalizedScore = Math.min(5, (score / 30) * 5);
                results.push({
                    ...doc,
                    score: normalizedScore,
                    originalScore: score,
                    hasDirectMatch: hasDirectMatch,
                    highlightedTitle: this.highlightKeywords(doc.title, query),
                    highlightedContent: this.getHighlightedExcerpt(doc, query)
                });
            }
        }
        
        // 排序：优先显示有直接匹配的结果
        const sortedResults = results
            .sort((a, b) => {
                // 先按是否有直接匹配排序
                if (a.hasDirectMatch !== b.hasDirectMatch) {
                    return b.hasDirectMatch ? 1 : -1;
                }
                // 再按分数排序
                return b.originalScore - a.originalScore;
            })
            .slice(0, this.options.maxResults);
            
        console.log('Fallback search results:', sortedResults.length, 'results found');
        if (sortedResults.length > 0) {
            console.log('Top result:', sortedResults[0].title, 'score:', sortedResults[0].originalScore, 'direct match:', sortedResults[0].hasDirectMatch);
        }
        
        return sortedResults;
    }
    
    // 高亮关键词 - 支持中文
    highlightKeywords(text, query) {
        const keywords = query.split(/\s+/).filter(word => word.trim().length > 0);
        let highlighted = text;
        
        keywords.forEach(keyword => {
            const regex = new RegExp(`(${this.escapeRegExp(keyword)})`, 'gi');
            highlighted = highlighted.replace(regex, '<span class="search-keyword">$1</span>');
        });
        
        return highlighted;
    }
    
    // 获取高亮摘要
    getHighlightedExcerpt(doc, query, maxLength = 150) {
        const content = doc.content;
        if (!content) return '';
        
        const keywords = query.split(/\s+/).filter(word => word.trim().length > 0);
        const contentLower = content.toLowerCase();
        
        // 找到第一个关键词位置
        let firstMatchIndex = -1;
        keywords.forEach(keyword => {
            const index = contentLower.indexOf(keyword.toLowerCase());
            if (index !== -1 && (firstMatchIndex === -1 || index < firstMatchIndex)) {
                firstMatchIndex = index;
            }
        });
        
        if (firstMatchIndex === -1) {
            return this.highlightKeywords(content.substring(0, maxLength), query) + '...';
        }
        
        // 计算摘要范围
        const start = Math.max(0, firstMatchIndex - 50);
        const end = Math.min(content.length, start + maxLength);
        
        let excerpt = content.substring(start, end);
        
        // 添加省略号
        if (start > 0) excerpt = '...' + excerpt;
        if (end < content.length) excerpt = excerpt + '...';
        
        return this.highlightKeywords(excerpt, query);
    }
    
    // 显示搜索结果
    displayResults(results, query) {
        if (!this.resultElement) return;
        
        if (results.length === 0) {
            this.showEmptyState(query);
            return;
        }
        
        const resultHTML = this.generateResultHTML(results);
        this.resultElement.innerHTML = resultHTML;
    }
    
    // 生成结果HTML
    generateResultHTML(results) {
        const resultsHTML = results.map(result => `
            <li>
                <a href="${result.url}" target="_blank">
                    ${result.highlightedTitle}
                </a>
                ${result.highlightedContent ? `
                    <p>${result.highlightedContent}</p>
                ` : ''}
            </li>
        `).join('');
        
        return `
            <ul class="search-result-list">
                ${resultsHTML}
            </ul>
        `;
    }
    
    // 工具函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // 获取多语言文本
    getLocalizedText(key, fallback) {
        // 尝试从全局配置获取语言设置
        const lang = (window.CONFIG && window.CONFIG.lang) || 
                     (document.documentElement.lang) || 
                     'en';
        
        // 尝试从主题的 i18n 系统获取文本
        if (window.theme && window.theme.i18n) {
            const keys = key.split('.');
            let text = window.theme.i18n;
            
            for (const k of keys) {
                if (text && typeof text === 'object' && text[k]) {
                    text = text[k];
                } else {
                    text = null;
                    break;
                }
            }
            
            if (text && typeof text === 'string') {
                return text;
            }
        }
        
        // 尝试从 CONFIG 获取
        if (window.CONFIG && window.CONFIG.i18n) {
            const keys = key.split('.');
            let text = window.CONFIG.i18n;
            
            for (const k of keys) {
                if (text && typeof text === 'object' && text[k]) {
                    text = text[k];
                } else {
                    text = null;
                    break;
                }
            }
            
            if (text && typeof text === 'string') {
                return text;
            }
        }
        
        // 回退到默认文本
        return fallback;
    }
    
    // 状态显示方法
    showLoadingState() {
        if (!this.resultElement) return;
        
        // 获取多语言文本，使用现有的 localSearch.firstSearch 配置
        const loadingText = this.getLocalizedText('localSearch.firstSearch', 'Building search index...');
        
        this.resultElement.innerHTML = `
            <div class="local-search-empty">
                ${loadingText}
            </div>
        `;
    }
    
    showEmptyState(query) {
        if (!this.resultElement) return;
        
        // 获取多语言文本，使用现有的 localSearch.empty 配置
        const emptyText = this.getLocalizedText('localSearch.empty', `No results found for "${query}"`);
        
        this.resultElement.innerHTML = `
            <div class="local-search-empty">
                ${emptyText}
            </div>
        `;
    }
    
    showErrorState() {
        if (!this.resultElement) return;
        
        // 获取多语言文本
        const errorText = this.getLocalizedText('localSearch.error', 'Search temporarily unavailable');
        
        this.resultElement.innerHTML = `
            <div class="local-search-empty">
                ${errorText}
            </div>
        `;
    }
    
    clearResults() {
        if (this.resultElement) {
            this.resultElement.innerHTML = '';
        }
    }
    
    clearSearch() {
        if (this.inputElement) {
            this.inputElement.value = '';
        }
        this.clearResults();
    }
}

// 全局初始化函数 - 这是 multi-search.js 需要的
function initLunrSearch(options = {}) {
    return new LunrSearch({
        searchPath: options.path || "search.json",
        inputId: 'local-search-input',
        resultId: 'local-search-result',
        debounceTime: 300,
        maxResults: 30,
        minQueryLength: 1, // 支持单字搜索
        ...options
    });
}

// 兼容性函数
function getLunrSearchFile(options = {}) {
    return initLunrSearch(options);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LunrSearch, initLunrSearch };
}

// 确保函数在全局作用域中可用
window.LunrSearch = LunrSearch;
window.initLunrSearch = initLunrSearch;
window.getLunrSearchFile = getLunrSearchFile;