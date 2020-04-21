document.getElementById("authenticateButton").addEventListener('click', function(){
    chrome.runtime.sendMessage("Authenticate");
    console.log("auth button clicked!");
});

document.getElementById("createReportButton").addEventListener('click', function(){
    chrome.runtime.sendMessage("Create");
});
    
document.getElementById("retrieveReportButton").addEventListener('click', function(){
    chrome.runtime.sendMessage("Retrieve");
});
        
    




    





