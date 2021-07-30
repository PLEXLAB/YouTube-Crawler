/*
	This script uses other helper scripts that conttain different functions for different tasks
	displayOverlay function is located in overlayScript
	saveMetaData function is located in inject_videos_save
	getVideoTitles, getVideUrls, getDate, getVisibility, getVideoDescriptions, getNoViews and getNoComments 
	are located in inject_videos_extract scripts
	https://pypi.org/project/youtube-search-python/
	x = document.querySelectorAll("#contents>ytd-item-section-renderer")

*/
//=========================================================
var urls = new Array();
var overlay = false;
var logged_in_user;
chrome.runtime.sendMessage('identity', function(response) {
		logged_in_user = response.email;
		console.log("Got user:", logged_in_user);
		});
var readyStateScrollDown 	= setInterval(chkScrollReady, 3000);
//var readyStateChkInterval 	= setInterval(chkDocReady	, 100000);
var videoLinkChk 			= setInterval(chkVideoLink	, 150000);
//=========================================================
function chkScrollReady(){
	if (document.readyState === "complete") {
		var notChangedStepsCount = 0;
		
		if (overlay == false){displayOverlay("Collecting Watch History..."); overlay = true;}
		var scrollInterval = setInterval(function () {
			var element = document.querySelector(".element-selector");
			if (element) {
				// element found
				clearInterval(scrollInterval);
				clearInterval(readyStateScrollDown);
				element.scrollIntoView();
			} else if ((document.documentElement.scrollTop + window.innerHeight) < document.documentElement.scrollHeight) {
				// no element -> scrolling
				notChangedStepsCount = 0;
				document.documentElement.scrollTop = document.documentElement.scrollHeight;
			} else if (notChangedStepsCount > 20) {
				// no more space to scroll
				chrome.runtime.sendMessage("autoScrollComplete");
				clearInterval(scrollInterval);
				console.log("done scrolling")
			} else {
				// waiting for possible extension (autoload) of the page
				notChangedStepsCount++;
			}
			
		}, 3000);
		
	}
}
//=========================================================
function chkDocReady(){
	if (document.readyState === "complete") {
		
		

		//displayOverlay("<h2 align='center'>Crawling Your Watch History</h2>");
		//clearInterval(readyStateChkInterval);
	}
}
//=========================================================
function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}
function chkVideoLink(){
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
	var d = new Date();
	var n = d.getDay();
	var days_text=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
	console.log(n);
	var datesforoneweek = [0,0,0,0,0,0,0];
	datesforoneweek[n]= d.toISOString().split("T")[0];
	console.log(datesforoneweek[n]);
	var otherday = 0;
	for(var i = 0; i < 7; i++){
	  if (datesforoneweek[i] == 0){
		if(i > n){
		  otherday = new Date(d);
		  otherday.setDate(otherday.getDate() + (i-n));
		  datesforoneweek[i] = otherday.toISOString().split("T")[0];
		}
		if(n > i){
		  otherday = new Date(d);
		  otherday.setDate(otherday.getDate() - (n-i));
		  datesforoneweek[i] = otherday.toISOString().split("T")[0];
		}
	  }
	}
	console.log(datesforoneweek);
	// Check if Videos tab does exist, then click the videos tab to access videos list
	let videosURLS = document.querySelectorAll("#video-title");
	//let all_dates_sections = document.querySelectorAll("#contents>ytd-item-section-renderer>div>ytd-item-section-header-renderer>div>div")
	let all_dates_sections = document.querySelectorAll("#contents>ytd-item-section-renderer")
	i =  0;
	[].forEach.call(videosURLS, function(videoURL) {
		urls[i++] = videoURL.href;
	});
	let day = "";
	var days = new Array(all_dates_sections.length+1);
	//var merged_days = new Array(all_dates_sections.length+1);
	for(var section = 0; section < all_dates_sections.length; section++){
		day = all_dates_sections[section].querySelector("#title");
		day = day.innerText;
		console.log("todya :", day);
		section_videos = all_dates_sections[section].querySelectorAll("#contents>ytd-video-renderer>div#dismissible>ytd-thumbnail>a");
		//console.log("todya :", section_videos);
		days[section] = new Array(section_videos.length+1);
		
		for(var video = 0; video < section_videos.length; video++){
			days[section][video] = section_videos[video].getAttribute("href");
		}
		if (day == 'Today'){days[section][section_videos.length] = datesforoneweek[n];}
		else if (day == 'Yesterday'){days[section][section_videos.length] = datesforoneweek[n-1];}
		else if (day == 'Sunday' || day == 'Monday' || day == 'Tuesday' || day == 'Wednesday' || day == 'Thursday' || day == 'Friday' || day == 'Saturday'){
			days[section][section_videos.length] = datesforoneweek[n-1];}
		else{days[section][section_videos.length] = d.getUTCFullYear()+'-'+(months.indexOf(day.split(' ')[0])+1)+'-'+day.split(' ')[1];}
	}
	days[all_dates_sections.length] = logged_in_user;
	console.log("todya urls:", days);
	saveWatchHistDataTimeSeries(days);
	console.log("Got user:", logged_in_user);
	saveWatchHistData(logged_in_user, urls);
	console.log(urls) 
	chrome.runtime.sendMessage({msg:'watch', urls: urls});
	clearInterval(videoLinkChk);
}

