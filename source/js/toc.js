var toc_level_1 = document.getElementsByClassName(".toc-level-1")
toc_level_1.style = "visibility: hidden;"
window.addEventListener('scroll', function() {
    var scrollTop = this.scrollTop,
        topSeg = null;
    for (var i = 0; i < toc_level_1.length; i++) {
        if (toc_level_1[i].offsetTop > scrollTop) {
            continue;
        }
        if (!topSeg) {
            topSeg = toc_level_1[i];
        } else if (toc_level_1[i].offsetTop >= topSeg.offsetTop) {
            topSeg = toc_level_1[i];
        }
    }
});