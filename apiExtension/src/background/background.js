const API_KEY = 'AIzaSyC_HhJ3YZStGj8e3YJtB9hvFthZ4K4wemE';

function callback() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    } else {
        // Tab exists
    }
}

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    if(isNaN(response)) {

        if (response == "Authenticate"){
            chrome.identity.getAuthToken({'interactive':true}, function (authToken){
                chrome.tabs.create({url: "https://www.youtube.com/"});
            });
        }

        if (response == "Create"){ 
            chrome.identity.getAuthToken({'interactive':false}, function (authToken){
                
                //TO DO: have user enter a name for JOB
                //TO DO: have user choose from a list for reportTypeId
                //TO DO: upon successful creation set a chrome alarm to
                //       automate report retrievals
                var rt = "";
                chrome.storage.local.get(['reportType'], function(data){
                    rt = data.reportType;
                    console.log(rt);
                });

                $.ajax({
                    type: 'POST',
                    url:  'https://youtubereporting.googleapis.com/v1/jobs?key=AIzaSyC_HhJ3YZStGj8e3YJtB9hvFthZ4K4wemE',
                    headers: {authorization: "Bearer " + authToken},
                    contentType: 'application/json',
                    data: JSON.stringify({ 
                        name: 'POSTRequestTest2',
                        reportTypeId: rt
                        //reportTypeId: 'channel_subtitles_a2',
                    }),
                    success: function(data){
                        //var responseData = JSON.parse(data);
                        var responseData = JSON.stringify(data);
                        console.log("Success" + responseData);
                    },
                    error: function(response) {
                        console.log("Request Failed");
                        console.log(response.message);
                    }
                }); 
            });
        }
        
        //TO DO: Have user choose from a drop down list of current active jobs
        //       programitically get the job's ID and reportID, add to url
        if (response == "Retrieve") {
            chrome.identity.getAuthToken({'interactive':false}, function(authToken){
                $.ajax({
                    /*
                    * In URL from MyFirstJob Report Job,
                    * jobId: 9844b0a6-dad4-4655-864a-3d7cd3b7b213
                    * reportId: 4996678818
                    * returns a download URL
                    */
                    type: 'GET',
                    url:  'https://youtubereporting.googleapis.com/v1/jobs/9844b0a6-dad4-4655-864a-3d7cd3b7b213/reports/4996678818?key=AIzaSyC_HhJ3YZStGj8e3YJtB9hvFthZ4K4wemE',
                    headers: {authorization: "Bearer " + authToken},
                    contentType: 'application/json',
    
                    success: function(data){
                        //var responseData = JSON.parse(data);
                        //var responseData = JSON.stringify(data);
                        console.log("Success " + data);
                    },
                    error: function(response) {
                        console.log("Request Failed ");
                        console.log(response.message);
                    }
                });
            });   
        }


                    /*
                    * Retreive the report with download URL
                    */
                    // $.ajax({
                    //     type: 'GET',
                    //     url:  'https://youtubereporting.googleapis.com/v1/media/CHANNEL/hoWWOlQbCXQR42Xih2AB8g/jobs/9844b0a6-dad4-4655-864a-3d7cd3b7b213/reports/4996678818?alt=media',
                    //     headers: {authorization: "Bearer " + authToken },
                        

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
    }
}); 

//TO DO: Create an onSuspend chrome function to get the latest reports from a specific job
//       and store report information in chrome storage

//User Interaction: last time report was received, minimal interaction 
  