/* 
	This function send a POST request to the db_portal server to save the crawled video's analytics.
	The server is located at NMSU.
*/
function saveVideoAnalytics(vID, overviewList, reachList, engList, audList){
	var VAhttpReq = new XMLHttpRequest();
	VAhttpReq.onreadystatechange = function() {
		if (typeof VAhttpReq !== 'undefined')
		{		
			console.log(VAhttpReq.responseText);
			if (VAhttpReq.readyState === XMLHttpRequest.DONE) {
				if (VAhttpReq.status == 201) {
					console.log('successful');
				} 
				else {
					console.log("ERROR: status " + VAhttpReq.status);
				}
			}
		}	
	}; 
	// Check if the server is not reachable
	VAhttpReq.onerror = function(){
		chrome.runtime.sendMessage("NetworkError");
	};
	VAhttpReq.timedout = 10000;
	VAhttpReq.ontimeout = function(e){
		console.log("XMLHttpRequest is timedout");
		chrome.runtime.sendMessage("NetworkError");
	};
	VAhttpReq.open('POST', 'https://plexweb.cs.nmsu.edu/saveVanalytics', true);
	VAhttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	VAhttpReq.send( 'vID='	        + encodeURIComponent(vID)		+
					'&overviewAna='	+ JSON.stringify(overviewList)	+
					'&reachAna='	+ JSON.stringify(reachList)		+
					'&engAna='		+ JSON.stringify(engList)		+
					'&audAna='		+ JSON.stringify(audList)		
	);	
}