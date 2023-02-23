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
var nextBtnChkClk			= setInterval(chkClkNextBtn , config.getRandomTimeoutInterval());

//=========================================================
function chkDocReady(){
	if (document.readyState === "complete") {
		console.log("Page ready");
		clearInterval(readyStateChkInterval);
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