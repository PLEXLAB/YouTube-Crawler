var API_KEY = 'AIzaSyC_HhJ3YZStGj8e3YJtB9hvFthZ4K4wemE';
var API_URL = 'https://youtubereporting.googleapis.com/v1/jobs?key='+API_KEY;


/*
* JSON Structure
* jobsArrObject = {
*   JobName:
*   JobID:    
* }
*/
var jobsArr = [];

/*
* reports object = {
*   repID:
*   jobID:
*   startTime:
*   endTime:
*   createTime:
*   downloadURL:
* }
*/
var reportsArr = []; 

function callback() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    } else {
        // Tab exists
    }
}

/* Authenticate first and start creating jobs */
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    if(isNaN(response)) {

        if (response == "Authenticate"){ 
            chrome.identity.getAuthToken({'interactive':true}, function (authToken){
                
                //TO DO: upon successful creation set a chrome alarm to
                //       automate report retrievals
                $.ajax({
                    /* Channel Basic */
                    type: 'POST',
                    url:  API_URL,
                    headers: {authorization: "Bearer " + authToken},
                    contentType: 'application/json',
                    data: JSON.stringify({ 
                        name: 'Channel Basic',
                        reportTypeId: 'channel_basic_a2'
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
            
                /* Content Owner Demographics 
                * 
                *  INSUFFICIENT PERMISSIONS, need G suite service account?
                * 
                *  From Reporting API documentation: Forbidden (403) The request attempted 
                *  to create a job for a system-managed report. 
                *  YouTube will automatically generate system-managed reports, 
                *  and content owners will not be able to modify or delete jobs that 
                *  create those reports
                * 
                */
                // $.ajax({
                //     type: 'POST',
                //     url: API_URL,  
                //     headers: {authorization: "Bearer " + authToken},
                //     contentType: 'application/json',
                //     data: JSON.stringify({ 
                //         name: 'Content Owner Demographics',
                //         reportTypeId: 'content_owner_demographics_a1'
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
                // });
            
                /* Channel Province */
                $.ajax({
                    type: 'POST',
                    url:  API_URL,
                    headers: {authorization: "Bearer " + authToken},
                    contentType: 'application/json',
                    data: JSON.stringify({ 
                        name: 'Channel Province',
                        reportTypeId: 'channel_province_a2'
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
            
                /* Channel Traffic Source */
                $.ajax({
                    type: 'POST',
                    url:  API_URL,
                    headers: {authorization: "Bearer " + authToken},
                    contentType: 'application/json',
                    data: JSON.stringify({ 
                        name: 'Channel Traffic Source',
                        reportTypeId: 'channel_traffic_source_a2'
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
            
                /* Content Onwer Estimated Revenue
                * 
                *  INSUFFICIENT PERMISSIONS, need G suite service account?
                */
                // $.ajax({
                //     type: 'POST',
                //     url:  API_URL,
                //     headers: {authorization: "Bearer " + authToken},
                //     contentType: 'application/json',
                //     data: JSON.stringify({ 
                //         name: 'Content Owner Estimated Revenue',
                //         reportTypeId: 'content_owner_estimated_revenue_a1'
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
                // });


                /* Get list of jobs just created */
                $.ajax({
                    type: 'GET',
                    url: API_URL,
                    headers: {authorization: "Bearer " + authToken },

                    success: function(data){
                        console.log("Success" + data);
                        for(job of data.jobs){
                            jobsArr.push({
                                "JobName": job.name, 
                                "JobID": job.id
                            });
                        }
                        console.log(jobsArr);
                    },
                    error: function(response) {
                        console.log("Request Failed");
                        console.log(response.message);
                    }
                });
                
                //at this point set a chrome alarm to retrieve first jobs
                chrome.alarms.create("DailyReports", {delayInMinutes: 0.1, periodInMinutes: 0.1});
            });
        }             
    }
}); 

/** listen for the chrome alarms here **/
chrome.alarms.onAlarm.addListener(function (alarm){
    console.log("Got an alarm ", alarm);
    var jobID = '';
    var reportID = '';
    var reportURL = 'https://youtubereporting.googleapis.com/v1/jobs/'+ jobID +'/reports/'+ reportID +'?key='+API_KEY;

    chrome.identity.getAuthToken({'interactive': false}, function(authToken){
        
        /* Calls a list of reportIDs for all jobs in the jobs array */
        for(jobs of jobsArr){
            jobID = jobs.JobID;
            
            $.ajax({
                /*
                * Calls a get request on for a report based on sepecific jobID
                * returns a download URL
                */
                type: 'GET',
                url:  'https://youtubereporting.googleapis.com/v1/jobs/'+ jobID +'/reports/'+'?key=' + API_KEY,
                headers: {authorization: "Bearer " + authToken},
                contentType: 'application/json',

                success: function(data){
                    console.log("Success " + data);
                    for(rep of Object.keys(data)){ //not iterable?
                        reportsArr.push({
                            "repID": rep.id
                            // "jobID": rep.jobId,
                            // "startTime": rep.startTime,
                            // "endTime": rep.endTime,
                            // "createTime": rep.createTime,
                            // "downloadURL": rep.downloadUrl
                        });
                    }
                    
                    console.log(reportsArr);
                },
                error: function(response) {
                    console.log("Request Failed ");
                    console.log(response.message);
                }
            }); 
        }
        
    });
});

//TO DO: finally get latest report bu calling GET req with download URL 

//on suspend test 
chrome.runtime.onSuspend.addListener(function() {
    chrome.browserAction.setBadge({text: 'Suspended'});
    console.log("Suspended...");
});
  