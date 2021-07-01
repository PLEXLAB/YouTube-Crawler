chrome.browserAction.setBadgeText({text: ''});
// URL of the YoutTube Watch Histroy
const cURL = "https://www.youtube.com/feed/history";
chrome.windows.getCurrent(currWin => {
	// Sepecify the location of the new popup window
	let newTop = currWin.top ;
	let newLeft = currWin.left ;
	// Create a minimized window next to the Windows button in the task bar
	chrome.windows.create({
			type    : 'normal',	state	: 'normal'	,
			focused : true	,	top		: newTop	,
			left	: newLeft,	url		: cURL		
		}, function(currentWindow){
				currentWindowId = currentWindow.id;
				// Send the ID of the newly created window to the background script to be shared by other scripts injected in different pages
				chrome.runtime.sendMessage(currentWindowId);
			}
	);
});