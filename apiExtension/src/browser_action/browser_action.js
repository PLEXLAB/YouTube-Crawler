var authClickCount = 0;

document.getElementById("authenticateButton").addEventListener('click', function(){
    chrome.runtime.sendMessage("Authenticate");
    console.log("auth button clicked...");
    authClickCount++;
});

// document.getElementById("getDailyReport").addEventListener('click', function(){
//     console.log("Daily Report Request...");
//     chrome.runtime.sendMessage("getDaily");
// });

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    if(isNaN(response)) {
        if(authClickCount > 0 && response == "verifiedAccount"){
            const button = document.getElementById('authenticateButton');
            button.disable = true;
        }
    }
});

        
    




    





