var countForListButtonClick = 1;

function ShowMenu() {
    if (countForListButtonClick == 1) {
        var side = document.getElementById("top");
        side.style = "left: 0px !important;border-right: 1px #eeeeee solid";
        document.getElementById("phoneButton").style = "margin-left: 220px;position: fixed";
        countForListButtonClick = 0;
        // document.getElementById("content-inner").style = "margin-left: 220px;"
        document.getElementsByClassName("awesome-iframe")[0].style = "diplay:none";
        document.getElementsByClassName("overlay").style = "opacity: 0.6;"
    } else {
        var side1 = document.getElementById("top");
        side1.style = "left: -200px;border: none";
        document.getElementById("phoneButton").style = "margin-left: 20px";
        countForListButtonClick = 1;
        // document.getElementById("content-inner").style = "margin-left: 0px"
        document.getElementsByClassName("awesome-iframe")[0].style = "diplay:block";
        document.getElementsByClassName("overlay").style = "opacity: 0;"
    }
}