/* 
	This function send differnt POST requests the db_portal server to save the crawled videos.
	The server is located at NMSU.
*/
//========================================================================
let totalNoVideos = 0;
var vList         = [];
function saveMetaData(chID, vTitles, vURLS, vDates, vViss, vDescs, vViews, vNoComms, visOuterH, monOuterH, ristOuterH) {
	console.log("Video save started");
	var vCount = vTitles.length;
	var httpReq = new Array(vCount);
	for(var i = 0; i < vCount; ++i)
	{		
		var vVis		    = vViss[i];
		if(vVis == null) continue;	
		if (!(vVis.indexOf('Public') > -1))	continue;
		totalNoVideos += 1;
		var vTitle 		    = vTitles[i];
		var vURL   		    = vURLS[i];
		var vID				= vURL.substring(vURL.indexOf("=") + 1);
		console.log("*******************************");
		console.log(vID);
		console.log("*******************************");
		if(!vList.includes(vID))
		{
			vList.push(vID);
			chrome.storage.sync.set(
				{'list' : vList}, 
				function(){console.log("Video ID is added....");});
		}
		var vDateStatus     = vDates[i].split("\n");
		var vDate           = vDateStatus[0];
		var vStatus         = vDateStatus[1];
		var vDesc           = vDescs[i];
		var vView           = vViews[i];
		var vNoComm         = vNoComms[i];
		var todayDate		= Date.now();
		var vvisOuterH      = visOuterH[i];
		var vmonOuterH      = monOuterH[i];
		var vristOuterH     = ristOuterH[i];
		//var vvisOuterH      = "";
		//var vmonOuterH      = "";
		//var vristOuterH     = "";
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
		/* Check if the server is not reachable
		httpReq[i].onerror = function(){
			chrome.runtime.sendMessage("NetworkError");
		};
		httpReq[i].timedout = 3000;
		httpReq[i].ontimeout = function(e){
			console.log("XMLHttpRequest is timedout");
			chrome.runtime.sendMessage("NetworkError");
		};*/
		httpReq[i].open('POST', 'https://plexweb.cs.nmsu.edu/VideosSaveRoute', true);
		httpReq[i].setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		httpReq[i].send('chID='     + encodeURIComponent(chID.replace('/videos/upload',''))    +
						'&todayDate='  + encodeURIComponent(todayDate)  +
						'&vTitle='  + encodeURIComponent(vTitle)  +
						'&vURL='    + encodeURIComponent(vURL)    +
						'&vID='     + encodeURIComponent(vID)     +
						'&vDate='   + encodeURIComponent(vDate)   +
						'&vStatus=' + encodeURIComponent(vStatus) +
						'&vVis='    + encodeURIComponent(vVis)    +
						'&vDesc='   + encodeURIComponent(vDesc)   +
						'&vView='   + encodeURIComponent(vView)   +
						'&vNoComm=' + encodeURIComponent(vNoComm) +
						'&vvisOuterH='   + encodeURIComponent(vvisOuterH)   +
						'&vmonOuterH='   + encodeURIComponent(vmonOuterH)   +
						'&vristOuterH=' + encodeURIComponent(vristOuterH));	
	}
}