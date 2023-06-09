function displayOverlay(text) {
    
    if(document.getElementById("overlay") == null)
    {
        var URL_DarkBanner = chrome.extension.getURL('DarkBanner.svg')
        var URL_NMSU_NoU_Crimson = chrome.extension.getURL('NMSU_Crimson.png')
        var overlay = '<div id="overlay" style="position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 10000; vertical-align: middle; text-align: left; background-color: rgba(0, 0, 0, 0.5); color: rgb(43, 43, 43); opacity: 1; cursor: wait;"> <div style="background-color: rgb(22 25 34); display: flex; flex-direction: row; position:fixed; height: 200px; width: 100%; bottom: 0px;"> <div style="flex-basis: content; padding: 10px;"> <img src="'+URL_DarkBanner+'" style="opacity:1;height:100%;"> </div> <div style="flex-grow: 1;flex-basis: auto; color: white; text-align: center; font-size: min(1.5vw, 21.83px); font-family: sans-serif; font-weight: bold; vertical-align: middle; z-index: 3; padding-left: 50px; padding-right: 50px;"> <div> <h3 align="center">Crawling: Videos, <u>Videos-Analytics</u>, Channel-Analytics, Advanced-Channel-Analytics, Advanced-Video-Analytics</h3> <h5 align="center"><br>Please DO NOT close this window<br>This window will be closed automatically once the crawling is finished.</h5> </div> </div> <div style="flex-basis: content; padding: 10px;"> <img src="'+URL_NMSU_NoU_Crimson+'" style="opacity:1;height:100%;"></div> </div> </div>"'
        $(overlay).appendTo("body");
    }        
}

function removeOverlay() {
    $("#overlay").remove();
}
//"background-color": "rgba(128,128,128,0.75)",
//
