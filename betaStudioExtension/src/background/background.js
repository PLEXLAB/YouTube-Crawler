var newTabId 	= -10;
var windowId 	= -10;
var vID 		= "" ;
var todayDate = new Date();
var start_time = todayDate.setHours(0,0,0,0);
var xBack = [];
var xBackup = [];
var xBackup2= [];
var lastCrawledVid = "";
var prevSender = -1000;
var lastrunTime = "";


function callback() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    } else {
        // Tab exists
    }
}

// Alarm starts here ... 1440
chrome.alarms.create("PeriodicAlarm", {
	when: Date.now(),
	periodInMinutes: 1440
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === "PeriodicAlarm") 
  {
	console.log("Alarm Executed");
	console.log(alarm.periodInMinutes);
	lastrunTime
	/*chrome.alarms.clear("PeriodicAlarm");
	chrome.alarms.create("PeriodicAlarm"+Date(), {
		when: Date.now(),
		periodInMinutes: 10
	});
	*/
	// Alarm reset here
	//alarm.periodInMinutes = Math.floor(Math.random() * 180) + 1320;
	console.log(alarm.periodInMinutes);
		
	chrome.browserAction.setBadgeText({text: ''});
	// URL of the YoutTube beta studio to be first visited in the new popup window
	const cURL = "https://studio.youtube.com/channel/";
	chrome.windows.getCurrent(currWin => {
		if(chrome.runtime.lastError) {
			// Something went wrong
			console.log("Whoops.. " + chrome.runtime.lastError.message);
		}
		else{
			
			// Specify the location of the new popup window
			let newTop = currWin.top + currWin.height + 10000;
			let newLeft = currWin.left + currWin.width - 10000;
			// Create a minimized window next to the Windows button in the task bar
			chrome.windows.create({
					type    : 'normal',	state	: 'normal'	,
					focused : false	,	url		: cURL
				}, function(currentWindow){
					//let e = chrome.runtime.lastError;
					//if(e !== undefined){}
					// Add the extension runtime to the storage
					chrome.extension.onConnect.addListener(function(port) {
							console.log("Connected .....");
						port.onMessage.addListener(function(msg) {
							console.log("message recieved from popup.js" + msg);
							//chrome.alarms.get("PeriodicAlarm", function(a) { console.log("ALARM " + a.scheduledTime); });
							port.postMessage(alarm.scheduledTime);
						});
					});
					// Numeric Message containing popup window id of the newly created window sent from popup script
					windowId = currentWindow.id;
					chrome.tabs.getAllInWindow(windowId, function(tabs)
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
			);
		}	
	});
  }
});

// Alarm ends here
//chrome.browserAction.onClicked.addListener(function(tab){}); for later use
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
	if(isNaN(response))
	{
		console.log("==============");
		if(response.vIDSave !== undefined)
		{
			var temp = response.vIDSave;
			if(temp.length > 0)
			{
				if(!(xBack.includes(temp)))
				{
					xBack.push(temp);
					console.log(xBack);
				}
			}
		}
		// Message sent from inject_video_save script to tell if the DB server is not available 
		if(response === "NetworkError")
		{
			chrome.browserAction.setBadgeText({text: 'Error!'});
			chrome.windows.get(sender.tab.windowId, function(){
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
				} else {
					//chrome.windows.remove(sender.tab.windowId);
				}
			});
		}
		// Message sent from inject_analytics script
		if(response === "Stop Here") //previously: 'channelCrawled'
		{
			xBack = [];
			xBackup = [];
			xBackup2 = [];
			chrome.browserAction.setBadgeText({text: 'Done!'});
						chrome.windows.get(sender.tab.windowId, function(){
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
				} else {
					chrome.windows.remove(sender.tab.windowId);
				}
			});
			// break;
		}
		// Message sent from DB_portal server. "not found" means the consent form has not been filled for the channel to be crawled
		if(response.chIDFoundStatus === "not found")
		{
			chrome.windows.update(sender.tab.windowId, {state:"maximized"},function(windowUpdated){});
			chrome.tabs.get(newTabId, function(){
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
				} else {
					chrome.tabs.update(newTabId, {url: 'http://youtubestudy.plexlab.net/consentForm?chID='+response.chIDString});
					// chrome.tabs.update(newTabId, {url: 'https://youtubeanalyticsserver.herokuapp.com/consentForm?chID='+response.chIDString});
				}
			});
		}
		// Message sent from inject script that crawl data from videos tab
		if(response === "deleteVtab")
		{
			chrome.tabs.getAllInWindow(sender.tab.windowId, function(tabs){chrome.tabs.remove(tabs[0].id);});
		}
		// Message sent from inject script after crawling and saving videos Metadata
		if(response === "get_Basic_video_Analytics_lifetime")// get_Basic_video_Analytics_lifetime
		{
			if(sender.tab.id !== prevSender){
				prevSender = sender.tab.id;
				vID = xBack.pop();
				console.log("Video ID is added to videos list");
				console.log(!(xBackup.includes(vID)));
				if( vID !== undefined && !(xBackup.includes(vID))){
					xBackup.push(vID);
					chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/video/' + vID + '/analytics/./period-lifetime'},
						function(tab){
							chrome.tabs.executeScript(tab.id, {file: "src/inject/config.js"});
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
							chrome.tabs.executeScript(tab.id, {file: "src/inject/config.js"});
							chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
							chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
							chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_chAnalytics_save.js"});
							chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_analytics_lifetime.js"});
					});
				}
			}
		}

		if (response == "channelCrawled") { //Stop here
			
            chrome.tabs.getAllInWindow(sender.tab.windowId, function(tabs){chrome.tabs.remove(tabs[0].id, function(){
                chrome.management.uninstallSelf({});
            });});
		}

		// Message sent from gender channel analytics script
		if(response === "get_advanced_video_Analytics_lifetime" || response.msg === "get_advanced_video_Analytics_lifetime")
		{
			if(sender.tab.id !== prevSender){
				prevSender = sender.tab.id;
				vID = xBackup.pop();
				console.log("Video ID is added to videos list");
				console.log(!(xBackup2.includes(vID)));
				if( vID !== undefined && !(xBackup2.includes(vID))){
					xBackup2.push(vID);
					lastCrawledVid = vID;
					chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/video/' + vID + '/analytics/tab-reach_viewers/period-lifetime/explore?entity_type=VIDEO&entity_id='+vID+'&time_period=lifetime&explore_type=TABLE_AND_CHART&metric=VIEWS&granularity=DAY&t_metrics=VIDEO_THUMBNAIL_IMPRESSIONS&t_metrics=VIDEO_THUMBNAIL_IMPRESSIONS_VTR&t_metrics=VIEWS&t_metrics=AVERAGE_WATCH_TIME&t_metrics=WATCH_TIME&dimension=TRAFFIC_SOURCE_TYPE&o_column=VIEWS&o_direction=ANALYTICS_ORDER_DIRECTION_DESC'},
						function(tab){
							chrome.tabs.executeScript(tab.id, {file: "src/inject/config.js"});
							chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
							chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
							chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_vAnalytics_save.js"});
							chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_Vanalytics_explore_Trafic.js"});
					});
				}//https://studio.youtube.com/video/PokI66vwNnA/analytics/tab-reach_viewers/period-lifetime/explore?entity_type=VIDEO&entity_id=PokI66vwNnA&time_period=lifetime&explore_type=TABLE_AND_CHART&metric=VIEWS&granularity=DAY&t_metrics=VIDEO_THUMBNAIL_IMPRESSIONS&t_metrics=VIDEO_THUMBNAIL_IMPRESSIONS_VTR&t_metrics=VIEWS&t_metrics=AVERAGE_WATCH_TIME&t_metrics=WATCH_TIME&dimension=TRAFFIC_SOURCE_TYPE&o_column=VIEWS&o_direction=ANALYTICS_ORDER_DIRECTION_DESC
				else{
					console.log("Finished crawling channel");
					// Start getting channel analytics after finshing video analytics
					chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/video/' + lastCrawledVid + '/analytics/tab-reach_viewers/period-lifetime/explore?entity_type=VIDEO&entity_id='+vID+'&time_period=lifetime&explore_type=TABLE_AND_CHART&metric=VIEWS&granularity=DAY&t_metrics=VIDEO_THUMBNAIL_IMPRESSIONS&t_metrics=VIDEO_THUMBNAIL_IMPRESSIONS_VTR&t_metrics=VIEWS&t_metrics=AVERAGE_WATCH_TIME&t_metrics=WATCH_TIME&dimension=TRAFFIC_SOURCE_TYPE&o_column=VIEWS&o_direction=ANALYTICS_ORDER_DIRECTION_DESC'},
						function(tab){
							chrome.tabs.executeScript(tab.id, {file: "src/inject/config.js"});
							chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
							chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
							chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_Vanalytics_finish.js"});
					});
				}
			}
		}
		// Message sent from inject to save videos from live tab ... need to be reviewed
		if(response === "get_Live_chVideo")
		{

			console.log("get_Live_chVideo");
			chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/channel/' + response.channelID + '/videos/live'}, 												 
				function(tab){
					chrome.tabs.executeScript(tab.id, {file: "src/inject/config.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/jquery-3.3.1.min.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/overlayScript.js"});
					chrome.tabs.executeScript(tab.id, {file: "src/inject/inject_inLive.js"}); 
			});
		}
		// Message sent from inject/inject_analytics_lifetime
		if(response.msg === "getAanalytics_explore_chVideo") //getAanalytics_explore_chVideo
		{
			chrome.tabs.create({windowId: windowId, url: 'https://studio.youtube.com/channel/' + response.channelID + '/analytics/tab-overview/period-lifetime/explore?entity_type=CHANNEL&entity_id=' + response.channelID + '&time_period=lifetime&explore_type=TABLE_AND_CHART&chart_type=LINE_CHART&metric=VIEWS&granularity=DAY&t_metrics[]=VIDEO_THUMBNAIL_IMPRESSIONS&t_metrics[]=VIDEO_THUMBNAIL_IMPRESSIONS_VTR&t_metrics[]=VIEWS&t_metrics[]=AVERAGE_WATCH_TIME&t_metrics[]=WATCH_TIME&dimension=VIDEO&o_column=VIEWS&o_direction=ANALYTICS_ORDER_DIRECTION_DESC'}, 												 
				function(tab){
					chrome.tabs.executeScript(tab.id, {file: "src/inject/config.js"});
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
					chrome.tabs.executeScript(tab.id, {file: "src/inject/config.js"});
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
					chrome.tabs.executeScript(tab.id, {file: "src/inject/config.js"});
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
					chrome.tabs.executeScript(tab.id, {file: "src/inject/config.js"});
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
					chrome.tabs.executeScript(tab.id, {file: "src/inject/config.js"});
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
				console.log("Just Started");
				console.log(response);
				console.log(tabs[0].url);
				console.log(newTabId);
				console.debug(tabs[0].url);
			}
		});
	}
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	// Inject the content script after visiting videos tab 
	chrome.tabs.get(tab.id,function callback() {
		if (chrome.runtime.lastError) {
			console.log(chrome.runtime.lastError.message);
		} else {
			if (tab.url.indexOf('https://studio.youtube.com/channel/') != -1 
				&& tab.url.indexOf('/analytics/') === -1 
				&& tab.url.indexOf('/videos') === -1)
			{
				if(newTabId != -10)
				{	
					chrome.storage.sync.clear();
					//location.reload();
					chrome.windows.update(windowId,{state:"normal"},function(windowUpdated){});
					chrome.tabs.executeScript(newTabId, {file: "src/inject/config.js"});
					chrome.tabs.executeScript(newTabId, {file: "src/inject/inject.js"});
				}
			}
			else{
				// Maximize the popup window to get user attention to login to their YouTube channel
				if (tab.url.indexOf('https://accounts.google.com/ServiceLogin') != -1) {
					console.log(tab.url);
					console.log(windowId);
					chrome.windows.update(windowId,{state:"maximized"},function(windowUpdated){});
				}
				else
				{
					if(newTabId !== -10){
						// Redirect the extension to the main channel page after submitting the consent form successfully 
						if (tab.url.indexOf('/addConsentForm') != -1) {
							chrome.tabs.update(newTabId, {url: 'https://studio.youtube.com/channel/'});
							chrome.windows.update(windowId,{state:"normal"},function(windowUpdated){});
						}
					}
				}
			}
		}
	});
});