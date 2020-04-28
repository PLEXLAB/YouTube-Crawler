
//TO DO: Create an onSuspend chrome function to get the latest reports from a specific job
//       and store report information in chrome storage

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


/* returns a download URL to a specific report using its ID
// $.ajax({
//     /*
//     * In URL from MyFirstJob Report Job,
//     * jobId: 9844b0a6-dad4-4655-864a-3d7cd3b7b213
//     * reportId: 4996678818
//     * returns a download URL
//     */
//     type: 'GET',
//     url:  'https://youtubereporting.googleapis.com/v1/jobs/9844b0a6-dad4-4655-864a-3d7cd3b7b213/reports/4996678818?key=AIzaSyC_HhJ3YZStGj8e3YJtB9hvFthZ4K4wemE',
//     headers: {authorization: "Bearer " + authToken},
//     contentType: 'application/json',

//     success: function(data){
//         //var responseData = JSON.parse(data);
//         //var responseData = JSON.stringify(data);
//         console.log("Success " + data);
//     },
//     error: function(response) {
//         console.log("Request Failed ");
//         console.log(response.message);
//     }
// }); 