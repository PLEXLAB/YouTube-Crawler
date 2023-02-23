/* 
	This function send a POST request to the db_portal server to save the crawled video's basic analytics.
	The server is located at NMSU.
*/
function saveVideoAnalytics(vID, overviewList, reachList, engList, audList){
	var todayDate		= Date.now();
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
	VAhttpReq.open('POST', config.nodeURL+'/saveVanalytics', true);
	// VAhttpReq.open('POST', 'https://youtubeanalyticsserver.herokuapp.com/saveVanalytics', true);
	VAhttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	VAhttpReq.send( 'vID='	        + encodeURIComponent(vID)		+
					'&todayDate='   + encodeURIComponent(todayDate)  +
					'&overviewAna='	+ JSON.stringify(overviewList)	+
					'&reachAna='	+ JSON.stringify(reachList)		+
					'&engAna='		+ JSON.stringify(engList)		+
					'&audAna='		+ JSON.stringify(audList)		
	);	
}
// Save Advanced Analytics
function saveV_adv_trafficAnalytics(anaCategory, vID, trafficList){
	var todayDate		= Date.now();
	var VAdvhttpReq = new XMLHttpRequest();
	VAdvhttpReq.onreadystatechange = function() {
		if (typeof VAdvhttpReq !== 'undefined')
		{		
			console.log(VAdvhttpReq.responseText);
			if (VAdvhttpReq.readyState === XMLHttpRequest.DONE) {
				if (VAdvhttpReq.status == 201) {
					console.log('successful');
				}
				else {
					console.log("ERROR: status " + VAdvhttpReq.status);
				}
			}
		}
	};
	// Check if the server is not reachable
	VAdvhttpReq.onerror = function(){
		chrome.runtime.sendMessage("NetworkError");
	};
	VAdvhttpReq.timedout = 10000;
	VAdvhttpReq.ontimeout = function(e){
		console.log("XMLHttpRequest is timedout");
		chrome.runtime.sendMessage("NetworkError");
	};
	if(config.debug){console.log(trafficList);}
	VAdvhttpReq.open('POST', config.nodeURL+'/saveVadvAnalytics', true);
	// VAdvhttpReq.open('POST', 'https://youtubeanalyticsserver.herokuapp.com/saveVadvAnalytics', true);
	VAdvhttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	VAdvhttpReq.send( 'vID='	        + encodeURIComponent(vID)		   +
					  '&todayDate='     + encodeURIComponent(todayDate)    +
					  '&anaCategory='   + encodeURIComponent(anaCategory)  +
					  '&trafficList='	+ JSON.stringify(trafficList)		
	);
}