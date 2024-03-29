// Clear and show an overlay
removeOverlay();
chrome.runtime.sendMessage("deleteVtab");
try{
	displayOverlay("<h3 align='center'>Crawling: Videos, <u>Videos-Analytics</u>, Channel-Analytics, Advanced-Channel-Analytics, Advanced-Video-Analytics</h3><h5 align='center'><br>Please DO NOT close this window<br>This window will be closed automatically once the crawling is finished.</h5>");
}
catch{}

var overview_vAnalytics	= {};
var reach_vAnalytics	= {};
var eng_vAnalytics		= {};
var audit_vAnalytics	= {};

var overviewDurationInt	= setInterval(getDuration	, 10);
var overviewMetricsInt	= 0;

var reachVistTabInt		= 0;
var reachMetricsInt		= 0;

var engVistTabInt		= 0;
var engMetricsInt		= 0;

var audienceInt			= 0;
var audienceMetricsInt	= 0;

//Overview Tab ==============================================================
function getDuration(){
	var duration = document.querySelector("#trigger > ytcp-dropdown-trigger > div > div.left-container.style-scope.ytcp-dropdown-trigger > div > div");
	if (duration !== null)
	{
		console.log(duration.textContent);
		clearInterval(overviewDurationInt);
		overview_vAnalytics["duration"] =  duration.textContent;
		overviewMetricsInt	= setInterval(getOverview	, 10);
	}
}
//Overview Tab ==============================================================
function getOverview(){
	var overviewMetrics	= document.querySelectorAll("#metric-total");
	if(overviewMetrics.length > 0){
		let overviewViews		= overviewMetrics[0].textContent.trim();
		let overviewWatchTime	= null;
		let overviewSubscribers	= null;
		if(overviewMetrics.legnth > 2){
			overviewWatchTime	= overviewMetrics[1].textContent.trim();
			overviewSubscribers	= overviewMetrics[2].textContent.trim();
		}
		else {
			overviewSubscribers	= overviewMetrics[1].textContent.trim();
		}
		
		//let overviewRevenue		= overviewMetrics[3].textContent.trim();
		console.log(overviewViews);
		console.log(overviewWatchTime);
		console.log(overviewSubscribers);
		//console.log(overviewRevenue);
		overview_vAnalytics["views"] 		=  overviewViews;
		overview_vAnalytics["watchTime"] 	=  overviewWatchTime;
		overview_vAnalytics["subscribers"] 	=  overviewSubscribers;
		clearInterval(overviewMetricsInt);
		reachVistTabInt		= setInterval(reachVisit	, 1000);
	}
}
//Reach Tab ==============================================================
function reachVisit(){
	var reachTab = document.querySelector("#reach_viewers");
	if (reachTab !== null){
		reachTab.click();
		clearInterval(reachVistTabInt);
		reachMetricsInt		= setInterval(getReach		, 1000);
	}
}
//Reach Tab ==============================================================
function getReach(){
	var reachLabels		=	document.querySelectorAll("#metric-label");
	var reachMetrics 	= 	document.querySelectorAll("#metric-total");
	var reachMetricsPerc=	document.querySelectorAll("#comparison > span.only-visible-for-accessibility.style-scope.ytcp-trend-label");
	var viewsFromImp	= 	document.querySelector("#views-value");
	var avgViewDuration	=	document.querySelector("#average-watch-time > div");
	var watchTimeFromImp=	document.querySelector("#wt-value");
	
	var reachImp		= "";
	var reachImpPrsnt	= "";
	var reachImpClk		= "";
	var reachImpClkPrsnt= "";
	var reachViews		= "";
	var reachViewsPrsnt = "";
	var reachUviews		= "";
	
	if(reachMetrics.length > 0)
	{
		reachImp	= 	(reachMetrics[0].textContent).trim();
		if(reachMetrics.length > 3)
		{
			reachImpClk	=	(reachMetrics[1].textContent).trim();
			reachViews	= 	(reachMetrics[2].textContent).trim();
			reachUviews	= 	(reachMetrics[3].textContent).trim();
		}
		else 
		{
			reachViews	= 	(reachMetrics[1].textContent).trim();
			reachUviews	= 	(reachMetrics[2].textContent).trim();
		}
		
		console.log(reachImp 	);
		console.log(reachImpClk );
		console.log(reachViews 	);
		console.log(reachUviews );
		
		reach_vAnalytics["reachImpressions"]= reachImp;
		reach_vAnalytics["reachImpClk"]		= reachImpClk;
		reach_vAnalytics["reachViews"]		= reachViews;
		reach_vAnalytics["reachUviews"]		= reachUviews;	
		if(reachMetricsPerc.length > 0)
		{
			if(reachMetricsPerc[0] !== undefined)
			{	reachImpPrsnt	= 	(reachMetricsPerc[0].textContent).trim();	console.log(reachImpPrsnt);		}
			if(reachMetricsPerc[1] !== undefined)
			{	reachImpClkPrsnt=	(reachMetricsPerc[1].textContent).trim();	console.log(reachImpClkPrsnt);	}	
			if(reachMetricsPerc[2] !== undefined)
			{	reachViewsPrsnt	=	(reachMetricsPerc[2].textContent).trim();	console.log(reachViewsPrsnt);	}
		
			if(viewsFromImp !== undefined)
				{	viewsFromImp	= 	(viewsFromImp.textContent).trim();			reach_vAnalytics["viewsFromImp"]	= viewsFromImp; 	console.log(viewsFromImp);	}
			if(avgViewDuration !== undefined)
				{	avgViewDuration	= 	(avgViewDuration.textContent).trim();		reach_vAnalytics["avgViewDuration"]	= avgViewDuration; 	console.log(avgViewDuration);	}
			if(watchTimeFromImp !== undefined)	
				{	watchTimeFromImp	= 	(watchTimeFromImp.textContent).trim();	reach_vAnalytics["watchTimeFromImp"]= watchTimeFromImp;	console.log(watchTimeFromImp);	}
		}
		clearInterval(reachMetricsInt);
		engVistTabInt		= setInterval(engVisit		, config.getRandomTimeoutInterval());
	}
}
//Engagement Tab ==============================================================
function engVisit(){
	var engTab = document.querySelector("#interest_viewers");
	if (engTab !== null){
		engTab.click();
		clearInterval(engVistTabInt);
		engMetricsInt		= setInterval(getEng		, config.getRandomTimeoutInterval());
	}
}
//Engagement Tab ==============================================================
function getEng(){
	var engLabels			=	document.querySelectorAll("#metric-label");
	var engMetrics			= 	document.querySelectorAll("#metric-total");
	var reachMetricsPerc	=	document.querySelectorAll("#comparison > span.only-visible-for-accessibility.style-scope.ytcp-trend-label");
	var watchTime			= 	"";
	var watchTimePrsnt		=	"";
	var avgViewDur			= 	"";
	var avgViewDurPrsnt		=	"";
	if(engMetrics.length > 0)
	{
		if(engMetrics[0] !== undefined)
			{	watchTime		=	(engMetrics[0].textContent).trim();	eng_vAnalytics["watchTime"] = watchTime;	console.log(watchTime);		}
		if(engMetrics[1] !== undefined)
			{	avgViewDur		=	(engMetrics[1].textContent).trim();	eng_vAnalytics["avgViewDur"] = watchTime;	console.log(avgViewDur);}
		
		if(reachMetricsPerc.length > 0){
			if(reachMetricsPerc[0] !== undefined)
				{	watchTimePrsnt	=	(reachMetricsPerc[0].textContent).trim();	console.log(watchTimePrsnt);	}
			if(reachMetricsPerc[1] !== undefined)
				{	avgViewDurPrsnt	=	(reachMetricsPerc[1].textContent).trim();	console.log(avgViewDurPrsnt);	}
		}
		clearInterval(engMetricsInt);
		audienceInt			= setInterval(audVisit		, config.getRandomTimeoutInterval());
	}
}
//Audeince Tab ==============================================================
function audVisit(){
	var audTab = document.querySelector('#build_audience');
	if(audTab !== null)
	{
		audTab.click();
		clearInterval(audienceInt);
		audienceMetricsInt	= setInterval(getAud		, config.getRandomTimeoutInterval());
	}
}
//Audeince Tab ==============================================================
function getAud(){
	var audLabels		=	document.querySelectorAll("#metric-label");
	var audMetrics		= 	document.querySelectorAll("#metric-total");
	var audMetricsPerc	=	document.querySelectorAll("#comparison > span.only-visible-for-accessibility.style-scope.ytcp-trend-label");
	var uViewers 		= 	"";
	var avgViewPerViewer= 	"";
	var subscribers		= 	"";
	
	if(audMetrics.length > 0)
	{
		if(audMetrics[0] !== undefined)
			{	uViewers		=	(audMetrics[0].textContent).trim(); audit_vAnalytics["uViewers"] 			= uViewers;			console.log(uViewers);			}
		if(audMetrics[1] !== undefined)
			{	avgViewPerViewer=	(audMetrics[1].textContent).trim(); audit_vAnalytics["avgViewPerViewer"] 	= avgViewPerViewer;	console.log(avgViewPerViewer);	}
		if(audMetrics[2] !== undefined)
			{	subscribers		=	(audMetrics[2].textContent).trim(); audit_vAnalytics["subscribers"] 		= subscribers;		console.log(subscribers);		}
		clearInterval(audienceMetricsInt);
		// Update video records we need to send videoID and maybe channel ID
		// Extract Channel ID then paass it to inject_analytics_explore
		var urlOFvideoA	= window.location.pathname;
		var vIdx 		= urlOFvideoA.indexOf('/video/');
		var match      	= urlOFvideoA.match(/video\//);
		var lastIndex  	= urlOFvideoA.lastIndexOf(match[match.length-1]);
		var vID   		= urlOFvideoA.substring(lastIndex + 6);
		vID				= vID.substring(0, vID.indexOf('/'));
		console.log("-------------------------");
		console.log(overview_vAnalytics);
		saveVideoAnalytics(vID, overview_vAnalytics, reach_vAnalytics, eng_vAnalytics, audit_vAnalytics);
		// msg to reinject the code other videos analytics using videosID
		// setTimeout(function(){chrome.runtime.sendMessage("get_advanced_video_Analytics_lifetime");}, config.getRandomTimeoutInterval());
		setTimeout(function(){chrome.runtime.sendMessage("get_Basic_video_Analytics_lifetime");}, config.getRandomTimeoutInterval());
	}
}