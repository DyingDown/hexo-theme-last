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