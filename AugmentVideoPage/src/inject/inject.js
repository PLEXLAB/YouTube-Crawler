/*
	This script .....
	    
*/
/* Connects to the socket server */
var socket = io.connect('http://localhost:3002');

var vID = window.location.toString()
vID = vID.split('=').pop();

socket.on('connect', function() {
  //Send the video Id to get the list of demonteized keywords
  socket.emit('video_id', vID)
});


//===============================================
// Highlight sentiment bar
var x = document.querySelector("#movie_player > div.ytp-chrome-bottom");

$('.ytp-gradient-bottom').css('background-color', 'gray');
$('.ytp-gradient-bottom').css('opacity', '0.5');
//$('.ytp-gradient-bottom').css('width', 	x.offsetWidth );
//$('.ytp-gradient-bottom').css('left', 	x.offsetLeft  );

//===============================================
// Add demontization image element
var dMonImage 		= document.createElement('img');
var imgURL 			= chrome.extension.getURL("src/inject/images/demonitizationSymbol.jpg");
dMonImage.src 		= imgURL;
var dMonImageDim 	= 25;
dMonImage.width 	= dMonImageDim;
dMonImage.height 	= dMonImageDim;
dMonImage.style.padding = "0px 0px 0px 10px";

$('#container > h1').append($(dMonImage));

//===============================================
// Add video keywords element

socket.on('demonetized_keywords', function(data) {
  console.log(data)
  var keywordsTag = document.createElement('a');
  keywordsTag.innerText = 'Demonetized Keywords: '+data;
  keywordsTag.style.position 	= 'relative';
  keywordsTag.style.right 	= '-50px';
  keywordsTag.style.color 	= 'white';
  keywordsTag.style.backgroundColor = "red";
  $('#container > h1').append($(keywordsTag));
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


