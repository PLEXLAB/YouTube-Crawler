// Clear and show an overlay
removeOverlay();
chrome.runtime.sendMessage("deleteVtab");
try{
	displayOverlay("<h3 align='center'>Crawling: Videos, Videos-Analytics, Channel-Analytics, <u>Advanced-Channel-Analytics</u></h3><h5 align='center'><br>Please DO NOT close this window<br>This window will be closed automatically once the crawling is finished.</h5>");
}
catch{}

var table_list				= [];
var colsList				= [];
var updateColsList			= [];
var newTitles				= [];
var readyStateChkInterval 	= setInterval(chkDocReady	, Math.floor(Math.random() * 15000 + 5000));
var tableHeadersInt			= 0;
var	tableContentsInt		= 0;
var numberOfCols			= 0;
//=========================================================
function chkDocReady(){
	if (document.readyState === "complete") {
		clearInterval(readyStateChkInterval);
		tableHeadersInt	= setInterval(stopCrawling,	Math.floor(Math.random() * 15000 + 5000));
	}
}

//=========================================================
function stopCrawling(){
		setTimeout(function(){chrome.runtime.sendMessage("channelCrawled");}, Math.floor(Math.random() * 15000 + 5000));
}
