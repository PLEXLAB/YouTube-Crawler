/* 
	This function send differnt POST requests the db_portal server to save the crawled videos.
	The server is located at NMSU.
*/
//========================================================================
function saveWatchHistData(vURLS){
	var uCount = vURLS.length;
	var httpReq = new Array(uCount);
	var random  = Math.round(Date.now() + Math.random()*5000);
	for(var i = 0; i < 50; ++i)
	{		
		var vURL   		    = vURLS[i];
		var todayDate		= Date.now();
		httpReq[i] = new XMLHttpRequest();
		httpReq[i].onreadystatechange = function() {
			if (typeof httpReq[i] !== 'undefined')
			{		
				console.log(httpReq[i].responseText);
				if (httpReq[i].readyState === XMLHttpRequest.DONE) {
					if (httpReq[i].status == 201) {
						console.log('successful');
					} 
					else {
						console.log("ERROR: status " + httpReq[i].status);
					}
				}
			}	
		}; 
		// Check if the server is not reachable
		httpReq[i].onerror = function(){
			chrome.runtime.sendMessage("NetworkError");
		};
		httpReq[i].timedout = 30000;
		httpReq[i].ontimeout = function(e){
			console.log("XMLHttpRequest is timedout");
			chrome.runtime.sendMessage("NetworkError");
		};
		httpReq[i].open('POST', 'https://plexweb.cs.nmsu.edu/SaveWatchHistory', true);
		httpReq[i].setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		httpReq[i].send('todayDate='  + encodeURIComponent(todayDate)+ '&vURL='    + encodeURIComponent(vURL) + '&vrandom='    + encodeURIComponent(random));
	}
}
//==============================================================================================================
function saveUrlData(url, rec_url_1, rec_url_2, rec_url_3, rec_url_4, rec_url_5) {
	var uCount = 1;
	var httpReq = new Array(1);
	var vTitle = "";
	var vViews = "";
	var vDuration = "";
	for(var i = Math.round(Date.now() + Math.random()*5000); i < uCount+Math.round(Date.now() + Math.random()*5000); ++i)
	{		
		var todayDate	= Date.now();
		httpReq[i]      = new XMLHttpRequest();
		httpReq[i].onreadystatechange = function() {
			if (typeof httpReq[i] !== 'undefined')
			{		
				console.log(httpReq[i].responseText);
				if (httpReq[i].readyState === XMLHttpRequest.DONE) {
					if (httpReq[i].status == 201) {
						console.log('successful');
					} 
					else {
						console.log("ERROR: status " + httpReq[i].status);
					}
				}
			}	
		}; 
		// Check if the server is not reachable
		//httpReq[i].onerror = function(){
		//	chrome.runtime.sendMessage("NetworkError");
		//};
		//httpReq[i].timedout = 30000;
		//httpReq[i].ontimeout = function(e){
		//	console.log("XMLHttpRequest is timedout");
		//	chrome.runtime.sendMessage("NetworkError");
		//};
		httpReq[i].open('POST', 'https://plexweb.cs.nmsu.edu/SaveRecVideos', true);
		httpReq[i].setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		httpReq[i].send('url='        + encodeURIComponent(url)       +
						'&todayDate=' + encodeURIComponent(todayDate) +
						'&vTitle='    + encodeURIComponent(vTitle)    +
						'&vViews='    + encodeURIComponent(vViews)    +
						'&vDuration=' + encodeURIComponent(vDuration) +
						'&rec_url_1=' + encodeURIComponent(rec_url_1) + 
						'&rec_url_2=' + encodeURIComponent(rec_url_2) +
						'&rec_url_3=' + encodeURIComponent(rec_url_3) + 
						'&rec_url_4=' + encodeURIComponent(rec_url_4) + 
						'&rec_url_5=' + encodeURIComponent(rec_url_5));	
	}
}