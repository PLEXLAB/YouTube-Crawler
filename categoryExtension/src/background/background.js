chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    if(response === "Start") {
        chrome.tabs.executeScript({file: "src/content_scripts/autoscroll.js"});
    }
	if(response === "autoScrollComplete")
	{
		chrome.tabs.executeScript({file: "src/content_scripts/inject_search_results.js"});
	}
})