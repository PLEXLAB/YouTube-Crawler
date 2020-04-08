windowId = -10;

function callback() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    } else {
        // Tab exists
    }
}

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    if(isNaN(response)) {
        if (response == "Auth"){ 

            // chrome.tabs.create({url: 'https://www.youtube.com/'},
            //    function(tab){
            //      //Update CSP in manifest to bypass
            //      //run report.js in current tab
            //      chrome.tabs.executeScript(tab.id, {file:"../inject/report.js"});                  
            //  });   

            chrome.windows.create({
                url: 'https://www.youtube.com/',
                type: 'normal', width: 400, height: 400,
            },
            function(tab){
                //chrome.tabs.executeScript( {file:"../inject/report.js"});  
                chrome.identity.getAuthToken({'interactive':true}, function (authToken){
                    /*
                    *
                    * personal YT channel general report
                    * 
                    */
                    // $.ajax({
                    //     type: 'POST',
                    //     url:  'https://youtubereporting.googleapis.com/v1/jobs?key=AIzaSyC_HhJ3YZStGj8e3YJtB9hvFthZ4K4wemE',
                    //     headers: {authorization: "Bearer " + authToken},
                    //     contentType: 'application/json',
                    //     data: JSON.stringify( { 
                    //             name: 'POSTRequestTest',
                    //             reportTypeId: 'channel_subtitles_a2',
                    //     }),
                    //     success: function(data){
                    //         //var responseData = JSON.parse(data);
                    //         var responseData = JSON.stringify(data);
                    //         console.log("Success" + responseData);
                    //     },
                    //     error: function(response) {
                    //         console.log("Request Failed");
                    //         console.log(response.message);
                    //     }
                    // }); //end ajax request


                    // $.ajax({
                    //     type: 'GET',
                    //     /*
                    //     * In URL from MyFirstJob Report Job
                    //     * jobId: 9844b0a6-dad4-4655-864a-3d7cd3b7b213
                    //     * reportId: 4996678818
                    //     */
                    //     url:  'https://youtubereporting.googleapis.com/v1/jobs/9844b0a6-dad4-4655-864a-3d7cd3b7b213/reports/4996678818?key=AIzaSyC_HhJ3YZStGj8e3YJtB9hvFthZ4K4wemE',
                    //     headers: {authorization: "Bearer " + authToken},
                    //     contentType: 'application/json',

                    //     success: function(data){
                    //         //var responseData = JSON.parse(data);
                    //         var responseData = JSON.stringify(data);
                    //         console.log("Success" + responseData);
                    //     },
                    //     error: function(response) {
                    //         console.log("Request Failed");
                    //         console.log(response.message);
                    //     }
                    // }); //end ajax request


                    /*
                    * Retreive the report with URL
                    *
                    */
                    $.ajax({
                        type: 'GET',
                        url:  'https://youtubereporting.googleapis.com/v1/media/CHANNEL/hoWWOlQbCXQR42Xih2AB8g/jobs/9844b0a6-dad4-4655-864a-3d7cd3b7b213/reports/4996678818?alt=media',
                        headers: {authorization: "Bearer " + authToken },
                        

                        success: function(data){
                            //var responseData = JSON.parse(data);
                            var responseData = JSON.stringify(data);
                            console.log("Success" + responseData);
                        },
                        error: function(response) {
                            console.log("Request Failed");
                            console.log(response.message);
                        }
                    }); //end ajax request
                    
                    // $.ajax({
                    //     type: 'GET',
                    //     url:  'https://youtubeanalytics.googleapis.com/v2/reports',
                    //     data: {
                    //         access_token: authToken,
                    //         key: 'AIzaSyC_HhJ3YZStGj8e3YJtB9hvFthZ4K4wemE',
                    //         part: "snippet",
                    //         endDate: "2019-06-30",
                    //         ids: "channel==MINE",
                    //         metrics: "views,comments,likes,dislikes,estimatedMinutesWatched,averageViewDuration",
                    //         startDate: "2014-05-01"
                    //     },
                    //     success: function(data){
                    //         //var responseData = JSON.parse(data);
                    //         var responseData = JSON.stringify(data);
                    //         console.log("Success" + responseData);
                    //     },
                    //     error: function(response) {
                    //         console.log("Request Failed");
                    //         console.log(response.message);
                    //     }
                    // }); //end ajax request
                    
                    // //Youtube channel data, interested in playlists UPLOAD ID and CHANNEL ID
                    // $.ajax({
                    //     type: 'GET',
                    //     url:  'https://www.googleapis.com/youtube/v3/channels',
                    //     data: {
                    //         access_token: authToken,
                    //         key: 'AIzaSyC_HhJ3YZStGj8e3YJtB9hvFthZ4K4wemE',
                    //         part: "snippet, contentDetails, statistics",
                    //         mine: "true"
                    //     },
                    //     success: function(data){
                    //         console.log("Success" + data);
                    //     },
                    //     error: function(e) {
                    //         console.log(e.message);
                    //     }   
                    // });//end ajax request

                    // //Youtube playlist ID list, interested in all uploaded videos and video IDs
                    // //Interested in video date first published
                    // $.ajax({
                    //     type: 'GET',
                    //     url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                    //     data: {
                    //         access_token: authToken,
                    //         key: 'AIzaSyC_HhJ3YZStGj8e3YJtB9hvFthZ4K4wemE',
                    //         part: "snippet, contentDetails",
                    //         /*
                    //         *   TO DO: Parse through playlists IDs to get UPLOAD ID and pass it here
                    //         *          for now, using a static upload playlist ID from personal channel
                    //         */
                    //         playlistId: "UUhoWWOlQbCXQR42Xih2AB8g" 
                    //     },
                    //     success: function(data){
                    //         console.log("Success" + data);
                    //     },
                    //     error: function(e) {
                    //         console.log(e.message);
                    //     }
                    // });//end ajax request
                });//end getAuthToken function           
            });//end chrome.windows.create
            
        }
    }
}); 