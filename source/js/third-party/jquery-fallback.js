/**
 * jQuery Fallback and Dependency Check
 * 确保 jQuery 正确加载，提供备用方案
 */

(function() {
    'use strict';
    
    // 检查 jQuery 是否已加载
    function checkjQuery() {
        return typeof jQuery !== 'undefined' && typeof $ !== 'undefined';
    }
    
    // 加载备用 jQuery
    function loadFallbackjQuery() {
        console.warn('Loading fallback jQuery...');
        
        const fallbackUrls = [
            'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
            'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js',
            'https://code.jquery.com/jquery-3.7.1.min.js'
        ];
        
        function tryLoadjQuery(index = 0) {
            if (index >= fallbackUrls.length) {
                console.error('All jQuery CDN fallbacks failed');
                return;
            }
            
            const script = document.createElement('script');
            script.src = fallbackUrls[index];
            script.onload = function() {
                console.log('jQuery loaded successfully from:', fallbackUrls[index]);
                // 触发 jQuery 就绪事件
                if (typeof window.jQueryReady === 'function') {
                    window.jQueryReady();
                }
            };
            script.onerror = function() {
                console.warn('Failed to load jQuery from:', fallbackUrls[index]);
                tryLoadjQuery(index + 1);
            };
            
            document.head.appendChild(script);
        }
        
        tryLoadjQuery();
    }
    
    // 等待 DOM 加载完成后检查 jQuery
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                if (!checkjQuery()) {
                    loadFallbackjQuery();
                }
            }, 1000); // 给主 jQuery 1秒加载时间
        });
    } else {
        setTimeout(function() {
            if (!checkjQuery()) {
                loadFallbackjQuery();
            }
        }, 1000);
    }
    
    // 全局 jQuery 状态检查函数
    window.waitForjQuery = function(callback, timeout = 10000) {
        const startTime = Date.now();
        
        function check() {
            if (checkjQuery()) {
                callback();
            } else if (Date.now() - startTime < timeout) {
                setTimeout(check, 100);
            } else {
                console.error('jQuery failed to load within timeout');
                callback(new Error('jQuery timeout'));
            }
        }
        
        check();
    };
    
})();
