/*
	This script uses other helper scripts that conttain different functions for different tasks
	displayOverlay function is located in overlayScript
	saveMetaData function is located in inject_videos_save
	getVideoTitles, getVideUrls, getDate, getVisibility, getVideoDescriptions, getNoViews and getNoComments 
	are located in inject_videos_extract scripts
*/
//=========================================================
var rec_list_chk        = setInterval(rec_list_chkReady, 3000);
var videoRecLinksChkInterval 	= setInterval(videoRecLinksChk	, 3000);
//var getNextVChkInterval = setInterval(getNextVChk	, 3000);
//=========================================================
function rec_list_chkReady(){
	if (document.readyState === "complete") {
		//displayOverlay("<h2 align='center'>Crawling Your Video</h2>");
		clearInterval(rec_list_chk);
	}
}
//=========================================================
function getNextVChk(){
	chrome.runtime.sendMessage('watch');
	clearInterval(getNextVChkInterval);
}
//=========================================================
function videoRecLinksChk(){
	
	try{
		var rec_urls    = document.querySelectorAll("#dismissible > div > div.metadata.style-scope.ytd-compact-video-renderer > a");
	}
	catch{
		var rec_urls    = document.querySelectorAll("#dismissible > div > div.metadata.style-scope.ytd-compact-video-renderer > a");
	}
	
	video_url 		= window.location.href;
	//Recommended videos

	rec_url_1  	= rec_urls[0].getAttribute("href");
	console.log(rec_url_1);		
	rec_url_2  	= rec_urls[1].getAttribute("href");
	
	rec_url_3  	= rec_urls[2].getAttribute("href");
	
	rec_url_4  	= rec_urls[3].getAttribute("href");

	rec_url_5  	= rec_urls[4].getAttribute("href");

	//saveUrlData(window.location.href, video_title, video_views, time[0].innerText, rec_url_1, rec_url_2, rec_url_3, rec_url_4, rec_url_5)
	saveUrlData(video_url, rec_url_1, rec_url_2, rec_url_3, rec_url_4, rec_url_5)
	setTimeout(function(){ chrome.runtime.sendMessage({msg:'watch'}); }, 15000);
	// we need to save the seed time, url, viws, and rec urls. later we get transcript and other components for the rec.
	clearInterval(rec_list_chk);
	
	// then save
}
