document.addEventListener("DOMContentLoaded", function (event) {
    // Get the modal
    var modal = document.getElementById("modal");

    // Get the button that opens the modal
    var btn = document.getElementById("dlgBttn");

    // When the user clicks on the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // table toggler
    var tabletoggler = document.getElementById("tableToggler");
    var controlbar = document.getElementById("controlbar");
    tabletoggler.onclick = function () {
        if(controlbar.style.display === "none") {
            controlbar.style.display = "";
            tabletoggler.style.backgroundImage = "url(./images/hide.png)";
        } else {
            controlbar.style.display = "none";
            tabletoggler.style.backgroundImage = "url(./images/show.png)";
        }
    }

    document.getElementById("chooser").addEventListener("onLocoChange", (e) => {
        modal.style.display = "none";
        var lococontrols = document.getElementsByClassName("lococontrol");
        for (var i = 0; i < lococontrols.length; i++) {
            lococontrols.item(i).setAttribute('loco-id', e.detail.locoid);
        }
    });

    let rocweburl = new URL(window.location).searchParams.get("rocweb");
    if(!rocweburl) {
        rocweburl = "http://localhost:8088";
    }
    document.getElementById("rocwebiframe").setAttribute("src",rocweburl);
});	