/*
	This script uses other helper scripts that conttain different functions for different tasks
	displayOverlay function is located in overlayScript
	saveMetaData function is located in inject_videos_save
	getVideoTitles, getVideUrls, getDate, getVisibility, getVideoDescriptions, getNoViews and getNoComments 
	are located in inject_videos_extract scripts
*/
//=========================================================
let lastPageFlag 	= false	; // flag used to mark reaching the last page of videos list, will be used to start crawling analytics page
let conFormCheck	= true	;
var chID		 	= ""	;
var readyStateChkInterval 	= setInterval(chkDocReady	, 3000);
var betaPageCformchk		= setInterval(chkBetaCform	, 3000);
var videoLinkChk 			= setInterval(chkVideoLink	, 3000);
var nextBtnChkClk			= setInterval(chkClkNextBtn , 3000);

//=========================================================
function chkDocReady(){
	if (document.readyState === "complete") {
		displayOverlay("<h2 align='center'>Crawling Your Channel</h2>");
		clearInterval(readyStateChkInterval);
	}
}
//=========================================================
function chkBetaCform(){
	console.log("chkBetaCform");
	// Check if the current page is beta studio page
	var urlOFpopup = window.location.pathname;
	var chIdx = urlOFpopup.indexOf('/channel/');
	if ( chIdx !== -1) {
		var match      	= urlOFpopup.match(/channel\//);
		var firstIndex 	= urlOFpopup.indexOf(match[0]);
		var lastIndex  	= urlOFpopup.lastIndexOf(match[match.length-1]);
		chID       		= urlOFpopup.substring(lastIndex + 8);
		// Check if the consent form has been sigend only when visisting YouTube channel main page
		// The check will not occur when the extension navigates to videos and analytics tabs
		if (chID.indexOf("/videos") === -1 && chID.indexOf("/analytics") === -1 && conFormCheck === true)
		{
			//console.log("chID:" + chID);
			console.log(querycForms(chID));
			conFormCheck = false;
			clearInterval(betaPageCformchk);
		}
	}
}
//=========================================================
function chkVideoLink(){
	// Check if Videos tab does exist, then click the videos tab to access videos list
	let videosBtn = document.querySelector("#menu-item-1 > paper-icon-item");
	let videosBtnCaption = document.querySelector("#menu-item-1 > paper-icon-item > div.nav-item-text.style-scope.ytcp-navigation-drawer");
	videosBtnCaption = videosBtnCaption.innerText;
	if (videosBtnCaption === "Videos")
	{
		setTimeout(function(){videosBtn.click();}, Math.floor(Math.random() * 2000));
		clearInterval(videoLinkChk);
	}
}
//=========================================================
function chkClkNextBtn(){
	// Check the existance of "Next" button on videos page, and keep clicking it till crawling is done
	removeOverlay();
	displayOverlay("<h2 align='center'>Crawling Your Channel</h2><h5 align='center'><br>Please DO NOT close this window<br>This window will be closed automatically once the crawling is finished<br>Number of crawled videos: " + totalNoVideos + "</h5>");
	let nextBtn 		= document.querySelector("#navigate-after");
	let nextBtnStatus 	= document.querySelector("#navigate-after").getAttribute("aria-disabled");
	console.log("0");
	if (nextBtnStatus !== "true"){
		console.log("1");
		setTimeout(function(){
				saveMetaData (chID, getVideoTitles(), getVideUrls(), getDate(), getVisibility(), getVideoDescriptions(), getNoViews(), getNoComments());
				nextBtn.click();
		}, Math.floor(Math.random() * 4000));
		lastPageFlag = true;
	}
	else{
		if (lastPageFlag === true || nextBtnStatus === "true"){
			console.log("2");
			saveMetaData (chID, getVideoTitles(), getVideUrls(), getDate(), getVisibility(), getVideoDescriptions(), getNoViews(), getNoComments());
			lastPageFlag = false;
			// Send message to background to inject the scripit that will crawl the analytics page
			removeOverlay();
			displayOverlay("<h2 align='center'>Crawling Your Channel</h2><h5 align='center'><br>Please DO NOT close this window<br>This window will be closed automatically once the crawling is finished<br>Number of crawled videos: " + totalNoVideos + "</h5>");
			setTimeout(function(){chrome.runtime.sendMessage("get_single_video_Analytics_lifetime");}, 3000);
			clearInterval(nextBtnChkClk);
		}
	}
}