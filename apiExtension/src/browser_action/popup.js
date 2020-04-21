execute.addEventListener("click", function(){
    $("authenticateButton").click(function(){
        chrome.runtime.sendMessage("Authenticate");
    });

    $("createReportButton").click(function(){
        chrome.runtime.sendMessage("Create");
    });
    
    $("retrieveReportButton").click(function(){
        chrome.runtime.sendMessage("Retrieve");
    });
    
});


