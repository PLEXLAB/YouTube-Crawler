/* 
	This function send a POST request to the db_portal server to save the crawled channel's analytics.
	The server is located at NMSU.
*/
function saveChExpAnalytics(period, anaCategory, chID, tableList){
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
	chAhttpReq.open('POST', 'https://plexweb.cs.nmsu.edu/saveCHexpAnalytics', true);
	chAhttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	chAhttpReq.send('period='	    + encodeURIComponent(period)		+
					'&anaCategory='	+ encodeURIComponent(anaCategory)	+
					'&chID='	    + encodeURIComponent(chID)			+
					'&tableList='	+ JSON.stringify(tableList)	
	);
}