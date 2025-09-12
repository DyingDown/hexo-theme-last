/**
 * Tags Page Interactive Features with Multi-language Support
 * - Alphabet navigation with smooth scrolling
 * - Tag search with real-time filtering
 * - Active letter highlighting
 * - Multi-language romanization using external libraries
 * 
 * Required libraries for multi-language support:
 * - Chinese: pinyin (npm: pinyin)
 * - Japanese: wanakana (npm: wanakana)
 * - Korean: hangul-romanization (npm: hangul-romanization)
 * - Russian: cyrillic-to-translit-js (npm: cyrillic-to-translit-js)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on tags page and alphabet index is enabled
    if (!document.getElementById('tags')) return;
    
    // Check if alphabet index features exist (only loaded when enabled)
    if (!document.querySelector('.alphabet-nav')) {
        console.log('Traditional tags mode - alphabet index features disabled');
        return;
    }
    
    console.log('Alphabet index mode - initializing enhanced features with multi-language support');
    
    // Initialize features
    initAlphabetNavigation();
    initTagSearch();
    initScrollSpy();
    initAlphabetState();
    initMultiLanguageSupport(); // 新增：多语言支持初始化
});

// 多语言支持初始化
function initMultiLanguageSupport() {
    // 检测语言并重新分组标签
    const currentLang = document.documentElement.lang || 'en';
    console.log('Detected language:', currentLang);
    
    // 调试：输出主题配置
    console.log('Theme config:', window.themeConfig);
    
    // 检查加载的库
    console.log('Available libraries:');
    console.log('- pinyin (local):', typeof window.pinyin !== 'undefined' && window.pinyin.pinyin ? '✓' : '✗');
    console.log('- WanaKana (local):', typeof window.wanakana !== 'undefined' ? '✓' : '✗');
    console.log('- Korean Utils (local):', typeof window.HangulInitials !== 'undefined' ? '✓' : '✗');
    console.log('- Cyrillic Translit:', typeof window.CyrillicToTranslit !== 'undefined' ? '✓' : '✗');
    
    // 如果有相应的转换库，重新分组标签
    reorganizeTagsByLanguage(currentLang);
}

// 根据语言重新组织标签
function reorganizeTagsByLanguage(lang) {
    const tagItems = document.querySelectorAll('.tag-item');
    
    // 构建动态字母表
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    // 检查是否启用韩语支持
    const koreanEnabled = window.themeConfig && 
                         window.themeConfig.tagsPage && 
                         window.themeConfig.tagsPage.tag &&
                         window.themeConfig.tagsPage.tag.korean && 
                         window.themeConfig.tagsPage.tag.korean.enabled;
    
    if (koreanEnabled && typeof window.HangulInitials !== 'undefined') {
        // 添加韩语字母到字母表中
        const koreanLetters = window.HangulInitials.KOREAN_ALPHABET;
        alphabet = alphabet.concat(koreanLetters);
        console.log('Korean support enabled, expanded alphabet:', alphabet);
    }
    
    // 添加 # 到末尾
    alphabet.push('#');
    
    const newTagsByLetter = {};
    
    // 初始化字母分组
    alphabet.forEach(letter => {
        newTagsByLetter[letter] = [];
    });
    
    // 重新分组所有标签
    tagItems.forEach(item => {
        const originalName = item.getAttribute('data-original-name') || item.getAttribute('data-tag-name');
        console.log('Processing tag:', originalName);
        const romanizedLetter = getRomanizedFirstLetter(originalName);
        console.log('Tag', originalName, 'assigned to letter:', romanizedLetter);
        
        if (newTagsByLetter[romanizedLetter]) {
            newTagsByLetter[romanizedLetter].push(item);
        } else {
            newTagsByLetter['#'].push(item);
        }
    });
    
    // 重新构建DOM结构
    rebuildAlphabetGroups(newTagsByLetter);
}

// 获取转换后的首字母
function getRomanizedFirstLetter(text, lang) {
    if (!text) return '#';
    
    const firstChar = text.charAt(0);
    
    // 如果已经是英文字母，直接返回
    if (/[A-Z]/i.test(firstChar)) {
        return firstChar.toUpperCase();
    }
    
    // 检测字符的语言并使用相应的转换库
    if (isChinese(firstChar)) {
        console.log('Detected Chinese character:', firstChar);
        return getRomanizedChinese(text);
    } else if (isJapanese(firstChar)) {
        console.log('Detected Japanese character:', firstChar);
        return getRomanizedJapanese(text);
    } else if (isKorean(firstChar)) {
        console.log('Detected Korean character:', firstChar);
        return getRomanizedKorean(text);
    } else if (isCyrillic(firstChar)) {
        console.log('Detected Cyrillic character:', firstChar);
        return getRomanizedRussian(text);
    } else {
        // 西欧语言或其他
        return getRomanizedDefault(firstChar);
    }
}

// 检测是否为中文字符
function isChinese(char) {
    const code = char.charCodeAt(0);
    return (code >= 0x4e00 && code <= 0x9fff) || // CJK统一汉字
           (code >= 0x3400 && code <= 0x4dbf) || // CJK扩展A
           (code >= 0x20000 && code <= 0x2a6df); // CJK扩展B
}

// 检测是否为日文字符
function isJapanese(char) {
    const code = char.charCodeAt(0);
    return (code >= 0x3040 && code <= 0x309f) || // 平假名
           (code >= 0x30a0 && code <= 0x30ff) || // 片假名
           (code >= 0xff65 && code <= 0xff9f);   // 半角片假名
}

// 检测是否为韩文字符
function isKorean(char) {
    const code = char.charCodeAt(0);
    return (code >= 0xac00 && code <= 0xd7af) || // 韩文音节
           (code >= 0x1100 && code <= 0x11ff) || // 韩文字母
           (code >= 0x3130 && code <= 0x318f);   // 韩文兼容字母
}

// 检测是否为西里尔字符（俄文等）
function isCyrillic(char) {
    const code = char.charCodeAt(0);
    return (code >= 0x0400 && code <= 0x04ff) || // 西里尔字母
           (code >= 0x0500 && code <= 0x052f);   // 西里尔字母补充
}

// 中文转拼音首字母
function getRomanizedChinese(text) {
    console.log('Trying to convert Chinese:', text.charAt(0));
    
    if (typeof window.pinyin !== 'undefined' && window.pinyin.pinyin) {
        try {
            // 先尝试标准API
            const result = window.pinyin.pinyin(text.charAt(0), { style: window.pinyin.pinyin.STYLE_FIRST_LETTER });
            console.log('Pinyin result (STYLE_FIRST_LETTER):', result);
            if (result && result.length > 0 && result[0].length > 0) {
                const letter = result[0][0].toUpperCase();
                console.log('Chinese', text.charAt(0), '→', letter);
                return letter;
            }
        } catch (e) {
            console.warn('pinyin conversion failed:', e);
        }
        
        // 尝试简化API
        try {
            const result = window.pinyin.pinyin(text.charAt(0));
            console.log('Pinyin result (default):', result);
            if (result && result.length > 0) {
                const letter = result[0].charAt(0).toUpperCase();
                console.log('Chinese', text.charAt(0), '→', letter, '(default API)');
                return letter;
            }
        } catch (e2) {
            console.warn('pinyin conversion failed (alternative API):', e2);
        }
        
        // 尝试直接调用
        try {
            const result = window.pinyin(text.charAt(0));
            console.log('Pinyin result (direct call):', result);
            if (result && result.length > 0) {
                const letter = result[0].charAt(0).toUpperCase();
                console.log('Chinese', text.charAt(0), '→', letter, '(direct call)');
                return letter;
            }
        } catch (e3) {
            console.warn('pinyin conversion failed (direct call):', e3);
        }
    } else {
        console.warn('Pinyin library not available');
    }
    
    console.log('Chinese conversion failed, returning #');
    return '#';
}

// 日文转罗马字首字母
function getRomanizedJapanese(text) {
    if (typeof window.wanakana !== 'undefined' && window.wanakana) {
        try {
            const romaji = window.wanakana.toRomaji(text.charAt(0));
            return romaji.charAt(0).toUpperCase();
        } catch (e) {
            console.warn('WanaKana conversion failed:', e);
        }
    }
    return '#';
}

// 韩文转初声字母
function getRomanizedKorean(text) {
    // 检查是否启用韩语支持
    const koreanEnabled = window.themeConfig && 
                         window.themeConfig.tagsPage && 
                         window.themeConfig.tagsPage.tag &&
                         window.themeConfig.tagsPage.tag.korean && 
                         window.themeConfig.tagsPage.tag.korean.enabled;
    
    if (!koreanEnabled) {
        console.log('Korean support disabled, returning #');
        return '#';
    }
    
    if (typeof window.HangulInitials !== 'undefined') {
        try {
            // 使用新的函数直接返回韩文初声字母
            const letter = window.HangulInitials.getChoseongLetter(text.charAt(0));
            if (letter) {
                console.log('Korean character', text.charAt(0), '→', letter);
                return letter; // 现在返回韩文初声字母，如 'ㄱ', 'ㄴ' 等
            }
        } catch (e) {
            console.warn('Korean conversion failed:', e);
        }
    } else {
        console.warn('Korean utils library not available');
    }
    return '#';
}

// 俄文转拉丁字母
function getRomanizedRussian(text) {
    if (typeof window.CyrillicToTranslit !== 'undefined') {
        try {
            const translit = new window.CyrillicToTranslit();
            const result = translit.transform(text.charAt(0));
            return result.charAt(0).toUpperCase();
        } catch (e) {
            console.warn('Cyrillic transliteration failed:', e);
        }
    }
    return '#';
}

// 西欧语言 - 移除重音符号
function getRomanizedDefault(char) {
    // 移除重音符号的映射
    const accentMap = {
        'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
        'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
        'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
        'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O',
        'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
        'Ñ': 'N', 'Ç': 'C', 'Ÿ': 'Y',
        'à': 'A', 'á': 'A', 'â': 'A', 'ã': 'A', 'ä': 'A', 'å': 'A',
        'è': 'E', 'é': 'E', 'ê': 'E', 'ë': 'E',
        'ì': 'I', 'í': 'I', 'î': 'I', 'ï': 'I',
        'ò': 'O', 'ó': 'O', 'ô': 'O', 'õ': 'O', 'ö': 'O', 'ø': 'O',
        'ù': 'U', 'ú': 'U', 'û': 'U', 'ü': 'U',
        'ñ': 'N', 'ç': 'C', 'ÿ': 'Y'
    };
    
    return (accentMap[char] || char).toUpperCase();
}

// 重新构建字母分组
function rebuildAlphabetGroups(tagsByLetter) {
    const tagsContainer = document.querySelector('.tags-by-alphabet');
    if (!tagsContainer) return;
    
    // 清空现有内容
    tagsContainer.innerHTML = '';
    
    // 重新创建字母分组
    Object.keys(tagsByLetter).forEach(letter => {
        const tags = tagsByLetter[letter];
        if (tags.length > 0) {
            // 创建字母分组
            const letterGroup = document.createElement('div');
            letterGroup.className = 'letter-group';
            
            const letterHeader = document.createElement('h2');
            letterHeader.className = 'letter-header';
            letterHeader.id = `letter-${letter}`;
            letterHeader.textContent = letter;
            
            const tagsGroup = document.createElement('div');
            tagsGroup.className = 'tags-container';
            
            // 添加标签到分组
            tags.forEach(tagItem => {
                tagsGroup.appendChild(tagItem.cloneNode(true));
            });
            
            letterGroup.appendChild(letterHeader);
            letterGroup.appendChild(tagsGroup);
            tagsContainer.appendChild(letterGroup);
        }
    });
    
    // 重新初始化字母状态
    initAlphabetState();
}

// 字母导航功能
function initAlphabetNavigation() {
    const alphabetLinks = document.querySelectorAll('.alphabet-link');
    
    alphabetLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const letter = this.getAttribute('data-letter');
            const targetElement = document.getElementById(`letter-${letter}`);
            
            if (targetElement) {
                // 平滑滚动到目标位置
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 更新激活状态
                updateActiveAlphabetLink(letter);
            }
        });
    });
}

// 初始化字母导航状态 - 将没有标签的字母设为灰色
function initAlphabetState() {
    const alphabetLinks = document.querySelectorAll('.alphabet-link');
    const letterGroups = document.querySelectorAll('.letter-group');
    
    // 获取所有存在的字母
    const existingLetters = new Set();
    letterGroups.forEach(group => {
        const letterHeader = group.querySelector('.letter-header');
        if (letterHeader) {
            const letter = letterHeader.id.replace('letter-', '');
            existingLetters.add(letter);
        }
    });
    
    // 设置字母导航状态
    alphabetLinks.forEach(link => {
        const letter = link.getAttribute('data-letter');
        if (existingLetters.has(letter)) {
            // 有对应标签的字母 - 正常状态
            link.style.opacity = '1';
            link.style.pointerEvents = 'auto';
            link.classList.remove('disabled');
        } else {
            // 没有对应标签的字母 - 灰色状态
            link.style.opacity = '0.3';
            link.style.pointerEvents = 'none';
            link.classList.add('disabled');
        }
    });
}

// 标签搜索功能
function initTagSearch() {
    const searchInput = document.getElementById('tag-search');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        // 如果搜索框为空，立即清除结果
        if (query === '') {
            clearTimeout(searchTimeout);
            filterTags('');
            return;
        }
        
        // 防抖处理
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filterTags(query);
        }, 200);
    });
    
    // 回车键搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.toLowerCase().trim();
            filterTags(query);
        }
    });
    
    // ESC键清除搜索
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            filterTags('');
        }
    });
}

// 标签过滤函数
function filterTags(query) {
    const tagItems = document.querySelectorAll('.tag-item');
    const letterGroups = document.querySelectorAll('.letter-group');
    let visibleCount = 0;
    
    // 重置所有标签显示状态
    tagItems.forEach(item => {
        item.classList.remove('hidden');
        // 清除之前的高亮
        const tagNameElement = item.querySelector('.tag-name');
        if (tagNameElement && tagNameElement.innerHTML.includes('<mark>')) {
            tagNameElement.innerHTML = tagNameElement.textContent;
        }
    });
    
    if (query === '') {
        // 显示所有标签和分组
        letterGroups.forEach(group => {
            group.style.display = 'block';
        });
        updateAlphabetNavVisibility();
        return;
    }
    
    // 根据搜索词过滤标签
    letterGroups.forEach(group => {
        const tagsInGroup = group.querySelectorAll('.tag-item');
        let hasVisibleTags = false;
        
        tagsInGroup.forEach(item => {
            const tagName = item.getAttribute('data-tag-name');
            
            if (tagName && tagName.includes(query)) {
                item.classList.remove('hidden');
                hasVisibleTags = true;
                visibleCount++;
                
                // 高亮匹配的文本
                highlightMatchText(item, query);
            } else {
                item.classList.add('hidden');
            }
        });
        
        // 显示或隐藏整个字母分组
        group.style.display = hasVisibleTags ? 'block' : 'none';
    });
    
    // 更新字母导航的可见性
    updateAlphabetNavVisibility();
}

// 高亮匹配文本
function highlightMatchText(tagItem, query) {
    const tagNameElement = tagItem.querySelector('.tag-name');
    if (!tagNameElement) return;
    
    const originalText = tagNameElement.textContent;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const highlightedText = originalText.replace(regex, '<mark>$1</mark>');
    
    tagNameElement.innerHTML = highlightedText;
    
    // 存储原始文本，便于后续清除
    tagNameElement.setAttribute('data-original-text', originalText);
    
    // 清除高亮的定时器
    setTimeout(() => {
        if (tagNameElement.getAttribute('data-original-text')) {
            tagNameElement.innerHTML = tagNameElement.getAttribute('data-original-text');
        }
    }, 3000);
}



// 滚动监听 - 高亮当前可见的字母
function initScrollSpy() {
    const letterHeaders = document.querySelectorAll('.letter-header');
    const alphabetLinks = document.querySelectorAll('.alphabet-link');
    
    if (!letterHeaders.length) return;
    
    let ticking = false;
    
    function updateScrollSpy() {
        const scrollPos = window.pageYOffset + 150;
        let currentLetter = '';
        
        letterHeaders.forEach(header => {
            const headerTop = header.offsetTop;
            const headerBottom = headerTop + header.parentElement.offsetHeight;
            
            if (scrollPos >= headerTop && scrollPos < headerBottom) {
                currentLetter = header.id.replace('letter-', '');
            }
        });
        
        if (currentLetter) {
            updateActiveAlphabetLink(currentLetter);
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollSpy);
            ticking = true;
        }
    });
}

// 更新字母导航激活状态
function updateActiveAlphabetLink(activeLetter) {
    const alphabetLinks = document.querySelectorAll('.alphabet-link');
    
    alphabetLinks.forEach(link => {
        const letter = link.getAttribute('data-letter');
        if (letter === activeLetter) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 更新字母导航可见性（搜索时）
function updateAlphabetNavVisibility() {
    const alphabetLinks = document.querySelectorAll('.alphabet-link');
    
    alphabetLinks.forEach(link => {
        const letter = link.getAttribute('data-letter');
        const correspondingGroup = document.getElementById(`letter-${letter}`);
        
        // 检查是否有搜索正在进行
        const searchInput = document.getElementById('tag-search');
        const isSearching = searchInput && searchInput.value.trim() !== '';
        
        if (isSearching) {
            // 搜索模式：只显示有匹配结果的字母
            if (correspondingGroup && correspondingGroup.style.display !== 'none') {
                link.style.opacity = '1';
                link.style.pointerEvents = 'auto';
                link.classList.remove('disabled');
            } else {
                link.style.opacity = '0.3';
                link.style.pointerEvents = 'none';
                link.classList.add('disabled');
            }
        } else {
            // 非搜索模式：恢复初始状态
            if (correspondingGroup) {
                // 有对应标签组的字母
                link.style.opacity = '1';
                link.style.pointerEvents = 'auto';
                link.classList.remove('disabled');
            } else {
                // 没有对应标签组的字母
                link.style.opacity = '0.3';
                link.style.pointerEvents = 'none';
                link.classList.add('disabled');
            }
        }
    });
}

// 返回顶部功能（额外的交互增强）
function addBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopButton.title = '返回顶部';
    
    document.body.appendChild(backToTopButton);
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 滚动时显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
}

// 初始化返回顶部按钮
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('tags')) {
        addBackToTop();
    }
});
