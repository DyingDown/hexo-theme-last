/**
 * Tags Page Interactive Features
 * - Alphabet navigation with smooth scrolling
 * - Tag search with real-time filtering
 * - Active letter highlighting
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on tags page and alphabet index is enabled
    if (!document.getElementById('tags')) return;
    
    // Check if alphabet index features exist (only loaded when enabled)
    if (!document.querySelector('.alphabet-nav')) {
        console.log('Traditional tags mode - alphabet index features disabled');
        return;
    }
    
    console.log('Alphabet index mode - initializing enhanced features');
    
    // Initialize features
    initAlphabetNavigation();
    initTagSearch();
    initScrollSpy();
    initAlphabetState(); // 初始化字母导航状态
});

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
