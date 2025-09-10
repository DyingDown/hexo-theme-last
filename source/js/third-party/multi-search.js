/**
 * Multi-Search Engine Loader
 * Supports: Local Search, Algolia, Google Custom Search, Swiftype
 */

class SearchEngineLoader {
    constructor(config) {
        this.config = config;
        this.currentEngine = null;
        this.isInitialized = false;
        this.init();
    }
    
    // Get i18n text with fallback to English
    getI18nText(key, fallback) {
        try {
            if (typeof window !== 'undefined' && window.themeConfig && window.themeConfig.i18n) {
                const keys = key.split('.');
                let value = window.themeConfig.i18n;
                for (const k of keys) {
                    value = value[k];
                    if (!value) break;
                }
                return value || fallback;
            }
        } catch (error) {
            console.warn('Failed to get i18n text for key:', key, error);
        }
        return fallback;
    }
    
    init() {
        const searchConfig = this.getSearchConfig();
        if (!searchConfig.enable) {
            console.log('Search is disabled');
            return;
        }
        
        this.loadSearchEngine(searchConfig.engine);
    }
    
    getSearchConfig() {
        // Try to get config from window object (set by theme)
        if (typeof window !== 'undefined' && window.themeConfig && window.themeConfig.search) {
            return window.themeConfig.search;
        }
        
        // Default configuration
        return {
            enable: true,
            engine: 'local',
            local: {
                path: '/search.xml',
                trigger: 'click'
            }
        };
    }
    
    getAlgoliaConfig() {
        // Get Algolia config from site root config (standard way)
        if (typeof window !== 'undefined' && window.algolia) {
            const config = window.algolia;
            console.log('Found Algolia config from site root:', config);
            // Normalize field names to match Algolia SDK expectations
            return {
                appId: config.appId || config.applicationID,
                apiKey: config.apiKey,
                indexName: config.indexName,
                chunkSize: config.chunkSize,
                hits: config.hits || { per_page: 10 },
                fields: config.fields || []
            };
        }
        
        console.warn('window.algolia not found, checking theme config...');
        // Fallback to theme config (deprecated)
        const searchConfig = this.getSearchConfig();
        const themeAlgolia = searchConfig.algolia || {};
        console.log('Theme Algolia config:', themeAlgolia);
        return themeAlgolia;
    }
    
    async loadSearchEngine(engine) {
        const searchInput = document.getElementById('local-search-input');
        if (!searchInput) {
            console.warn('Search input element not found');
            return;
        }
        
        this.currentEngine = engine;
        
        switch (engine) {
            case 'lunr':
                await this.initLunrSearch(searchInput);
                break;
            case 'local':
                await this.initLocalSearch(searchInput);
                break;
            case 'algolia':
                await this.initAlgoliaSearch(searchInput);
                break;
            case 'google':
                await this.initGoogleSearch(searchInput);
                break;
            case 'swiftype':
                await this.initSwiftypeSearch(searchInput);
                break;
            default:
                console.warn(`Unknown search engine: ${engine}, falling back to lunr search`);
                await this.initLunrSearch(searchInput);
        }
        
        this.isInitialized = true;
    }
    
    async initLocalSearch(searchInput) {
        const config = this.getSearchConfig().local;
        
        if (config.trigger === 'click') {
            // Lazy load on click (original behavior)
            searchInput.onclick = function() {
                if (typeof getSearchFile === 'function') {
                    getSearchFile();
                } else {
                    console.error('Local search function not found');
                    console.warn('Make sure local-search.js is properly loaded');
                }
                this.onclick = null;
            };
        } else {
            // Auto load
            if (typeof getSearchFile === 'function') {
                getSearchFile();
            }
        }
        
        console.log('Local search initialized');
    }
    
    async initLunrSearch(searchInput) {
        const config = this.getSearchConfig().lunr || {};
        
        try {
            if (typeof initLunrSearch === 'function') {
                const lunrSearchInstance = initLunrSearch({
                    path: config.path || '/search.json',
                    debounceTime: config.debounceTime || 300,
                    maxResults: config.maxResults || 30,
                    minQueryLength: config.minQueryLength || 2
                });
                
                // 根据触发方式设置
                if (config.trigger === 'click') {
                    searchInput.onclick = function() {
                        // Lunr search will auto-initialize on first input
                        console.log('Lunr search ready');
                        this.onclick = null;
                    };
                } else {
                    // Auto mode - search is ready immediately
                    console.log('Lunr search initialized in auto mode');
                }
                
                console.log('Lunr.js search initialized');
            } else {
                console.error('Lunr search function not found, falling back to local search');
                console.warn('Make sure lunr-search.js is properly loaded');
                return this.initLocalSearch(searchInput);
            }
        } catch (error) {
            console.error('Failed to initialize Lunr search:', error);
            console.warn('Falling back to local search due to Lunr search initialization error');
            return this.initLocalSearch(searchInput);
        }
    }
    
    async initAlgoliaSearch(searchInput) {
        const config = this.getAlgoliaConfig();
        
        if (!config.appId || !config.apiKey || !config.indexName) {
            console.warn('Algolia search configuration incomplete, falling back to Lunr search');
            console.warn('Missing required fields:', {
                appId: !config.appId ? 'missing' : 'present',
                apiKey: !config.apiKey ? 'missing' : 'present', 
                indexName: !config.indexName ? 'missing' : 'present'
            });
            console.warn('To use Algolia, configure it in your site root _config.yml');
            return this.initLunrSearch(searchInput);
        }

        // Prevent duplicate initialization
        if (window.algoliaSearchInstance) {
            console.log('Algolia search already initialized, skipping...');
            return;
        }
        
        try {
            // Get i18n texts
            const i18nTexts = {
                empty: this.getI18nText('localSearch.empty', 'No results found'),
                error: this.getI18nText('localSearch.error', 'Search temporarily unavailable'),
                firstSearch: this.getI18nText('localSearch.firstSearch', 'Loading search index...')
            };
            
            // Load Algolia CSS
            await this.loadCSS('https://cdn.jsdelivr.net/npm/instantsearch.css@7/themes/algolia-min.css');
            
            // Load Algolia JS
            await this.loadScript('https://cdn.jsdelivr.net/npm/algoliasearch@4/dist/algoliasearch-lite.umd.js');
            await this.loadScript('https://cdn.jsdelivr.net/npm/instantsearch.js@4/dist/instantsearch.production.min.js');
            
            // Initialize Algolia with custom configuration
            const searchClient = algoliasearch(config.appId, config.apiKey);
            
            // Apply search configuration
            const searchConfig = {
                indexName: config.indexName,
                searchClient,
                initialUiState: {
                    [config.indexName]: {
                        query: '' // Start with empty query to prevent initial search
                    }
                }
            };
            
            // Add routing if needed
            if (config.routing !== false) {
                searchConfig.routing = true;
            }
            
            const search = instantsearch(searchConfig);
            
            // State to control whether to show hits (prevent initial results display)
            let showHits = false;
            
            // Configure search to not trigger initial search
            search.on('render', () => {
                if (!showHits) {
                    const resultContainer = document.getElementById('local-search-result');
                    if (resultContainer) {
                        resultContainer.innerHTML = '';
                        resultContainer.style.display = 'none';
                    }
                }
            });
            
            // Don't use Algolia's searchBox widget - use custom integration
            // This keeps the original search UI intact
            
            // Configure hits display
            const hitsConfig = {
                container: '#local-search-result',
                hitsPerPage: config.hits?.per_page || 10,
                templates: {
                    // Wrap all items in ul for consistent styling with local search
                    allItems: (renderOptions) => {
                        if (!renderOptions.items || renderOptions.items.length === 0) {
                            return `<div class="local-search-empty">${config.labels?.hits_empty || i18nTexts.empty}</div>`;
                        }
                        return `<ul class="search-result-list">${renderOptions.items}</ul>`;
                    },
                    item: (hit) => {
                        // Get article title with highlighting
                        const title = instantsearch.highlight({ attribute: 'title', hit }) || hit.title || 'Untitled';
                        
                        // Get content snippet with context around keywords
                        let contentSnippet = '';
                        if (hit.content) {
                            // Get highlighted snippet that shows context around search terms
                            contentSnippet = instantsearch.snippet({ 
                                attribute: 'content', 
                                hit,
                                highlightedTagName: 'mark'
                            });
                            
                            // If no snippet, fallback to truncated content
                            if (!contentSnippet || contentSnippet.length < 10) {
                                contentSnippet = hit.content.substring(0, 150) + '...';
                            }
                        } else if (hit.excerpt) {
                            contentSnippet = hit.excerpt;
                        }
                        
                        // Format tags if available
                        let tagsDisplay = '';
                        if (hit.tags && Array.isArray(hit.tags) && hit.tags.length > 0) {
                            const tagList = hit.tags.slice(0, 3).map(tag => `<span class="search-tag">${tag}</span>`).join(' ');
                            tagsDisplay = `<div class="search-result-tags">${tagList}</div>`;
                        }
                        
                        // Format date if available
                        let dateDisplay = '';
                        if (hit.date) {
                            const date = new Date(hit.date);
                            if (!isNaN(date)) {
                                dateDisplay = `<span class="search-result-date">${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}</span>`;
                            }
                        }
                        
                        return `<li>
                            <a href="${hit.url || hit.path || '#'}" target="_blank" class="search-result-title">
                                ${title}
                            </a>
                            ${dateDisplay ? `<div class="search-result-meta">${dateDisplay}</div>` : ''}
                            ${contentSnippet ? `<p class="search-result-excerpt">${contentSnippet}</p>` : ''}
                            ${tagsDisplay}
                        </li>`;
                    }
                }
            };
            
            // Use hits widget but with custom template for better control
            search.addWidgets([
                instantsearch.widgets.hits({
                    container: '#local-search-result',
                    hitsPerPage: config.hits?.per_page || 10,
                    templates: {
                        item: (hit) => {
                            // Only render items when user is actively searching
                            if (!showHits) {
                                return '';
                            }
                            
                            // Get article title with highlighting
                            const title = instantsearch.highlight({ attribute: 'title', hit }) || hit.title || 'Untitled';
                            
                            // Get content snippet with context around keywords
                            let contentSnippet = '';
                            
                            // Use the actual field names from Algolia data
                            const contentField = hit.contentStripTruncate || hit.excerptStrip || hit.content;
                            
                            if (hit._snippetResult) {
                                // Try Algolia's built-in snippets with correct field names
                                if (hit._snippetResult.contentStripTruncate && hit._snippetResult.contentStripTruncate.value) {
                                    contentSnippet = hit._snippetResult.contentStripTruncate.value;
                                } else if (hit._snippetResult.excerptStrip && hit._snippetResult.excerptStrip.value) {
                                    contentSnippet = hit._snippetResult.excerptStrip.value;
                                }
                            }
                            
                            // If no snippet from Algolia, create our own
                            if (!contentSnippet && contentField) {
                                const query = search.helper.state.query;
                                if (query && query.length > 0) {
                                    const contentLower = contentField.toLowerCase();
                                    const queryLower = query.toLowerCase();
                                    const index = contentLower.indexOf(queryLower);
                                    
                                    if (index !== -1) {
                                        // Found the search term, extract context around it
                                        const start = Math.max(0, index - 100);
                                        const end = Math.min(contentField.length, index + queryLower.length + 100);
                                        let snippet = contentField.substring(start, end);
                                        
                                        // Add ellipsis if truncated
                                        if (start > 0) snippet = '...' + snippet;
                                        if (end < contentField.length) snippet = snippet + '...';
                                        
                                        // Highlight the search term
                                        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                                        snippet = snippet.replace(regex, '<mark>$1</mark>');
                                        
                                        contentSnippet = snippet;
                                    } else {
                                        // No search term found, use excerpt or beginning of content
                                        contentSnippet = hit.excerptStrip || contentField.substring(0, 200) + '...';
                                    }
                                } else {
                                    contentSnippet = hit.excerptStrip || contentField.substring(0, 200) + '...';
                                }
                            }
                            
                            // Format tags if available
                            let tagsDisplay = '';
                            if (hit.tags && Array.isArray(hit.tags) && hit.tags.length > 0) {
                                const tagList = hit.tags.slice(0, 3).map(tag => `<span class="search-tag">${tag}</span>`).join(' ');
                                tagsDisplay = `<div class="search-result-tags">${tagList}</div>`;
                            }
                            
                            // Format date if available
                            let dateDisplay = '';
                            if (hit.date) {
                                const date = new Date(hit.date);
                                if (!isNaN(date)) {
                                    dateDisplay = `<span class="search-result-date">${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}</span>`;
                                }
                            }
                            
                            // Use the path field from Algolia data
                            let articleUrl = hit.path || hit.url || hit.permalink;
                            
                            if (!articleUrl) {
                                // Fallback: create a JavaScript click handler to search for this article
                                articleUrl = `javascript:void(0)`;
                            } else {
                                // Ensure the path starts with / for proper routing
                                if (!articleUrl.startsWith('/') && !articleUrl.startsWith('http')) {
                                    articleUrl = '/' + articleUrl;
                                }
                            }
                            
                            // Debug: Article URL logged only in development
                            
                            return `<div class="algolia-search-item">
                                <a href="${articleUrl}" ${articleUrl === 'javascript:void(0)' ? `onclick="searchInSite('${hit.title.replace(/'/g, '\\\'')}')"` : 'target="_blank"'} class="algolia-result-title">
                                    ${title}
                                </a>
                                ${dateDisplay ? `<div class="algolia-result-meta">${dateDisplay}</div>` : ''}
                                ${contentSnippet ? `<p class="algolia-result-excerpt">${contentSnippet}</p>` : ''}
                                ${tagsDisplay}
                            </div>`;
                        },
                        empty: (results) => {
                            // Don't show "no results" on initial load (when no search has been performed)
                            if (!showHits) {
                                return '';
                            }
                            return `<div class="local-search-empty">${config.labels?.hits_empty || i18nTexts.empty}</div>`;
                        }
                    }
                })
            ]);
            
            // Custom search input handling - integrate with existing UI
            let searchTimeout;
            const handleSearch = (query) => {
                if (query.trim().length === 0) {
                    document.getElementById('local-search-result').innerHTML = '';
                    document.getElementById('local-search-result').style.display = 'none';
                    showHits = false; // Reset to initial state
                    return;
                }
                
                // Enable hits display when user starts searching
                showHits = true;
                
                // Use Algolia search helper directly
                search.helper.setQuery(query).search();
                document.getElementById('local-search-result').style.display = 'block';
            };
            
            // Bind to existing input element with debouncing
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    handleSearch(e.target.value);
                }, 300);
            });
            
            // Show/hide results on focus/blur
            searchInput.addEventListener('focus', () => {
                if (searchInput.value.trim() && document.getElementById('local-search-result').innerHTML) {
                    document.getElementById('local-search-result').style.display = 'block';
                }
            });
            
            // Handle click outside to hide results - but be more lenient
            document.addEventListener('click', (e) => {
                const searchContainer = e.target.closest('.search');
                const searchResult = e.target.closest('#local-search-result, .local-search-result-cls');
                
                // Only hide if clicking outside both search input AND search results
                if (!searchContainer && !searchResult) {
                    document.getElementById('local-search-result').style.display = 'none';
                }
            });
            
            // Add stats widget if labels are configured
            if (config.labels?.hits_stats) {
                search.addWidget(
                    instantsearch.widgets.stats({
                        container: '#search-stats',
                        templates: {
                            text: config.labels.hits_stats
                        }
                    })
                );
            }
            
            // Start search and mark as initialized
            search.start();
            window.algoliaSearchInstance = search;
            
            // Hide search results initially
            const resultContainer = document.getElementById('local-search-result');
            if (resultContainer) {
                resultContainer.style.display = 'none';
                resultContainer.innerHTML = '';
            }
            
            // Add global function for searching article titles in the current site
            window.searchInSite = function(title) {
                // Try to find the article by title using browser search or navigation
                // This is a fallback solution
                const searchQuery = title.substring(0, 50); // Use first 50 chars for search
                
                // Option 1: Try to use site search if available
                if (window.location.pathname.includes('/search')) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                } else {
                    // Option 2: Use Google site search as fallback
                    const siteUrl = window.location.hostname;
                    const googleSearchUrl = `https://www.google.com/search?q=site:${siteUrl} "${searchQuery}"`;
                    window.open(googleSearchUrl, '_blank');
                }
            };
            
            console.log('Algolia search initialized successfully');
            console.log('Search configuration:', {
                indexName: config.indexName,
                hitsPerPage: config.hits?.per_page || 10,
                chunkSize: config.chunkSize,
                fields: config.fields
            });
            
        } catch (error) {
            console.error('Failed to initialize Algolia search:', error);
            console.warn('Falling back to local search due to Algolia initialization error');
            return this.initLocalSearch(searchInput);
        }
    }
    
    async initGoogleSearch(searchInput) {
        const config = this.getSearchConfig().google;
        
        if (!config.cx) {
            console.error('Google Custom Search configuration incomplete');
            console.warn('Falling back to local search due to configuration error');
            return this.initLocalSearch(searchInput);
        }
        
        try {
            // Create Google Custom Search element
            const resultContainer = document.getElementById('local-search-result');
            resultContainer.innerHTML = `<div class="gcse-search" data-cx="${config.cx}"></div>`;
            
            // Load Google Custom Search script
            await this.loadScript('https://cse.google.com/cse.js?cx=' + config.cx);
            
            // Hide the original search input
            searchInput.style.display = 'none';
            
            console.log('Google Custom Search initialized');
            
        } catch (error) {
            console.error('Failed to initialize Google search:', error);
            console.warn('Falling back to local search due to Google search initialization error');
            return this.initLocalSearch(searchInput);
        }
    }
    
    async initSwiftypeSearch(searchInput) {
        const config = this.getSearchConfig().swiftype;
        
        if (!config.key) {
            console.error('Swiftype search configuration incomplete');
            console.warn('Falling back to local search due to configuration error');
            return this.initLocalSearch(searchInput);
        }
        
        try {
            // Load Swiftype script
            await this.loadScript('https://s.swiftypecdn.com/install/v2/st.js');
            
            // Initialize Swiftype
            if (typeof SwiftypeObject !== 'undefined') {
                SwiftypeObject.install({
                    engineKey: config.key,
                    inputElement: `#${searchInput.id}`,
                    resultContainingElement: '#local-search-result'
                });
            }
            
            console.log('Swiftype search initialized');
            
        } catch (error) {
            console.error('Failed to initialize Swiftype search:', error);
            console.warn('Falling back to local search due to Swiftype search initialization error');
            return this.initLocalSearch(searchInput);
        }
    }
    
    // Utility functions
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
    
    // Public methods
    switchEngine(newEngine) {
        if (this.currentEngine === newEngine) return;
        
        console.log(`Switching search engine from ${this.currentEngine} to ${newEngine}`);
        this.loadSearchEngine(newEngine);
    }
    
    getCurrentEngine() {
        return this.currentEngine;
    }
    
    isReady() {
        return this.isInitialized;
    }
}

// Global search manager instance
let searchManager = null;

// Initialize search when DOM is ready
function initMultiSearch(config) {
    if (searchManager) {
        console.warn('Search manager already initialized');
        return searchManager;
    }
    
    searchManager = new SearchEngineLoader(config);
    return searchManager;
}

// Legacy compatibility function
function getSearchFile() {
    if (typeof searchFunc === 'function') {
        const path = "/search.xml";
        searchFunc(path, 'local-search-input', 'local-search-result');
    } else {
        console.error('searchFunc not found, make sure local-search.js is loaded');
        console.warn('Local search requires the local-search.js file to be properly loaded');
    }
}

// Auto-initialize if config is available
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
        // Wait a bit for theme config to be set
        setTimeout(() => {
            if (!searchManager) {
                initMultiSearch();
            }
        }, 100);
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchEngineLoader, initMultiSearch };
}

// Global exports
window.SearchEngineLoader = SearchEngineLoader;
window.initMultiSearch = initMultiSearch;
