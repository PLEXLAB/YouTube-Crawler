/* 
	This function send differnt POST requests the db_portal server to save the crawled videos.
	The server is located at NMSU.
*/
//========================================================================
let totalNoVideos = 0;
function saveMetaData(chID, vTitles, vURLS, vDates, vStatuss, vViss, vMons, vDescs, vViews, vNoComms, visOuterH, monOuterH, ristOuterH) {
	//console.log("Video save started");
	var vCount = vTitles.length;
	var httpReq = new Array(vCount);
	for(var i = 0; i < vCount; ++i)
	{		
		var vVis		    = vViss[i];
		if(vVis == null) continue;	
		if (vVis.indexOf('Private') > -1){continue;}
		if (vVis.indexOf('Unlisted') > -1){continue;} 
		if (vVis.indexOf('Removed') > -1){continue;}
		
		totalNoVideos += 1;
		var vTitle 		    = vTitles[i];
		var vURL   		    = vURLS[i];
		var vMon            = vMons[i];
		if (vMon !== undefined) vMon = vMon.trim();
		var vID				= vURL.substring(vURL.indexOf("=") + 1);
		console.log("In video Save");
		chrome.runtime.sendMessage({vIDSave:vID});
		var vDate           = vDates[i]
		var vStatus         = vStatuss[i];
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
		//Check if the server is not reachable
		httpReq[i].onerror = function(){
			chrome.runtime.sendMessage("NetworkError");
		};
		httpReq[i].timedout = 10000;
		httpReq[i].ontimeout = function(e){
			console.log("XMLHttpRequest is timedout");
			chrome.runtime.sendMessage("NetworkError");
		};
		httpReq[i].open('POST', 'https://youtubeanalyticsserver.herokuapp.com/VideosSaveRoute', true);
		httpReq[i].setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		httpReq[i].send('chID='     + encodeURIComponent(chID.replace('/videos/upload',''))    +
						'&todayDate='  + encodeURIComponent(todayDate)  +
						'&vTitle='  + encodeURIComponent(vTitle.trim())  +
						'&vURL='    + encodeURIComponent(vURL)    +
						'&vID='     + encodeURIComponent(vID)     +
						'&vDate='   + encodeURIComponent(vDate)   +
						'&vStatus=' + encodeURIComponent(vStatus) +
						'&vVis='    + encodeURIComponent(vVis.trim())    +
						'&vMon='    + encodeURIComponent(vMon)    +
						'&vDesc='   + encodeURIComponent(vDesc)   +
						'&vView='   + encodeURIComponent(vView.trim())   +
						'&vNoComm=' + encodeURIComponent(vNoComm.trim()) +
						'&vvisOuterH='   + encodeURIComponent(vvisOuterH)   +
						'&vmonOuterH='   + encodeURIComponent(vmonOuterH)   +
						'&vristOuterH=' + encodeURIComponent(vristOuterH));	
	}
}