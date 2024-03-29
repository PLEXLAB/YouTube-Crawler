/*
	This script uses other helper scripts that conttain different functions for different tasks
	displayOverlay function is located in overlayScript
	saveMetaData function is located in inject_videos_save
	getVideoTitles, getVideUrls, getDate, getVisibility, getVideoDescriptions, getNoViews and getNoComments 
	are located in inject_videos_extract scripts
*/
//=========================================================
chrome.runtime.sendMessage("deleteVtab");
var lastPageFlag 	= false	; // flag used to mark reaching the last page of videos list, will be used to start crawling analytics page
var conFormCheck	= true	;
var chID		 	= ""	;
var readyStateChkInterval 	= setInterval(chkDocReady	, config.getRandomTimeoutInterval());
try{
	displayOverlay("<h3 align='center'>Crawling: <u>Videos</u>, Videos-Analytics, Channel_Analytics, Advanced-Channel_Analytics</h3><h5 align='center'><br>Please DO NOT close this window<br>This window will be closed automatically once the crawling is finished.</h5>");
}
catch{}

if(typeof nextBtnChkClk == 'undefined'){
	var betaPageCformchk = setInterval(chkBetaCform  , config.getRandomTimeoutInterval());
	var nextBtnChkClk    = setInterval(chkClkNextBtn , config.getRandomTimeoutInterval());
}
//=========================================================
function chkDocReady(){
	if (document.readyState === "complete") {
		console.log("Page ready");
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
function chkClkNextBtn(){
	// Check the existance of "Next" button on videos page, and keep clicking it till crawling is done
	let nextBtn 		= "";
	let nextBtnStatus   = "";
	try
	{ 	
		nextBtn 		= document.querySelector("#navigate-after");
		nextBtnStatus = document.querySelector("#navigate-after").getAttribute("aria-disabled");
		
		console.log("0");
		if (nextBtnStatus != "true"){
			console.log("1");
			setTimeout(function(){
					saveMetaData (chID, getVideoTitles(), getVideUrls(), getDate(), getStatus(), getVisibility(), getMonStat(), getVideoDescriptions(), getNoViews(), getNoComments(), getOuterHtml_Vis(), getOuterHtml_Mon(), getOuterHtml_Rist());
					nextBtn.click();
			}, config.getRandomTimeoutInterval());
			lastPageFlag = true;
		}
		else{
			if (lastPageFlag === false){ 
				lastPageFlag = true;
			}
				if (lastPageFlag === true || nextBtnStatus === "false"){
					console.log("3");
					lastPageFlag = false;
					// Send message to background to inject the scripit that will crawl the analytics page
					setTimeout(function(){
						saveMetaData (chID, getVideoTitles(), getVideUrls(), getDate(), getStatus(), getVisibility(), getMonStat(), getVideoDescriptions(), getNoViews(), getNoComments(), getOuterHtml_Vis(), getOuterHtml_Mon(), getOuterHtml_Rist());
						chrome.runtime.sendMessage("get_Basic_video_Analytics_lifetime");
					}, config.getRandomTimeoutInterval());
					clearInterval(nextBtnChkClk);
				}
	}
	}// end of try
	catch
	{   
		chrome.runtime.sendMessage("get_Basic_video_Analytics_lifetime");
		console.log("next button is not available");
	}
}