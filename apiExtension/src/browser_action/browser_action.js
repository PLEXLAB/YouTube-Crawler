document.getElementById("authenticateButton").addEventListener('click', function(){
    chrome.runtime.sendMessage("Authenticate");
    console.log("auth button clicked!");
});

document.getElementById("createReportButton").addEventListener('click', function(){
    var rt = document.getElementById("reportTypes").value;
    chrome.storage.local.set({'reportType': rt}, function(){});
    console.log();
    chrome.runtime.sendMessage("Create");
});
    
document.getElementById("retrieveReportButton").addEventListener('click', function(){
    chrome.runtime.schrome.storage.local.set({'reportType': rt}, function(){});endMessage("Retrieve");
});


        
    




    





