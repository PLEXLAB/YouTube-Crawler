var newTabId 	= -10;
var windowId 	= -10;
var vID 		= "" ;
function callback() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    } else {
        // Tab exists
    }
}

//chrome.browserAction.onClicked.addListener(function(tab){}); for later use
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
	if(isNaN(response))
	{
		// Message sent from inject_video_save script to tell if the DB server is not available 
		if(response === "NetworkError")
		{
			chrome.browserAction.setBadgeText({text: 'Error!'});
			chrome.windows.get(sender.tab.windowId, function(){
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
				} else {
					chrome.windows.remove(sender.tab.windowId);
				}
			});
		}
		// Message sent from inject_analytics script
		if(response === "channelCrawled")
		{
			chrome.browserAction.setBadgeText({text: 'Done!'});
						chrome.windows.get(sender.tab.windowId, function(){
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
				} else {
					chrome.windows.remove(sender.tab.windowId);
				}
			});
		}
		// Message sent from DB_portal server. "not found" means the consent form has not been filled for the channel to be crawled
		if(response.chIDFoundStatus === "not found")
		{
			chrome.windows.update(sender.tab.windowId, {state:"maximized"},function(windowUpdated){});
			chrome.tabs.get(newTabId, function(){
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
				} else {
					chrome.tabs.update(newTabId, {url: 'https://plexweb.cs.nmsu.edu/consentForm?chID='+response.chIDString});
				}
			});
		}
		// Message sent from inject script that crawl data from videos tab
		if(response === "deleteVtab")
		{
			chrome.tabs.getAllInWindow(sender.tab.windowId, function(tabs){chrome.tabs.remove(tabs[0].id);});
		}
		// Message sent from inject script after crawling and saving videos Metadata
		if(response === "get_single_video_Analytics_lifetime")
		{
			chrome.storage.sync.get(
				{list:[]},
				function(data) {
					console.log(data.list);
					vID = data.list.pop();
					chrome.storage.sync.set(
						{list : data.list}, 
						function(){console.log("Video ID is added to videos list");}
					);
					if( vID !== undefined){
						chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/video/' + vID + '/analytics/./period-lifetime'},
							function(tab){
								chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
								chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
								chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_vAnalytics_save.js"});
								chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_analytics_Single_video_lifetime.js"});
						});
					}
					else{
						// Start getting channel analytics after finshing video analytics
						chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/channel/*/analytics/./period-lifetime'}, 
							function(tab){
								chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
								chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
								chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_chAnalytics_save.js"});
								chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_analytics_lifetime.js"});

						});
					}
				}
			);
		}
		//===================not used
		// Message sent from inject_analytics script that collects data from week range analytics 
		if(response === "getAnalytics_4week")
		{
			chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/channel/*/analytics/./period-4_weeks'}, 
				function(tab){
					chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_chAnalytics_save.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_analytics_4weeks.js"});
			});
		}
		// Message sent from inject_analytics_4weeks script
		if(response === "getAnalytics_quarter")
		{
			chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/channel/*/analytics/./period-quarter'}, 
				function(tab){
					chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_chAnalytics_save.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_analytics_quarter.js"});
			});
		}
		// Message sent from inject_analytics_quarter script
		if(response === "getAnalytics_year")
		{
			chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/channel/*/analytics/./period-year'}, 
				function(tab){
					chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_chAnalytics_save.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_analytics_year.js"});
			});
		}
		// Message sent from inject_analytics_year script
		if(response === "getAnalytics_lifetime")
		{
			chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/channel/*/analytics/./period-lifetime'}, 
				function(tab){
					chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_chAnalytics_save.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_analytics_lifetime.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/socket.io.js"});
			});
		}
		//===================end of not used
		// Message sent from inject/inject_analytics_lifetime
		if(response.msg === "getAanalytics_explore_chVideo")
		{
			chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/channel/' + response.channelID + '/analytics/tab-overview/period-lifetime/explore?entity_type=CHANNEL&entity_id=' + response.channelID + '&time_period=lifetime&explore_type=TABLE_AND_CHART&chart_type=LINE_CHART&metric=VIEWS&granularity=DAY&t_metrics[]=VIDEO_THUMBNAIL_IMPRESSIONS&t_metrics[]=VIDEO_THUMBNAIL_IMPRESSIONS_VTR&t_metrics[]=VIEWS&t_metrics[]=AVERAGE_WATCH_TIME&t_metrics[]=WATCH_TIME&dimension=VIDEO&o_column=VIEWS&o_direction=ANALYTICS_ORDER_DIRECTION_DESC'}, 												 
				function(tab){
					chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_chExpAnalytics_save.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_analytics_explore_video.js"});
			});
		}
		// Message sent from inject_analytics_explore_video
		if(response.msg === "getAanalytics_explore_Traffic")
		{						 
			chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/channel/' + response.channelID + '/analytics/tab-overview/period-lifetime/explore?entity_type=CHANNEL&entity_id=' + response.channelID + '&time_period=lifetime&explore_type=TABLE_AND_CHART&chart_type=LINE_CHART&metric=WATCH_TIME&granularity=DAY&t_metrics[]=WATCH_TIME&t_metrics[]=VIEWS&t_metrics[]=AVERAGE_WATCH_TIME&t_metrics[]=VIDEO_THUMBNAIL_IMPRESSIONS&t_metrics[]=VIDEO_THUMBNAIL_IMPRESSIONS_VTR&dimension=TRAFFIC_SOURCE_TYPE&o_column=WATCH_TIME&o_direction=ANALYTICS_ORDER_DIRECTION_DESC'},	
				function(tab){
					chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_chExpAnalytics_save.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_analytics_explore_Trafic.js"});
			});
		}
		// Message sent from inject_analytics_explore_video
		if(response.msg === "getAanalytics_explore_Geography")
		{						 
			chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/channel/' + response.channelID + '/analytics/tab-overview/period-lifetime/explore?entity_type=CHANNEL&entity_id=' + response.channelID + '&time_period=lifetime&explore_type=TABLE_AND_CHART&chart_type=BAR_CHART&metric=WATCH_TIME&granularity=DAY&t_metrics[]=WATCH_TIME&t_metrics[]=VIEWS&t_metrics[]=AVERAGE_WATCH_TIME&dimension=COUNTRY&o_column=WATCH_TIME&o_direction=ANALYTICS_ORDER_DIRECTION_DESC'},
				function(tab){
					chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_chExpAnalytics_save.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_analytics_explore_Geo.js"});
			});
		}
		// Message sent from inject_analytics_explore_video getAanalytics_explore_Gender
		if(response.msg === "getAanalytics_explore_Age")
		{						 
			chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/channel/' + response.channelID + '/analytics/tab-overview/period-lifetime/explore?entity_type=CHANNEL&entity_id=' + response.channelID + '&time_period=lifetime&explore_type=TABLE_AND_CHART&chart_type=BAR_CHART&metric=WATCH_TIME&granularity=DAY&t_metrics[]=VIEWS&t_metrics[]=AVERAGE_WATCH_TIME&t_metrics[]=AVERAGE_WATCH_PERCENTAGE&t_metrics[]=WATCH_TIME&dimension=VIEWER_AGE&o_column=VIEWER_AGE&o_direction=ANALYTICS_ORDER_DIRECTION_ASC'},
				function(tab){
					chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_chExpAnalytics_save.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_analytics_explore_Age.js"});
			});
		}
		// Message sent from inject_analytics_explore_video get
		if(response.msg === "getAanalytics_explore_Gender")
		{						 
			chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/channel/' + response.channelID + '/analytics/tab-overview/period-lifetime/explore?entity_type=CHANNEL&entity_id=' + response.channelID + '&time_period=lifetime&explore_type=TABLE_AND_CHART&chart_type=BAR_CHART&metric=WATCH_TIME&granularity=DAY&t_metrics[]=VIEWS&t_metrics[]=AVERAGE_WATCH_TIME&t_metrics[]=AVERAGE_WATCH_PERCENTAGE&t_metrics[]=WATCH_TIME&dimension=VIEWER_GENDER&o_column=VIEWER_GENDER&o_direction=ANALYTICS_ORDER_DIRECTION_ASC'},
				function(tab){
					chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_chExpAnalytics_save.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_analytics_explore_Gender.js"});
				});
		}
	}
	else{
		// Numeric Message containing popup window id of the newly created window sent from popup script
		windowId = response;
		chrome.tabs.getAllInWindow(response, function(tabs)
		{
			if(tabs.length > 1){
				newTabId = tabs[1].id;
				console.log(tabs[1].windowType);
				console.debug(tabs[1].url);
			}
			else{
				newTabId = tabs[0].id;
				console.debug(tabs[0].url);
			}
		});
	}
});

// https://www.youtube.com/watch?v=p1Zb90MFf20&list=RDCMUCMTk_R_Y49jvq-HQXDmKI0Q&index=35
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		/*
		["https://www.youtube.com/watch?*", "http://www.youtube.com/watch?*", "https://www.youtube.com/results*",
			"https://m.youtube.com/watch?*", "http://m.youtube.com/watch?*", "https://m.youtube.com/results*"]
		Reference - https://regexr.com/
		*/
		let regex = /((https|http):\/\/(www|m).youtube.com\/(watch|results).*)$/g
		let notRegex = /((https|http):\/\/(www|m).youtube.com\/(watch|results)(.*)(&index)(.*))$/g
		if (changeInfo.url.match(regex) && !changeInfo.url.match(notRegex)) {
			console.log("Tab updated: " + tab.url);

			chrome.tabs.sendMessage(tabId, {
				message : 'hello!',
				url: changeInfo.url
			}, function (response) {
				console.log(response);
			});
			console.log(tabId)
			chrome.tabs.reload(tabId);

		}
	  
});