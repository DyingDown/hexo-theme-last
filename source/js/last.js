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

// if (isHome == false) {
//     menuOuter.style.backgroundColor = "#ffffff";
// }


/********** toc fix **********/


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


window.addEventListener("scroll", function() {
    // if (isHome) {
    if (this.window.scrollY > 0) {
        modifyClass(menuOuter, "newMenuOuterColor", 1);
    } else {
        modifyClass(menuOuter, "newMenuOuterColor", 0);
    }
    // }
    /******** fix toc *******/
    let s = document.body.scrollTop || document.documentElement.scrollTop;
    if (typeof(toc) != 'undefined') {
        if (s > H - 100) {
            let sidebar = document.getElementById("toc-col");
            let width = sidebar.offsetWidth;
            toc.style = "position:fixed;top:50px;width:" + width + "px";
        } else {
            toc.style = "";
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
// searchInput.on
searchInput.onclick = function(){ 
    getSearchFile(); 
    this.onclick = null;
}
// searchInput.onkeydown = function(){ 
//     if(event.keyCode == 13) 
//         return false;
// }

/********** alert message ********/
const message = new Message();

document.getElementById('test-info').addEventListener('click', () => {
    message.show({
        type: 'info',
        text: '此路是我开，此树是我开，要想从此过，拿出买路钱！',
        duration: 0,
        isClose: true
    });
});

document.getElementById('test-warning').addEventListener('click', () => {
    message.show({
        type: 'warning',
        text: '借贷有风险，不还钱小心被打！',
        duration: 2000,
        isClose: true
    });
});
document.getElementById('test-error').addEventListener('click', () => {
    message.show({
        type: 'error',
        text: '您的余额不够，请速速去借钱！',
        duration: 5000,
        isClose: true
    });
});
document.getElementById('test-success').addEventListener('click', () => {
    message.show({
        type: 'success',
        text: '您已交钱，放您通行！但是，这个钱只是通行费用，如果你要想从这个路过去，必须乘坐我们专用的交通工具。车子本身不收钱，但是发动它需要付钱，发动一次付款100元哦~',
        duration: 5000,
        isClose: true
    });
});