chrome.storage.local.set({video1: ""}, function() {
  console.log('Value is set to ' + "");
});
chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
	if (response === "Start") {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			var tabURL = tabs[0].id;
			console.log(tabURL);
			chrome.tabs.executeScript(tabURL, { file: "src/content_scripts/inject_search_results.js" });
		});
		console.log('msg ' + response);
		
	}
	if (response === "second") {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			var tabURL = tabs[0].id;
			console.log(tabURL);
			chrome.tabs.executeScript(tabURL, { file: "src/content_scripts/inject_search_results2.js" });
		});
		console.log('msg ' + response);
		
	}
	if (response === "third") {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			var tabURL = tabs[0].id;
			console.log(tabURL);
			chrome.tabs.executeScript(tabURL, { file: "src/content_scripts/inject_search_results3.js" });
		});
		console.log('msg ' + response);
		
	}
	if (response === "forth") {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			var tabURL = tabs[0].id;
			console.log(tabURL);
			chrome.tabs.executeScript(tabURL, { file: "src/content_scripts/inject_search_results4.js" });
		});
		console.log('msg ' + response);
		
	}
});
