var browseraction = {};
//browseraction.QUICK_ADD_API_URL = 'https://youtubeanalytics.googleapis.com/v2/reports';
browseraction.URL = 'https://youtubeanalytics.googleapis.com/v2/reports';

var execute = document.getElementById("ex");

execute.addEventListener("click", function(){
    console.log("execute button clicked!");

    //send message to background with to execute Auth
    chrome.runtime.sendMessage("Auth");
});


