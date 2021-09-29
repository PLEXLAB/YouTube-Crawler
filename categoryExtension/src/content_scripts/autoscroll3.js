displayOverlay("<br><br><br>The extension is working on filtering the search results, please wait!<br><br>");
var notChangedStepsCount = 0;
var scrollInterval = setInterval(function() {
    var element = document.querySelector("#message");
    if (element.innerText == 'No more results') { 
        // element found
		chrome.runtime.sendMessage("third");
        clearInterval(scrollInterval);
        element.scrollIntoView();
    } else if((document.documentElement.scrollTop + window.innerHeight) != document.documentElement.scrollHeight) { 
        // no element -> scrolling
        notChangedStepsCount = 0;
        document.documentElement.scrollTop = document.documentElement.scrollHeight;
    } else if (notChangedStepsCount > 100) { 
        // no more space to scroll
		chrome.runtime.sendMessage("third");
        clearInterval(scrollInterval);
    } else {
        // waiting for possible extension (autoload) of the page
        notChangedStepsCount++;
    }
}, 200);