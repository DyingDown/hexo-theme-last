var carouselList = document.getElementsByClassName("postCarousel");
var postList = document.getElementsByClassName("postList")[0];
// add the first pic to the end
var firstP = carouselList[0].cloneNode(true);
postList.appendChild(firstP);

postList.style.width = 100 * carouselList.length + "vw";
var currentPictureIndex = 0;
var allDots = document.getElementsByClassName("navDot");
var preIndex = allDots.length - 1;
var widthOfCarousel = postList.clientWidth / carouselList.length;
var container = document.getElementsByClassName("carousel-container")[0];
var prevPic = container.getElementsByClassName("fa-chevron-left")[0];
var nextPic = container.getElementsByClassName("fa-chevron-right")[0];
var carouselContent = document.getElementsByClassName("carouselContent");

// make the dot be in the center
if (isCenter) {
    var Dots = document.getElementsByClassName("navDots")[0];
    var centerDot = (window.innerWidth - Dots.offsetWidth) / 2;
    Dots.style.left = centerDot + "px";
}


window.onresize = function() {
    postList.style.width = 100 * carouselList.length + "vw";
    widthOfCarousel = postList.clientWidth / carouselList.length;
    if (isCenter) {
        centerDot = (window.innerWidth - Dots.offsetWidth) / 2;
        Dots.style.left = centerDot + "px";
    }

}

// add and class to make the current dot able to modify by css
function setDotClass() {
    if (allDots[preIndex].classList.contains("currentDot"))
        allDots[preIndex].classList.remove("currentDot");
    allDots[currentPictureIndex].classList.add("currentDot");
}
// set the first dot to the currentDot
setDotClass();
// set onclick function for all navigation dots
for (var i = 0; i < allDots.length; i++) {
    // add index function for each dot
    allDots[i].num = i;
    // add function for each dot
    allDots[i].onclick = function() {
        // close auto change timer
        clearInterval(timer);

        // revise the index of current picture
        preIndex = currentPictureIndex;
        currentPictureIndex = this.num;
        // change pictures
        setDotStyle();
        move(postList, "left", -widthOfCarousel * currentPictureIndex, 80, function() {
            autoCarousel();
        });
    };
}

// next pic
nextPic.onclick = function() {
    clearInterval(timer);
    preIndex = currentPictureIndex;
    currentPictureIndex++;
    currentPictureIndex %= carouselList.length;
    setDotStyle();
    move(postList, "left", -widthOfCarousel * currentPictureIndex, 80, function() {
        autoCarousel();
    });
}

// previous pic
prevPic.onclick = function() {
    if (currentPictureIndex != 0) {
        clearInterval(timer);
        preIndex = currentPictureIndex;
        currentPictureIndex--;
        currentPictureIndex %= carouselList.length;
        setDotStyle();
        move(postList, "left", -widthOfCarousel * currentPictureIndex, 80, function() {
            autoCarousel();
        });
    }
}

// automatically change pictures
autoCarousel();
// creat a method to set style of dots
function setDotStyle() {
    // if is the last picture
    if (currentPictureIndex >= carouselList.length - 1) {
        // set index to 0
        currentPictureIndex = 0;
        // the last and the first pic are the same
        // so set css to quickly change position
        // because they are the same, we won't see the change process
        postList.style.left = 0;

    }
    // traverse all dots and set color
    for (var i = 0; i < allDots.length; i++) {
        allDots[i].style.backgroundColor = "";
    }
    setDotClass();
}
var timer; // auto change timer
// auto change pictures in carousel function
function autoCarousel() {
    // start a timer
    timer = setInterval(function() {
        preIndex = currentPictureIndex;
        currentPictureIndex++;
        currentPictureIndex %= carouselList.length;
        move(postList, "left", -widthOfCarousel * currentPictureIndex, 80, function() {
            setDotStyle();
        });
    }, 3000);
}