var notChangedStepsCount = 0;

$("<div id='overlay'><h1>Filtering...</h1></div>").css({
	"position": "fixed",
	"width": "100%",
	"height": "100%",
	"align": "center",
	"z-index": 10000,
	"vertical-align": "middle",
	"text-align": "left",
	"background-color": "rgba(128,128,128, 0.5)",
	"color": "#E8E8E8"
}).appendTo("#header-container")

var scrollInterval = setInterval(function () {

	var element = document.querySelector(".element-selector");
	if (element) {
		// element found
		clearInterval(scrollInterval);
		element.scrollIntoView();
	} else if ((document.documentElement.scrollTop + window.innerHeight) < document.documentElement.scrollHeight) {
		// no element -> scrolling
		notChangedStepsCount = 0;
		document.documentElement.scrollTop = document.documentElement.scrollHeight;
	} else if (notChangedStepsCount > 20) {
		// no more space to scroll
		chrome.runtime.sendMessage("autoScrollComplete");
		clearInterval(scrollInterval);
		console.log("done scrolling")
	} else {
		// waiting for possible extension (autoload) of the page
		notChangedStepsCount++;
	}
}, 100);



