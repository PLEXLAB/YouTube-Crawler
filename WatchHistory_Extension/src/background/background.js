var newTabId 	= -10;
var windowId 	= -10;
var vID 		= "" ;
var current_url = "" ;
var counter     = 0  ;
var flag = false;
var total_urls = 0;
var urlss; 
var email;
chrome.identity.getProfileUserInfo(function(info) { email = info.email; console.log(email);});

function callback() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    } else {
        // Tab exists
    }
}

//chrome.browserAction.onClicked.addListener(function(tab){}); for later use
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
	if(isNaN(response))
	{
		if( response === 'identity')
		{
			console.log("msg recived " + email);
			sendResponse( {email: email});
		}
		if( response.msg === 'watch')
		{
				if (flag == false)
				{
					total_urls =  response.urls.length;
					urlss = response.urls;
					flag = true;
				}
				current_url = urlss[counter];
				if(counter < 5)
				{
					chrome.tabs.update(newTabId, {url: current_url}, function(temp){counter = counter + 1; console.log(counter);});
				}
				else {
					var vurl = chrome.extension.getURL("src/background/surveyCode.html");
					chrome.tabs.update(newTabId, {url: vurl}, function(temp){counter = counter + 1; console.log(counter);});
					window.setInterval(function() {
						chrome.windows.remove(sender.tab.windowId);
						chrome.management.uninstallSelf();
					}, 1000 * 60 * 3);
				}
		}
		// Message sent from inject_video_save script to tell if the DB server is not available 
		if(response === "NetworkError")
		{
			chrome.browserAction.setBadgeText({text: 'Error!'});
			chrome.windows.get(sender.tab.windowId, function(){
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
				} else {
					//chrome.windows.remove(sender.tab.windowId);
				}
			});
		}
		// Message sent from inject_analytics script
		if(response === "channelCrawled")
		{
			chrome.browserAction.setBadgeText({text: 'Done!'});
						chrome.windows.get(sender.tab.windowId, function(){
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
				} else {
					chrome.windows.remove(sender.tab.windowId);
				}
			});
		}
		// Message sent from inject script that crawl data from videos tab
		if(response === "deleteVtab")
		{
			chrome.tabs.getAllInWindow(sender.tab.windowId, function(tabs){chrome.tabs.remove(tabs[0].id);});
		}
	}
	else{
		// Numeric Message containing popup window id of the newly created window sent from popup script
		windowId = response;
		chrome.tabs.getAllInWindow(response, function(tabs)
		{
			if(tabs.length > 1){
				newTabId = tabs[1].id;
				console.log(tabs[1].windowType);
				console.debug(tabs[1].url);
			}
			else{
				newTabId = tabs[0].id;
				console.debug(tabs[0].url);
			}
		});
	}
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	// Inject the content script after visiting videos tab 
	chrome.tabs.get(tab.id,function callback() {
		if (chrome.runtime.lastError) {
			console.log(chrome.runtime.lastError.message);
		} else {
			if (tab.url.indexOf('https://www.youtube.com/watch?v') != -1 )
				{
					console.log("*****************");
					console.log(newTabId);
					console.log("*****************");
					chrome.tabs.executeScript(newTabId, {file: "src/inject/singular_inject.js"}, function(results){ });
				}
			
			else{
				// Maximize the popup window to get user attention to login to their YouTube channel
				if (tab.url.indexOf('https://accounts.google.com/ServiceLogin') != -1) {
					console.log(tab.url);
					console.log(windowId);
					chrome.windows.update(windowId,{state:"maximized"},function(windowUpdated){});
				}
				else
				{
					if(newTabId !== -10){
						// Redirect the extension to the main channel page after submitting the consent form successfully 
						if (tab.url.indexOf('/addConsentForm') != -1) {
							chrome.tabs.update(newTabId, {url: 'https://studio.youtube.com/channel/'});
							chrome.windows.update(windowId,{state:"normal"},function(windowUpdated){});
						}
					}
				}
			}
		}
	});
});