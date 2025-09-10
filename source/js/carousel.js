// Carousel state management
var CarouselManager = {
    carouselList: null,
    postList: null,
    currentPictureIndex: 0,
    preIndex: 0,
    allDots: null,
    widthOfCarousel: 0,
    container: null,
    prevPic: null,
    nextPic: null,
    timer: null,
    isTransitioning: false,
    
    init: function() {
        this.carouselList = document.getElementsByClassName("postCarousel");
        this.postList = document.getElementsByClassName("postList")[0];
        
        if (!this.carouselList.length || !this.postList) {
            console.warn('Carousel elements not found');
            return false;
        }
        
        // add the first pic to the end for seamless loop
        var firstP = this.carouselList[0].cloneNode(true);
        this.postList.appendChild(firstP);
        
        this.allDots = document.getElementsByClassName("navDot");
        this.container = document.getElementsByClassName("carousel-container")[0];
        this.prevPic = this.container.getElementsByClassName("fa-chevron-left")[0];
        this.nextPic = this.container.getElementsByClassName("fa-chevron-right")[0];
        
        this.updateDimensions();
        this.preIndex = this.allDots.length - 1;
        
        return true;
    },
    
    updateDimensions: function() {
        if (!this.postList || !this.carouselList.length) return;
        
        this.postList.style.width = 100 * this.carouselList.length + "vw";
        this.widthOfCarousel = this.postList.clientWidth / this.carouselList.length;
        
        // Recalculate position after resize
        this.postList.style.left = -this.widthOfCarousel * this.currentPictureIndex + "px";
    }
};

// Initialize carousel
if (!CarouselManager.init()) {
    // Exit if initialization failed
    console.warn('Carousel initialization failed');
} else {
    var carouselList = CarouselManager.carouselList;
    var postList = CarouselManager.postList;
    var currentPictureIndex = CarouselManager.currentPictureIndex;
    var allDots = CarouselManager.allDots;
    var preIndex = CarouselManager.preIndex;
    var widthOfCarousel = CarouselManager.widthOfCarousel;
    var container = CarouselManager.container;
    var prevPic = CarouselManager.prevPic;
    var nextPic = CarouselManager.nextPic;
    var carouselContent = document.getElementsByClassName("carouselContent");

    // Center dots if needed
    function centerDots() {
        if (typeof isCenter !== 'undefined' && isCenter) {
            var Dots = document.getElementsByClassName("navDots")[0];
            if (Dots) {
                var centerDot = (window.innerWidth - Dots.offsetWidth) / 2;
                Dots.style.left = centerDot + "px";
            }
        }
    }
    
    centerDots();

    // Improved resize handling with debouncing
    var resizeTimeout;
    window.onresize = function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Stop current animations
            clearInterval(CarouselManager.timer);
            CarouselManager.isTransitioning = false;
            
            // Update dimensions
            CarouselManager.updateDimensions();
            widthOfCarousel = CarouselManager.widthOfCarousel;
            
            // Center dots
            centerDots();
            
            // Ensure correct dot state
            setDotClass();
            
            // Restart auto carousel
            autoCarousel();
        }, 150); // Debounce resize events
    };
}

    // Improved dot class management
    function setDotClass() {
        // Clear all dots first to prevent multiple active states
        for (var i = 0; i < allDots.length; i++) {
            allDots[i].classList.remove("currentDot");
        }
        
        // Ensure currentPictureIndex is within valid range
        var dotIndex = CarouselManager.currentPictureIndex;
        if (dotIndex >= allDots.length) {
            dotIndex = 0;
        }
        
        // Set current dot
        if (allDots[dotIndex]) {
            allDots[dotIndex].classList.add("currentDot");
        }
        
        // Update global index
        currentPictureIndex = CarouselManager.currentPictureIndex;
    }
    // set the first dot to the currentDot
    setDotClass();
    
    // set onclick function for all navigation dots
    for (var i = 0; i < allDots.length; i++) {
        // add index function for each dot
        allDots[i].num = i;
        // add function for each dot
        allDots[i].onclick = function() {
            // Prevent multiple clicks during transition
            if (CarouselManager.isTransitioning) return;
            
            // close auto change timer
            clearInterval(CarouselManager.timer);
            CarouselManager.isTransitioning = true;

            // revise the index of current picture
            CarouselManager.preIndex = CarouselManager.currentPictureIndex;
            CarouselManager.currentPictureIndex = this.num;
            
            // Update global variables
            preIndex = CarouselManager.preIndex;
            currentPictureIndex = CarouselManager.currentPictureIndex;
            
            // change pictures
            setDotClass();
            move(postList, "left", -widthOfCarousel * currentPictureIndex, 80, function() {
                CarouselManager.isTransitioning = false;
                autoCarousel();
            });
        };
    }

    // next pic
    nextPic.onclick = function() {
        if (CarouselManager.isTransitioning) return;
        
        clearInterval(CarouselManager.timer);
        CarouselManager.isTransitioning = true;
        
        CarouselManager.preIndex = CarouselManager.currentPictureIndex;
        CarouselManager.currentPictureIndex++;
        CarouselManager.currentPictureIndex %= carouselList.length;
        
        // Update global variables
        preIndex = CarouselManager.preIndex;
        currentPictureIndex = CarouselManager.currentPictureIndex;
        
        setDotClass();
        move(postList, "left", -widthOfCarousel * currentPictureIndex, 80, function() {
            setDotStyle();
            CarouselManager.isTransitioning = false;
            autoCarousel();
        });
    };

    // previous pic
    prevPic.onclick = function() {
        if (CarouselManager.isTransitioning || CarouselManager.currentPictureIndex === 0) return;
        
        clearInterval(CarouselManager.timer);
        CarouselManager.isTransitioning = true;
        
        CarouselManager.preIndex = CarouselManager.currentPictureIndex;
        CarouselManager.currentPictureIndex--;
        if (CarouselManager.currentPictureIndex < 0) {
            CarouselManager.currentPictureIndex = carouselList.length - 1;
        }
        
        // Update global variables
        preIndex = CarouselManager.preIndex;
        currentPictureIndex = CarouselManager.currentPictureIndex;
        
        setDotClass();
        move(postList, "left", -widthOfCarousel * currentPictureIndex, 80, function() {
            CarouselManager.isTransitioning = false;
            autoCarousel();
        });
    };

    // creat a method to set style of dots
    function setDotStyle() {
        // if is the last picture (seamless loop handling)
        if (CarouselManager.currentPictureIndex >= carouselList.length - 1) {
            // set index to 0 for dot display
            CarouselManager.currentPictureIndex = 0;
            currentPictureIndex = 0;
            // the last and the first pic are the same
            // so set css to quickly change position
            // because they are the same, we won't see the change process
            postList.style.left = 0;
        }
        
        // Clear all dot background colors
        for (var i = 0; i < allDots.length; i++) {
            allDots[i].style.backgroundColor = "";
        }
        
        // Update dot class
        setDotClass();
    }

    // auto change pictures in carousel function
    function autoCarousel() {
        // Clear existing timer
        clearInterval(CarouselManager.timer);
        
        // start a timer
        CarouselManager.timer = setInterval(function() {
            // Don't auto-advance during manual transitions
            if (CarouselManager.isTransitioning) return;
            
            CarouselManager.preIndex = CarouselManager.currentPictureIndex;
            CarouselManager.currentPictureIndex++;
            CarouselManager.currentPictureIndex %= carouselList.length;
            
            // Update global variables
            preIndex = CarouselManager.preIndex;
            currentPictureIndex = CarouselManager.currentPictureIndex;
            
            move(postList, "left", -widthOfCarousel * currentPictureIndex, 80, function() {
                setDotStyle();
            });
        }, 6500);
    }

    // automatically change pictures
    autoCarousel();
    
    // Handle page visibility changes to prevent issues when switching tabs
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(CarouselManager.timer);
        } else {
            // Restart carousel when page becomes visible
            setTimeout(function() {
                if (!CarouselManager.isTransitioning) {
                    autoCarousel();
                }
            }, 500);
        }
    });