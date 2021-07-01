/*
	This script uses other helper scripts that conttain different functions for different tasks
	displayOverlay function is located in overlayScript
	saveMetaData function is located in inject_videos_save
	getVideoTitles, getVideUrls, getDate, getVisibility, getVideoDescriptions, getNoViews and getNoComments 
	are located in inject_videos_extract scripts
	https://pypi.org/project/youtube-search-python/
*/
//=========================================================
var urls = new Array();
var logged_in_user;
chrome.runtime.sendMessage('identity', function(response) {
		logged_in_user = response.email;
		console.log("Got user:", logged_in_user);
		});
var readyStateScrollDown 	= setInterval(chkScrollReady, 15000);
var readyStateChkInterval 	= setInterval(chkDocReady	, 3000);
var videoLinkChk 			= setInterval(chkVideoLink	, 3000);
//=========================================================
function chkScrollReady(){
	if (document.readyState === "complete") {
		$(document).ready(function() { 
            $(document).scrollTop($(document).height()); 
        }); 
		clearInterval(readyStateScrollDown);
	}
}
//=========================================================
function chkDocReady(){
	if (document.readyState === "complete") {
		
		

		//displayOverlay("<h2 align='center'>Crawling Your Watch History</h2>");
		clearInterval(readyStateChkInterval);
	}
}
//=========================================================
function chkVideoLink(){
	// Check if Videos tab does exist, then click the videos tab to access videos list
	let videosURLS = document.querySelectorAll("#video-title");
	let i =  0;
	[].forEach.call(videosURLS, function(videoURL) {
		urls[i++] = videoURL.href;
	});
	
	
	console.log("Got user:", logged_in_user);
	//var email;
	//chrome.identity.getProfileUserInfo(function(info) { email = info.email; console.log(email);});
	//console.log("Got user:", email);
	saveWatchHistData(urls);
	console.log(urls) 
	chrome.runtime.sendMessage({msg:'watch', urls: urls});
	clearInterval(videoLinkChk);
}

//Notes
/* Create another script to inject in any new window

*/
