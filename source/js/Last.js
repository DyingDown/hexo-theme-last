var countForTriangleClick = 1;

function triangleClick() {
    if (countForTriangleClick == 1) {
        document.getElementById("payment-codes").style = "height:" + document.getElementById("me").offsetHeight + "px;display: block";
        document.getElementById("qrcode-triangle").style = "background:url(/img/person.png) no-repeat 0 0; "
        countForTriangleClick = 0;
    } else {
        document.getElementById("payment-codes").style = "height:" + document.getElementById("me").offsetHeight + "px;display:none";
        document.getElementById("qrcode-triangle").style = "background:url(/img/qrcode_icon.png) no-repeat 0 0; "
        countForTriangleClick = 1;
    }
    if (theme.donate.wechat !== true) {
        document.getElementById("alipay-button").style = "background-color:#d31a29;color:white";
    }
}

function wechatButtonClick() {
    document.getElementById("wechat").src = "/img/Wechat.jpg";
    document.getElementById("wechat-button").style = "background-color:#d31a29;color:white";
    document.getElementById("alipay-button").style = "background-color: transparent;color: #d31a29;";

}

function alipayButtonClick() {
    document.getElementById("wechat").src = "/img/Alipay.jpg"
    document.getElementById("alipay-button").style = "background-color: #d31a29;color: white;";
    document.getElementById("wechat-button").style = "background-color: transparent;color: #d31a29;";
}

// function backToTop() {
//     document.body.scrollIntoView({
//         behavior: "smooth"
//     });
// }

function backToComment() {
    var comment = document.getElementById("vcomment");
    comment.scrollIntoView({
        behavior: "smooth"
    });
}

function scrollDown() {
    var comment = document.getElementById("recent-posts");
    comment.scrollIntoView({
        behavior: "smooth"
    });
}

function closeSearch() {
    // let son = document.getElementById("search");
    // son.click(function(event) {
    //     event.stopPropgation();
    // })
    document.getElementById("search-overlay").style.display = "none";
}

function openSearch() {
    document.getElementById("search-overlay").style.display = "block";
}

function stopBubble(e) {
    // 非 IE 浏览器
    if (e && e.stopPropagation) {
        e.stopPropagation();
        return;
    }
    // IE 浏览器
    window.event.cancelBubble = true;
}

// back to top
(function() {
    let backTop = document.getElementsByClassName('goTop')[0]
    let goto = document.getElementById("goTo")
        // 监听滚动
    window.addEventListener('scroll', function() {
            if (document.documentElement.scrollTop > document.documentElement.clientHeight) {
                backTop.className = "goTop showBtn";
            } else if (document.documentElement.scrollTop <= document.documentElement.clientHeight) {
                backTop.className = "goTop hideBtn";
                goto.style.transform = "translateX(50% - 12px) translateY(-64px) rotate(-90deg)"
            }
        })
        // 为按钮绑定点击事件
    backTop.addEventListener('click', function() {
        function move() {
            // 当离顶部还有10的时候直接跳回
            if (document.documentElement.scrollTop < 10) {
                document.documentElement.scrollTop = 0;
                return false;
                // 否则每次回到当前离顶部距离的9/10处   
            } else {
                document.documentElement.scrollTop -= document.documentElement.scrollTop / 10
                return true;
            }
        }
        // 使用requestAnimationFrame做一个缓冲回到顶部
        requestAnimationFrame(function fn() {
            if (move()) {
                requestAnimationFrame(fn)
            }
        })
    })

})()