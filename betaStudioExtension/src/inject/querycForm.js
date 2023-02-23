/*
	This function checks if the video creator has signed 
	the consent form before crawling his/her channel
*/
//==========================================================
function querycForms(chID) {
	console.log("==============>>>>> " + chID);
	conFhttpReq = new XMLHttpRequest();
	conFhttpReq.onreadystatechange = function() {
		if (typeof conFhttpReq !== 'undefined')
		{
			if (conFhttpReq.readyState === XMLHttpRequest.DONE) {
				if (conFhttpReq.status == 200) {
					// Consent form found, proceed to crawling the videos of the channel
					console.log("-----> In query consent form");
					console.log(conFhttpReq.responseText);
				} 
				else {
					console.log(conFhttpReq.responseText);
					chrome.runtime.sendMessage({chIDFoundStatus:conFhttpReq.responseText, chIDString: chID});
				}
			}
		}	
	};
	//conFhttpReq.onerror = function(){		chrome.runtime.sendMessage("NetworkError");	};
	conFhttpReq.open('GET', config.nodeURL+'/conFormMatch/'+chID, true);
	// conFhttpReq.open('GET', 'https://youtubeanalyticsserver.herokuapp.com/conFormMatch/'+chID, true);
	conFhttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	//conFhttpReq.send('chID='   + encodeURIComponent(chID));
	conFhttpReq.send();
}