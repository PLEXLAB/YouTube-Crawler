/* 
	This function send a POST request to the db_portal server to save the crawled channel's analytics.
	The server is located at NMSU.
*/
function saveChAnalytics(period, chID, overviewList, reachList, engList, audList){
	var chAhttpReq = new XMLHttpRequest();
	chAhttpReq.onreadystatechange = function() {
		if (typeof chAhttpReq !== 'undefined')
		{		
			console.log(chAhttpReq.responseText);
			if (chAhttpReq.readyState === XMLHttpRequest.DONE) {
				if (chAhttpReq.status == 201) {
					console.log('successful');
				} 
				else {
					console.log("ERROR: status " + chAhttpReq.status);
				}
			}
		}	
	}; 
	// Check if the server is not reachable
	chAhttpReq.onerror = function(){
		chrome.runtime.sendMessage("NetworkError");
	};
	chAhttpReq.timedout = 10000;
	chAhttpReq.ontimeout = function(e){
		console.log("XMLHttpRequest is timedout");
		chrome.runtime.sendMessage("NetworkError");
	};
	chAhttpReq.open('POST', 'http://localhost:3000/saveCHanalytics', true);
	chAhttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	chAhttpReq.send('period='	    + encodeURIComponent(period)	+
					'&chID='	    + encodeURIComponent(chID)		+
					'&overviewAna='	+ JSON.stringify(overviewList)	+
					'&reachAna='	+ JSON.stringify(reachList)		+
					'&engAna='		+ JSON.stringify(engList)		+
					'&audAna='		+ JSON.stringify(audList)		
	);	
}