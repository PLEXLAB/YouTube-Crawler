/*
	This script .....
	    
*/
/* Connects to the socket server */
var socket = io.connect('http://localhost:3002');

var vID = window.location.toString()

if (vID.includes('&list')){
  vID = vID.split('&list');
  vID = vID[0];
}

vID = vID.split('=');

if (vID[1].includes('&t'))
{
    vID = vID[1].replace('&t', '');
}
else {
  vID = vID[1];
}


socket.on('connect', function() {
  //Send the video Id to get the list of demonteized keywords
  socket.emit('video_id', vID)
});


//===============================================
// Highlight sentiment bar
var x = document.querySelector("#movie_player > div.ytp-chrome-bottom");

$('.ytp-gradient-bottom').css('background-color', 'gray');
$('.ytp-gradient-bottom').css('opacity', '0.5');

//===============================================
// Add demontization image element
var dMonImage 		= document.createElement('img');
var imgURL 			= chrome.extension.getURL("src/inject/images/demonitizationSymbol.jpg");
dMonImage.src 		= imgURL;
var dMonImageDim 	= 25;
dMonImage.width 	= dMonImageDim;
dMonImage.height 	= dMonImageDim;
dMonImage.style.marginLeft = '10px';
dMonImage.style.marginBottom = '-5px';
//===============================================
// Add video keywords element

socket.on('demonetized_keywords', function(data) {

  //Do a check whether there are demonetized keywords

  console.log(data)

  if (data != ""){
    // $('#container > h1').append(dMonImage); -> v1
    // var keywordsTag = document.createElement('div');
    // var headerDiv = document.createElement('div');
    // var header = document.createElement('span');
    // header.innerText = 'DEMONETIZED KEYWORDS';
    // var words = document.createElement('div');
    // data = data.replace(/,/g, ', ')
    // words.innerText = data
    // words.style.cssText = "padding:5px; overflow-wrap:break-word;text-align:center"
    // keywordsTag.style.cssText = "font-size:15px; padding:2em;1px solid #e5e5e5;background:red;color:white;"
    // headerDiv.style.cssText = "text-align:center;"
    // $(headerDiv).append(header)
    // $(keywordsTag).append(headerDiv)
    // $(keywordsTag).append(words)
    // $('#offer-module').append($(keywordsTag));

    //version 2
    var demonIdentifier =  document.createElement('span');
    demonIdentifier.innerText = '(Video Demonetized)';
    demonIdentifier.style.cssText = "font-size:smaller;padding: 0 5px;font-style:italic;font-weight:600;"
    $('#container > h1').append(demonIdentifier);

    
    //Version 2
    // var demonKeywordsDiv = document.createElement('div');
    // demonKeywordsDiv.innerText = 'DEMONETIZED KEYWORDS - ';
    // demonKeywordsDiv.style.cssText = 'background:#c00;color:#fff;font-size:14px;padding:10px;letter-spacing: 0.15px;'
    // var keywords = document.createElement('span');
    // data = data.replace(/,/g, ', ')
    // keywords.innerText = data
    // $(demonKeywordsDiv).append(keywords)
    // $('#container h1').after(demonKeywordsDiv) 

    //Version 3
    var demonKeywordsDiv = document.createElement('div');
    demonKeywordsDiv.innerText = 'DEMONETIZED KEYWORDS - ';
    demonKeywordsDiv.style.cssText = 'font-size:14px;padding:10px;letter-spacing: 0.15px;z-index:24;opacity:0.7;position:relative;background-color:gray;text-align:center;'
    var keywords = document.createElement('span');
    data = data.replace(/,/g, ', ')
    keywords.innerText = data
    $(demonKeywordsDiv).append(keywords)
    $('#movie_player').append(demonKeywordsDiv) 
  }

})


//===============================================
// Add number of views per 1st day/latest 7days/and when was the peak so far.
var viewsTag = document.createElement('a');
viewsTag.innerText 		= ' | 1st Day: 12345 views | Latest 7 Days: 12345 views | Peak on: Mar 30, 2019';
viewsTag.style.fontWeight = "900";
$('#info > #info-text').append($(viewsTag));

//===============================================
// Create and add a Dropdown list for the recommendation algortihms and it header
var RecommSection = document.createElement('div');
var RecommHeader = document.createElement('div');
RecommHeader.innerText = 'Recommendation Algorithm:';
RecommHeader.style.color 	= 'white';
RecommHeader.style.backgroundColor = "red";
RecommHeader.style.fontSize = "large";
$(RecommSection).append($(RecommHeader));

var RecommList = document.createElement('div');
var selectValues = {
  "1": "YouTube",
  "2": "Mainstream",
  "3": "Controversial",
  "4": "Demonetized",
  "5": "Positive",
  "6": "Negative"
};
var $mySelect = $('<select></select>');
$mySelect.width = 400;
$.each(selectValues, function(key, value) {
  var $option = $("<option/>", {
    value: key,
    text: value
  });
  $mySelect.append($option);
});
$(RecommList).append($mySelect);
RecommSection.style.width 	= 400;
$(RecommSection).append($(RecommList));

$('#items > ytd-compact-autoplay-renderer').append($(RecommSection));


//===============================================
// Add fund source
var fundSource = document.createElement('a');
fundSource.innerText = ' -- Self-Funded Commentator';
fundSource.style.fontWeight = "900";
fundSource.style.padding = "0px 0px 0px 10px";
$('#channel-name').append($(fundSource));


