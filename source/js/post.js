window.onload = function() {
    let toc = document.getElementById("sidebar-toc"),
        H = 0,
        Y = toc;
    // toc.style = "margin-left:20px;"
    while (Y) {
        H += Y.offsetTop;
        Y = Y.offsetParent;
    }
    // console.alert(H)
    window.onscroll = function() {
        let s = document.body.scrollTop || document.documentElement.scrollTop;
        if (s > H - 100) {
            let sidebar = document.getElementsByClassName("side-bar")[0];
            let width = sidebar.offsetWidth;
            toc.style = "position:fixed;top:50px;width:" + width + "px";
            // toc.width = 30
        } else {
            toc.style = "";
        }
    }
}