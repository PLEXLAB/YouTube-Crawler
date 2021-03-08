chrome.browserAction.setBadgeText({text: ''});
var port = chrome.extension.connect({
      name: "Sample Communication"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
	console.log("message recieved" + msg);
	var d = new Date(msg);
	var dT= d.toLocaleString();
	document.getElementById('AlarmRuntime').innerHTML = 'Last Scan: ' + dT;
});

/*
chrome.storage.local.get(['Runtime'], function(result) {
  console.log('Value currently is ' + result.key);
  document.getElementById('lastrun').innerHTML = "Extension last runtime: "+ result.key;
});
*/
//document.getElementById('lastrun').innerHTML = "Extension last runtime: "+ todayDate;
// URL of the YoutTube beta studio to be first visited in the new popup window
/* const cURL = "https://studio.youtube.com/channel/";
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
				console.log(currentWindowId);
				// Send the ID of the newly created window to the background script to be shared by other scripts injected in different pages
				chrome.runtime.sendMessage(currentWindowId);
			}
	);
});  */

