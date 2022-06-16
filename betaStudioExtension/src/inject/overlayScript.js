function displayOverlay(text) {
	$("<div id='overlay'></div>").css({
        "position": "fixed",
        "top": 0,
        "left": 0,
        "width": "100%",
        "height": "100%",
		"align" : "center",
        "z-index": 10000,
        "vertical-align": "middle",
        "text-align": "left",
		"background-color": "rgba(0,0,0,0.50)",// this part was changed
        "color": "#2B2B2B",
		"opacity":"1",
        "cursor": "wait"
    }).appendTo("body");
	
	$("<div><div>"+text+"</div></div>").css({
        "position": "fixed",
        "height"  : "15%",
		"left"    : "20%",
		"right"   : "15%",
		"bottom"  : "0",
		"color"   : "white",
		"align"   : "center",
        "text-align" : "center",
		"font-size"  : "25px",
		"font-family": "sans-serif",
        "font-weight": "bold",
		"vertical-align"  : "middle",
		"z-index"    : "3",
		"background-color":"#000000"
    }).appendTo("#overlay");
	
	// Add Left Image to the bottom overlay
	var imgFile = 'src/inject/LightBanner.png';
	var url = chrome.extension.getURL(imgFile);
	$("<div><img src='" + url + "' style='opacity:0.5;width:100%;height:100%;'></div>").css({
        "position": "fixed",
        "width"   : "20%",
		"height"  : "15%",
		"left"    : "0",
		"z-index" : "3",
		"bottom"  : "0"
    }).appendTo("#overlay");
	// Add Right Image to the bottom overlay
	imgFile = 'src/inject/NM_State_Mark.png';
	url = chrome.extension.getURL(imgFile);
	$("<div><img src='" + url + "' style='opacity:0.5;width:100%;height:100%;'></div>").css({
        "position": "fixed",
        "width"   : "15%",
		"height"  : "15%",
		"right"   : "0",
		"z-index" : "3",
		"bottom"  : "0"
    }).appendTo("#overlay");
}

function removeOverlay() {
    $("#overlay").remove();
}
//"background-color": "rgba(128,128,128,0.75)",
//
