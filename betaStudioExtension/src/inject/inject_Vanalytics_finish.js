// Clear and show an overlay
removeOverlay();
chrome.runtime.sendMessage("deleteVtab");
try{
	displayOverlay("<h3 align='center'>Crawling: Videos, Videos-Analytics, Channel-Analytics, Advanced-Channel-Analytics, <u>Advanced-Video-Analytics</u></h3><h5 align='center'><br>Please DO NOT close this window<br>This window will be closed automatically once the crawling is finished.</h5>");
}
catch{}

var table_list				= [];
var colsList				= [];
var updateColsList			= [];
var newTitles				= [];
var readyStateChkInterval 	= setInterval(chkDocReady	, config.getRandomTimeoutInterval());
var tableHeadersInt			= 0;
var	tableContentsInt		= 0;
var numberOfCols			= 0;
//=========================================================
function chkDocReady(){
	if (document.readyState === "complete") {
		clearInterval(readyStateChkInterval);
		tableHeadersInt	= setInterval(stopCrawling,	config.getRandomTimeoutInterval());
	}
}

//=========================================================
function stopCrawling(){
		setTimeout(function(){chrome.runtime.sendMessage("channelCrawled");}, config.getRandomTimeoutInterval());
}
