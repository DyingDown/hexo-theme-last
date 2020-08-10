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

function backToTop() {
    document.body.scrollIntoView({
        behavior: "smooth"
    });
}

function backToComment() {
    var comment = document.getElementById("vcomment");
    comment.scrollIntoView({
        behavior: "smooth"
    });
}

function backToBottom() {
    var comment = document.getElementById("bottom-inner");
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