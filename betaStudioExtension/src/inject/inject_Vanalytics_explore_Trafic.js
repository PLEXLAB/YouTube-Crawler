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
		tableHeadersInt	= setInterval(getVideoTabHeaders,	Math.floor(Math.random() * 15000 + 5000));
	}
}

//=========================================================
function getVideoTabHeaders(){
	var mainColTitle		=	document.querySelector("#table-header-text");
	var	otherColTitles		= 	document.querySelectorAll("#header-title");
	var mainColTitleFlag	=	false;
	var otherColTilesFlag 	= 	false;
	colsList				=	[];
	if(mainColTitle	!== undefined && mainColTitle !== null)
	{
		mainColTitle 		= (mainColTitle.textContent).trim();
		colsList.push(mainColTitle);
		mainColTitleFlag	= 	true;
		console.log(mainColTitle);
	}
	if(otherColTitles !== undefined)
	{
		numberOfCols = otherColTitles.length + 1;
		otherColTitles.forEach(function(item){
			colsList.push((item.textContent).trim());
			console.log((item.textContent).trim());
		});
		otherColTilesFlag	=	true;
	}
	if(mainColTitleFlag === true && otherColTilesFlag === true)
	{
		clearInterval(tableHeadersInt);
		tableContentsInt	=	setInterval(getVideTabBody,	Math.floor(Math.random() * 15000 + 5000));
	}
}
//=========================================================
function getVideTabBody(){
	var firstCol		=	document.querySelectorAll("#entity-title-value");
	var firstColFlag	=	false;
	var otherColsFlag	=	false;
	var firstColVals	=	[];
	var otherColVals	=	[];
	var otherColsVals	=	[];
	
	if(firstCol !== undefined)
	{
		firstCol.forEach(function(item){
			firstColVals.push((item.textContent).trim());
			console.log((item.textContent).trim());
		});
		firstColFlag	=	true;
		otherColsVals.push(firstColVals);
		console.log(firstColVals);
	}
	updateColsList.push(colsList[0]);
	for(var i = 0; i < numberOfCols - 1; i++){
		var colIndex	=	3 + i;
		var otherCol_v1	=	document.querySelectorAll("#row-container > div:nth-child(" + colIndex + ") > div.layout.horizontal.end-justified.style-scope.yta-explore-table-row > div");
		var otherCol_v2	=	document.querySelectorAll("#row-container > div:nth-child(" + colIndex + ") > div.layout.horizontal.end-justified.style-scope.yta-explore-table-row > div.value.debug-metric-value.style-scope.yta-explore-table-row");
		var otherColPerc= 	document.querySelectorAll("#row-container > div:nth-child(" + colIndex + ") > div.layout.horizontal.end-justified.style-scope.yta-explore-table-row > div.formatted-percentage.style-scope.yta-explore-table-row");
		console.log(otherCol_v2.length + "----------------->");
		if(otherCol_v2 !== undefined && otherCol_v2 !== null && otherCol_v2.length > 0 && otherColPerc !== undefined && otherColPerc !== null && otherColPerc.length > 0)
		{
			otherCol_v2.forEach(function(item){
				otherColVals.push((item.textContent).trim());
				console.log((item.textContent).trim());
			});
			otherColsVals.push(otherColVals);
			
			otherColVals 	= 	[];
			updateColsList.push(colsList[i+1]);
			updateColsList.push(colsList[i+1]+'_Percent');
			otherColPerc.forEach(function(item){
				otherColVals.push((item.textContent).trim());
				console.log((item.textContent).trim());
			});
			otherColsVals.push(otherColVals);
			otherColVals 	= 	[];
			otherColsFlag	=	true;
		}
		else{
			if(otherCol_v1 !== null && otherCol_v1 !== undefined)
			{
				updateColsList.push(colsList[i+1]);
				otherCol_v1.forEach(function(item){
				otherColVals.push((item.textContent).trim());
				console.log((item.textContent).trim());
				});
				otherColsVals.push(otherColVals);
				otherColVals 	= 	[];
			}
			otherColsFlag	=	true;
		}
		otherCol_v1 = [];otherCol_v2 = [];otherColPerc = [];
	}
	if(firstColFlag === true && otherColsFlag === true)
	{
		console.log(otherColsVals);
		console.log(updateColsList);
		table_list.push({"header": updateColsList});
		table_list.push({"body"  : otherColsVals});
		console.log(table_list);
		clearInterval(tableContentsInt);
		// Extract Channel ID then paass it to inject_analytics_explore
		var urlOFpopup	= window.location.pathname;
		var vIdx 		= urlOFpopup.indexOf('/video/');
		var match      	= urlOFpopup.match(/video\//);
		var lastIndex  	= urlOFpopup.lastIndexOf(match[match.length-1]);
		var vID   		= urlOFpopup.substring(lastIndex + 6);
		vID				= vID.substring(0, vID.indexOf('/'));
		saveV_adv_trafficAnalytics("traficAna", vID, table_list);
		setTimeout(function(){chrome.runtime.sendMessage({msg: "get_advanced_video_Analytics_lifetime", vID: vID});}, Math.floor(Math.random() * 15000 + 5000));
	}
}
console.log("in Explore");