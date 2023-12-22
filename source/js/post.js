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
var payDiv = document.getElementById("payment-code");
var isQB = true;

qrButton.onclick = function() {
    if (isQB) {
        // qrButton.src = "/img/person.svg";
        changeToPerson(qrButton)
        isQB = false;
        auInfo.style.display = "none";
        payDiv.style.display = "block";
    } else {
        // qrButton.src = "/img/qrcode_icon.svg";
        changeToQrcode(qrButton)
        isQB = true;
        auInfo.style.display = "block";
        payDiv.style.display = "none";
    }
}

// click button to change qr code img
document.addEventListener('DOMContentLoaded', function() {
    let paymentButtons = document.getElementsByClassName("paymentButtons");
    [...paymentButtons].forEach(function(payBt) {
        payBt.onclick = function() {
            [...paymentButtons].forEach(function(otherBt) {
                modifyClass(otherBt, "selected", 0);
            });
            // console.log(payBt.innerHTML)
            modifyClass(payBt, "selected", 1);
            let qrCodeUrl = "/img/";
            if(payBt.id == "alipay") {
                qrCodeUrl += "alipay.jpg";
            }
            
            if(payBt.id == "wechat") {
                qrCodeUrl += "wechat.jpg";
            }
            if(payBt.id == "zelle") {
                qrCodeUrl += "zelle.jpg";
            }
            
            payImg.src = qrCodeUrl;
        }
    });
  });


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


/******** code block style ************/
var codes = document.getElementsByClassName("highlight");
// console.log(codes)
for (var i = 0; i < codes.length; i++) {
    AddLanguageName(codes[i], i);
}

function AddLanguageName(pre, index) {
    var language = pre.className.split(" ")[1].toUpperCase();
    if (language == 'HLJS') language = 'TEXT'
    if (language == 'JS') language = 'JavaScript'
    if (language == 'MD') language = 'MarkDown'
    if (language == 'PY') language = 'PYTHON'

    // if codeblock has a <figcaption></figcaption>
    var Figcaption = pre.querySelector('figcaption');
    console.log(Figcaption);
    if(Figcaption != null) {
        // pre.parentNode.insertBefore(Figcaption, pre);
        pre.removeChild(Figcaption);
    }

    // set code blocks class to help do copy
    var code = pre.children[0].children[0].children[0].children[1];
    code.setAttribute("class", "codeblock-content")
    code.setAttribute("id", "codeblock-" + index.toString())

    
    // add header to the codeblock
    var preHeader = document.createElement("div")
    preHeader.setAttribute("class", "code-block-header")
    var langName = document.createElement("span")
    langName.setAttribute("class", "code-lang")
    langName.innerHTML = language;

    var codeblockButtons = document.createElement("span")
    codeblockButtons.className = "codeblock-buttons"
    codeblockButtons.innerHTML = `
        <span class="code-copy-button" data-index="${index}">
            <i class="fa-solid fa-copy"></i>
        </span>
    `
        // add copy icon 
    var fullscreenBtn = document.createElement("span")
    fullscreenBtn.setAttribute("class", "code-copy-button")
    fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>'
        // var expandIcon = document.createElement("i");
        // expandIcon.className = "fa-solid fa-copy";
        // fullscreenBtn.appendChild(expandIcon);
        // fullscreenBtn.setAttribute("data-index", index)
        // expandIcon.addEventListener('click', copyContents);

    codeblockButtons.appendChild(fullscreenBtn)
    preHeader.appendChild(langName);
    if(Figcaption) {
        while (Figcaption.firstChild) {
            Figcaption.firstChild.setAttribute("class", "code-info")
            preHeader.appendChild(Figcaption.firstChild);
        }
    }
    preHeader.appendChild(codeblockButtons);

    pre.parentNode.insertBefore(preHeader, pre)
    setCodeFullScreen(preHeader, pre, fullscreenBtn)
}


function setCodeFullScreen(preHead, codeblock, btn) {
    btn.addEventListener('click', function() {
        if (codeblock.classList.contains('code-block-fullscreen')) {
            codeblock.classList.remove('code-block-fullscreen');
            preHead.classList.remove('code-head-fullscreen')
            document.documentElement.classList.remove('code-block-fullscreen-html-scroll');
        } else {
            codeblock.classList.add('code-block-fullscreen');
            preHead.classList.add('code-head-fullscreen')
            document.documentElement.classList.add('code-block-fullscreen-html-scroll');
        }
    });
}

window.onload = function() {
    const vquoteElements = document.querySelectorAll('.vquote');
    console.log(vquoteElements)
    vquoteElements.forEach(vquoteElement => {
        console.log(vquoteElement)
        const parentElement = vquoteElement.parentElement;
        parentElement.parentElement.insertBefore(vquoteElement, parentElement.nextSibling);
    });
    console.log(569);
};