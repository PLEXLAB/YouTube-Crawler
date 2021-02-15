chrome.browserAction.setBadgeText({text: ''});
// URL of the YoutTube beta studio to be first visited in the new popup window
const cURL = "https://studio.youtube.com/channel/*/videos/";
chrome.windows.getCurrent(currWin => {
	// Sepecify the location of the new popup window
	let newTop = currWin.top + currWin.height + 10000;
	let newLeft = currWin.left + currWin.width - 10000;
	// Create a minimized window next to the Windows button in the task bar
	chrome.windows.create({
			type    : 'normal',	state	: 'normal'	,
			focused : false	,	width	: 5			,
			height	: 10	,	top		: newTop	,
			left	: newLeft,	url		: cURL		
		}, function(currentWindow){
				currentWindowId = currentWindow.id;
				// Send the ID of the newly created window to the background script to be shared by other scripts injected in different pages
				chrome.runtime.sendMessage(currentWindowId);
			}
	);
});