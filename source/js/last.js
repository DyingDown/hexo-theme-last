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
