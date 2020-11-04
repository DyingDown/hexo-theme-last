window.onload = function() {
    // Progress bar

    var progressBar = document.getElementById("progress-bar");
    var percent = document.getElementById("percent");
    var totalHeight = document.body.scrollHeight - window.innerHeight;

    // share and toc Top adsorption
    if (document.body.offsetWidth >= 1200) {
        let toc = document.getElementById("sidebar-toc"),
            H = 0,
            Y = toc;
        while (Y) {
            H += Y.offsetTop;
            Y = Y.offsetParent;
        }
        let share = document.getElementById("shareButtonsInner"),
            Hs = 0,
            Ys = share;
        while (Ys) {
            Hs += Ys.offsetTop;
            Ys = Ys.offsetParent;
        }
        window.onscroll = function() {

            // Progress Bar
            var progress = (window.pageYOffset / totalHeight) * 100;
            progressBar.style.width = progress + "%";
            percent.innerHTML = Math.floor(progress) + "%";

            // share and toc Top adsorption

            // catalogTrack();
            let ss = document.body.scrollTop || document.documentElement.scrollTop;
            if (ss > Hs - 300) {
                let shareOuter = document.getElementById("shareButtons");
                let widths = shareOuter.offsetWidth;
                share.style = "position:fixed;top:13rem;width:" + widths + "px";
            } else {
                share.style = "";
            }
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
    } else {
        window.onscroll = function() {
            // Progress Bar
            var progress = (window.pageYOffset / totalHeight) * 100;
            progressBar.style.width = progress + "%";
            percent.innerHTML = Math.floor(progress) + "%";
        }
    }
}