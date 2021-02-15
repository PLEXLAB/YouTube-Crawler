function displayOverlay(text) {
    $("<div id='overlay'>" + text + "</div>").css({
        "position": "fixed",
        "top": 0,
        "left": 0,
        "width": "100%",
        "height": "100%",
		"align" : "center",
        "background-color": "rgba(128,128,128,0.75)",
        "z-index": 10000,
        "vertical-align": "middle",
        "text-align": "left",
        "color": "#000",
        "font-size": "30px",
		"font-family": "sans-serif",
        "font-weight": "bold",
        "cursor": "wait"
    }).appendTo("body");
}

function removeOverlay() {
    $("#overlay").remove();
}