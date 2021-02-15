// The following functions are used to extract metadata from videos tab
// Get outerHtml for all visibility section
function getOuterHtml_Vis()
{
	var outerHTML_Vis = [];
	let outerHTML_VisS = document.querySelectorAll("#row-container > div:nth-child(3)");
	if(outerHTML_VisS.length > 0){
		for (var i = 0; i < outerHTML_VisS.length; i++) {
			outerHTML_Vis.push(outerHTML_VisS[i].outerHTML);
		}
	}
	return outerHTML_Vis;
}
// Get outerHtml for all Monitization section
function getOuterHtml_Mon()
{
	var outerHTML_Mon = [];
	let outerHTML_MonS = document.querySelectorAll("#row-container > div:nth-child(4)");
	if(outerHTML_MonS.length > 0){
		for (var i = 0; i < outerHTML_MonS.length; i++) {
			outerHTML_Mon.push(outerHTML_MonS[i].outerHTML);
		}
	}
	return outerHTML_Mon;
}
// Get outerHtml for all restrictions section
function getOuterHtml_Rist()
{
	var outerHTML_Rist = [];
	let outerHTML_RistS = document.querySelectorAll("#row-container > div:nth-child(5)");
	if(outerHTML_RistS.length > 0){
		for (var i = 0; i < outerHTML_RistS.length; i++) {
			outerHTML_Rist.push(outerHTML_RistS[i].outerHTML);
		}
	}
	return outerHTML_Rist;
}

// Get videos titles
function getVideoTitles()
{
	var vTitles = [];
	let videoTitles = document.querySelectorAll("#video-title");
	if(videoTitles.length > 0){
		for (var i = 0; i < videoTitles.length; i++) {
			vTitles.push(videoTitles[i].innerText);
		}
	}
	return vTitles;
}
// Get videos URLS
function getVideUrls()
{
	var vURLS = [];
	let videoUrls = document.querySelectorAll("#video-title");
	if(videoUrls.length > 0){
		for (var i = 0; i < videoUrls.length; i++) {
			var vurl = videoUrls[i].getAttribute("href");
			var temp = vurl.substring(7);
			var slashIndex = temp.indexOf('/'); 
			vurl = temp.substring(0, slashIndex != -1 ? slashIndex : temp.length);
			vurl = "https://www.youtube.com/watch?v=" + vurl;
			vURLS.push(vurl);
			console.log(vurl);
		}	
	}
	return vURLS;
}
// Get upload dates for all videos
function getDate()
{
	var vDatesList = [];
	let videoDate = document.querySelectorAll("#row-container > div.style-scope.ytcp-video-row.cell-body.tablecell-date.sortable.column-sorted");
	if(videoDate.length > 0){
		for (var i = 0; i < videoDate.length; i++) {
			let vDate = videoDate[i].innerText;
			vDatesList.push(vDate);
		}
	}
	return vDatesList;
}
// Get the visisbility status for all videos such as Private, Public and Unlisted
function getVisibility()
{
	var vVisList = [];
	let videoVis = document.querySelectorAll("#row-container > div.style-scope.ytcp-video-row.cell-body.tablecell-visibility > div > div > span");
	if(videoVis.length > 0){
		for (var i = 0; i < videoVis.length; i++) {
			var temp = videoVis[i].innerText;
			vVisList.push(temp)
			console.log(videoVis[i].innerText);
		}
	}
	return vVisList;
}
// Get videos descriptions written the by the creator
function getVideoDescriptions()
{
	var vDescList = [];
	let videoDescriptions = document.querySelectorAll("#video-info > div");
	if(videoDescriptions.length > 0){
		for (var i = 0; i < videoDescriptions.length; i++) {
			vDescList.push(videoDescriptions[i].innerText);
			//console.log(videoDescriptions[i].innerText);
		}	
	}
	return vDescList;
}
// Get number of views 
function getNoViews()
{
	var vViewsList = [];
	let videoViews = document.querySelectorAll("#row-container > div.style-scope.ytcp-video-row.cell-body.tablecell-views.sortable.right-align");
	if(videoViews.length > 0){
		for (var i = 0; i < videoViews.length; i++) {
			vViewsList.push(videoViews[i].innerText);
			//console.log(videoViews[i].innerText);
		}	
	}
	return vViewsList;
}
// Get no of comments
function getNoComments()
{
	var vNoCommList = [];
	let videoComments = document.querySelectorAll("#row-container > div.style-scope.ytcp-video-row.cell-body.tablecell-comments.right-align > a");
	if(videoComments.length > 0){
		for (var i = 0; i < videoComments.length; i++) {
			vNoCommList.push(videoComments[i].innerText);
			//console.log(videoComments[i].innerText);
		}	
	}
	return vNoCommList;
}