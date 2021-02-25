/********** set share function position  ***********/
var share = document.getElementById("share-col");
var shareIn = document.getElementById("shareButtons")
var midCol = document.getElementById("mid-col");
var postTitles = document.getElementById("titles");
var postDate = document.getElementsByClassName("date")[0];
// alert(midCol);
var sharePos = 1; // out of post content; also used for .date
function setSharePos() {
    if (window.innerWidth < 940) {
        if (sharePos == 1) {
            insertAfter(share, postTitles);
            document.getElementById("post-information").appendChild(postDate);
            sharePos = 0;
            modifyClass(shareIn, "newShare", 1);
        }
    } else {
        if (sharePos == 0) {
            midCol.parentNode.insertBefore(share, midCol);
            modifyClass(shareIn, "newShare", 0);
            document.getElementById("first-line").appendChild(postDate);
            sharePos = 1;
        }
    }
}
setSharePos();
window.onresize = function() {
    setSharePos();
}

/************* qr code DONATE function  **********/
var qrButton = document.getElementsByClassName("qrButton")[0];
var auInfo = document.getElementsByClassName("au-info")[0];

var payImg = document.getElementsByClassName("pay-code")[0];
var wechatBt = document.getElementsByClassName("wechat")[0];
var alipayBt = document.getElementsByClassName("alipay")[0];
var firstPBt = document.getElementsByClassName("payButtons")[0].firstChild;
var payDiv = document.getElementById("payment-code");
var isQB = true;
modifyClass(firstPBt, "newPayBt", 1);

qrButton.onclick = function() {
    if (isQB) {
        qrButton.src = "/img/person.png";
        isQB = false;
        auInfo.style.display = "none";
        payDiv.style.display = "block";
    } else {
        qrButton.src = "/img/qrcode_icon.png";
        isQB = true;
        auInfo.style.display = "block";
        payDiv.style.display = "none";
    }
}

wechatBt.onclick = function() {
    modifyClass(alipayBt, "newPayBt", 0);
    modifyClass(wechatBt, "newPayBt", 1);
    payImg.src = "/img/wechat.jpg";
}
alipayBt.onclick = function() {
    modifyClass(alipayBt, "newPayBt", 1);
    modifyClass(wechatBt, "newPayBt", 0);
    payImg.src = "/img/alipay.jpg";
}

/*********** toc ***********/

var toc = document.getElementById("sidebar-toc"),
    H = 0,
    Y = toc;
while (Y) {
    H += Y.offsetTop;
    Y = Y.offsetParent;
}

// add an unique id to each heading
var uniqId = function(h = 6) {
    let i = 0,
        hn = 1;
    let postCt = document.getElementById("post-content");
    // alert(postCt);
    for (; hn <= h; hn++) {
        let strh = 'h' + hn;
        // alert(strh);
        let heading = postCt.getElementsByTagName(strh);
        for (var j = 0; j < heading.length; j++) {
            heading[j].id = "last-" + i;
            i++;
        }
    }
}

uniqId();

/********* initialize a toc  **********/
// using tocbot API
tocbot.init({
    // Where to render the table of contents.
    tocSelector: '#tocs', // 放置目录的容器
    // Where to grab the headings to build the table of contents.
    contentSelector: '#post-content', // 正文内容所在
    // Which headings to grab inside of the contentSelector element.
    headingSelector: 'h1, h2, h3, h4, h5', // 需要索引的标题级别
    // scrollSmoothOffset: 50
});