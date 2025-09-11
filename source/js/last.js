/*********show menu in phone or else device *******/
var menuIcon = document.getElementsByClassName("menu-icon")[0]
var menuClickFlag = 0;
var menuOuter = document.getElementById("menu-outer");

/****** add or remove a class  *************/
function modifyClass(obj, className, op) { // op = 1 add; op == 0 remove
    if (op == 1) {
        obj.classList.add(className);
    } else {
        if (obj.classList.contains(className)) {
            obj.classList.remove(className);
        }
    }
}

/******* insert After **********/
function insertAfter(newElement, targetElement) { // newElement是要追加的元素 targetElement 是指定元素的位置 
    var parent = targetElement.parentNode; // 找到指定元素的父节点 
    if (parent.lastChild == targetElement) { // 判断指定元素的是否是节点中的最后一个位置 如果是的话就直接使用appendChild方法 
        parent.appendChild(newElement, targetElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    };
};


/******* drawer header close and open function *********/
menuIcon.onclick = function() {
    var first = this.childNodes[0];
    var second = this.childNodes[1];
    var third = this.childNodes[2];
    var nav = document.getElementById("nav");
    if (menuClickFlag == 0) {
        modifyClass(second, "newSecondLine", 1);
        modifyClass(first, "newFirstLine", 1);
        modifyClass(third, "newThirdLine", 1);
        modifyClass(nav, "newNav", 1);
        modifyClass(menuOuter, "newMenuOuter", 1);
        menuClickFlag = 1;
    } else {
        modifyClass(second, "newSecondLine", 0);
        modifyClass(first, "newFirstLine", 0);
        modifyClass(third, "newThirdLine", 0);
        modifyClass(nav, "newNav", 0);
        menuClickFlag = 0;
        modifyClass(menuOuter, "newMenuOuter", 0);
    }

}

/******** change header transparency when scroll ********/
window.addEventListener("scroll", function() {
    // 确保menuOuter存在
    if (!menuOuter) return;
    
    const scrollTop = window.scrollY; // 当前滚动高度
    const maxScroll = 400; // 滚动达到 400px 时完全不透明
    
    // 检查页面类型
    const isPostPage = document.body.classList.contains('post');
    const isHomePage = document.body.classList.contains('home');
    
    if (isPostPage) {
        // Post页面：保持原有的固定背景和阴影
        return;
    } else if (isHomePage) {
        // Home页面：透明度渐变效果 + 阴影效果
        const headerOpacity = Math.min(scrollTop / maxScroll, 1);
        
        // 设置背景色渐变（目标颜色为 $bg = #202020，即 rgb(32, 32, 32)）
        menuOuter.style.backgroundColor = `rgba(32, 32, 32, ${headerOpacity})`;
        
        // 添加阴影效果
        if (scrollTop > 50) {
            menuOuter.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        } else {
            menuOuter.style.boxShadow = 'none';
        }
    } else {
        // 其他页面（tags、categories、archive等）：固定背景色，滚动时添加阴影
        if (scrollTop > 50) {
            // 滚动超过50px时添加阴影
            menuOuter.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        } else {
            // 回到顶部时移除阴影
            menuOuter.style.boxShadow = 'none';
        }
    }
});


/****** go to top button ******/
var backToTopButton = document.getElementById("back-to-top")
var toCommentButton = document.getElementById("go-to-comment")
if (backToTopButton != null) {
    backToTopButton.addEventListener("click", () => {
        document.body.scrollIntoView({
            behavior: "smooth",
        });
    })
}


var commentBox = document.getElementById("vcomment")
var menuA = document.getElementById("menu-outer")
if (toCommentButton != null && commentBox != null && menuA != null) {
    toCommentButton.addEventListener("click", () => {
        var height = 0;
        t = commentBox;
        do {
            height += t.offsetTop;
            t = t.offsetParent;
        }while(t != document.body)
        window.scrollTo({
            top: height - 80,
            behavior: "smooth",
        })
    })
}


/********* search *********/
searchInput = document.getElementById("local-search-input")
if (searchInput) {
    // Skip if multi-search is already initialized (avoid conflicts)
    if (window.searchManager || window.searchInitialized) {
        console.log('Search already initialized by multi-search engine, skipping last.js search handler');
    } else {
        // Check search engine type from config
        const searchConfig = window.themeConfig?.search;
        
        if (searchConfig && searchConfig.enable) {
            const engine = searchConfig.engine || 'lunr';
            
            if (engine === 'lunr' && typeof initLunrSearch === 'function') {
                // Use Lunr.js search (fastest)
                searchInput.onclick = function() {
                    window.lunrSearchInstance = initLunrSearch(searchConfig.lunr || {});
                    console.log('Lunr.js search activated');
                    this.onclick = null;
                };
            } else if (typeof initMultiSearch === 'function') {
                // Use multi-search system
                searchInput.onclick = function() {
                    if (!window.searchManager) {
                        window.searchManager = initMultiSearch();
                    }
                    this.onclick = null;
                };
            } else {
                // Fallback to original search
                searchInput.onclick = function(){ 
                    getSearchFile(); 
                    this.onclick = null;
                };
            }
        } else {
            // Legacy compatibility
            searchInput.onclick = function(){ 
                getSearchFile(); 
                this.onclick = null;
            };
        }
    }
}
// searchInput.onkeydown = function(){ 
//     if(event.keyCode == 13) 
//         return false;
// }

/********** alert message ********/
const message = new Message();

// Add safe event listeners with null checks
const testInfo = document.getElementById('test-info');
if (testInfo) {
    testInfo.addEventListener('click', () => {
        message.show({
            type: 'info',
            text: '此路是我开，此树是我开，要想从此过，拿出买路钱！',
            duration: 0,
            isClose: true
        });
    });
}

const testWarning = document.getElementById('test-warning');
if (testWarning) {
    testWarning.addEventListener('click', () => {
        message.show({
            type: 'warning',
            text: '借贷有风险，不还钱小心被打！',
            duration: 2000,
            isClose: true
        });
    });
}

const testError = document.getElementById('test-error');
if (testError) {
    testError.addEventListener('click', () => {
        message.show({
            type: 'error',
            text: '您的余额不够，请速速去借钱！',
            duration: 5000,
            isClose: true
        });
    });
}

const testSuccess = document.getElementById('test-success');
if (testSuccess) {
    testSuccess.addEventListener('click', () => {
        message.show({
            type: 'success',
            text: '您已交钱，放您通行！但是，这个钱只是通行费用，如果你要想从这个路过去，必须乘坐我们专用的交通工具。车子本身不收钱，但是发动它需要付钱，发动一次付款100元哦~',
            duration: 5000,
            isClose: true
        });
    });
}