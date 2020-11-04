const catalogTrack = () => {
    let $currentHeading = $('h2');
    for (let heading of $('h1,h2,h3,h4,h5,h6')) {
        const $heading = $(heading);
        if ($heading.offset().top - $(document).scrollTop() > 80) {
            break;
        }
        $currentHeading = $heading;
    }
    // alert($currentHeading.attr('tag'))
    $currentHeading.css("color", "red")
    const anchorName = $currentHeading.attr('id');
    const $catalog = $(`.catalog[name="${anchorName}"]`);
    alert($catalog.attr('id'))
    if (!$catalog.hasClass('catalog-active')) {
        $('.catalog-active').removeClass('catalog-active');
        $catalog.addClass('catalog-active');
    }
};


// var toc_level_1 = document.getElementsByClassName(".toc-level-1")
// toc_level_1.style = "visibility: hidden;"
// window.addEventListener('scroll', function() {
//     var scrollTop = this.scrollTop,
//         topSeg = null;
//     for (var i = 0; i < toc_level_1.length; i++) {
//         if (toc_level_1[i].offsetTop > scrollTop) {
//             continue;
//         }
//         if (!topSeg) {
//             topSeg = toc_level_1[i];
//         } else if (toc_level_1[i].offsetTop >= topSeg.offsetTop) {
//             topSeg = toc_level_1[i];
//         }
//     }
// });