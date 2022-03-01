/*
  This script .....
      
*/
/* Connects to the socket server */
var socket = io.connect('http://www.demonetize.plexlab.net:3002');
var btn = $("#menu-container > #menu > ytd-menu-renderer > yt-icon-button > #button");


//Send the video Id to get the list of demonteized keywords

function processVID(vID) {

  if (vID.includes('&list')) {
    vID = vID.split('&list');
    vID = vID[0];
  }

  vID = vID.split('=');

  if (vID[1].includes('&t')) {
    vID = vID[1].replace('&t', '');
  }
  else {
    vID = vID[1];
  }
  return vID;
}

vID = processVID(window.location.toString())

socket.on('connect', function () {
  socket.emit('video_id', vID)
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // listen for messages sent from background.js
    if (request.message === 'hello!') {
      vID = processVID(request.url);
      console.log("VID:" + vID)
      socket.emit('video_id', vID);
    }
  });



//===============================================
// Highlight sentiment bar
// var x = document.querySelector("#movie_player > div.ytp-chrome-bottom");

// $('.ytp-gradient-bottom').css('background-color', 'gray');
// $('.ytp-gradient-bottom').css('opacity', '0.5');

//===============================================
// Add demontization image element
var dMonImage = document.createElement('img');
var imgURL = chrome.extension.getURL("src/inject/images/demonitizationSymbol.jpg");
dMonImage.src = imgURL;
var dMonImageDim = 25;
dMonImage.width = dMonImageDim;
dMonImage.height = dMonImageDim;
dMonImage.style.marginLeft = '10px';
dMonImage.style.marginBottom = '-5px';
//===============================================
// Add video keywords element

function demonetizedWords(isAvailable, data) {

  var demonKeywordsDiv = document.createElement('div');
  demonKeywordsDiv.setAttribute("id", "demonClass");
  var demonIdentifier = document.createElement('div');
  demonIdentifier.style = 'font-size:18px;padding:10px;border-bottom:1px solid darkgray;color: #c00;font-weight:600;'
  demonKeywordsDiv.style = 'background-color:gray;z-index:24;opacity:0.7;position:relative;text-align:center';
  if (isAvailable) {
    demonIdentifier.innerText = 'VIDEO DEMONETIZED';
    var demonKeywords = document.createElement('div');
    demonKeywords.innerText = 'DEMONETIZED KEYWORDS FOUND IN TRANSCRIPT - ';
    demonKeywords.style.cssText = 'font-size:16px;padding:10px;letter-spacing: 0.15px;padding:10px;color:white'
    var keywords = document.createElement('span');
    data = data.replace(/,/g, ', ')
    keywords.innerText = data
    $(demonKeywords).append(keywords)
  }
  else {
    demonIdentifier.innerText = 'VIDEO NOT DEMONETIZED';
    var demonKeywords = document.createElement('div');
    demonKeywords.innerText = 'NO KEYWORDS FOUND IN TRANSCRIPT ';
    demonKeywords.style.cssText = 'font-size:16px;padding:10px;letter-spacing: 0.15px;padding:10px;color:white;text-align:center;'   
  }
  $(demonKeywordsDiv).append(demonIdentifier)
  $(demonKeywordsDiv).append(demonKeywords)
  $('#movie_player').append(demonKeywordsDiv)
}

socket.on('demonetized_keywords', function (data) {

  //Do a check whether there are demonetized keywords

  var check = document.getElementById("demonClass")
  console.log("Elemnent:"+check)
  if (check != null) {
    check.remove()
  }

  if (data != "") {
    //Version 3

    //Get the device theme
    // var html = document.getElementsByTagName("html")[0];
    // var css = 'color:black;';

    // if ( !html.hasAttribute("dark")){
    //   console.log("came")
    //   css = 'color:white;';
    // }

    console.log("data: " + data);
    var words = data.split("__");
    var data = words[0];
    var dataArr = words[1].replace("\n", "").split(","); 

    // Popup words
    demonetizedWords(true, data);
    
    //Make the youtube title customized
    var title = $("h1 .ytd-video-primary-info-renderer");
    var titletext = title[0].innerText
    var titleArr = titletext.split(" ")
    // Set it to empty initially
    title[0].innerText = "";

    //Create a set
    dataSet = new Set(dataArr);


    output = ""

    for (var i = 0; i< titleArr.length; i++){
      // Check the word in the set
      let originalWord = titleArr[i]
      let refactoredWord = originalWord.replace(/[^a-zA-Z ]/g, "");
      let lowerCaseWord = refactoredWord.toLowerCase();
      
      let spanElement = document.createElement("span");
      spanElement.innerText = originalWord + " "
      title.append(spanElement)

      if (dataSet.has(lowerCaseWord)){
        // Highlight the word in red
        spanElement.style.cssText = 'background-color:rgb(204, 0, 0);color:white';
        spanElement.className = 'demonetized_words';
        spanElement.innerText += " ";
      }
    }
  }
  else {
    demonetizedWords(false, data);
  }
})


//===============================================
// Add number of views per 1st day/latest 7days/and when was the peak so far.
// var viewsTag = document.createElement('a');
// viewsTag.innerText 		= ' | 1st Day: 12345 views | Latest 7 Days: 12345 views | Peak on: Mar 30, 2019';
// viewsTag.style.fontWeight = "900";
// $('#info > #info-text').append($(viewsTag));

//===============================================
// Create and add a Dropdown list for the recommendation algortihms and it header
var RecommSection = document.createElement('div');
var RecommHeader = document.createElement('div');
RecommHeader.innerText = 'Recommendation Algorithm:';
RecommHeader.style.color = 'white';
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
$.each(selectValues, function (key, value) {
  var $option = $("<option/>", {
    value: key,
    text: value
  });
  $mySelect.append($option);
});
$(RecommList).append($mySelect);
RecommSection.style.width = 400;
$(RecommSection).append($(RecommList));

$('#items > ytd-compact-autoplay-renderer').append($(RecommSection));


//===============================================
// Add fund source
var fundSource = document.createElement('a');
fundSource.innerText = ' -- Self-Funded Commentator';
fundSource.style.fontWeight = "900";
fundSource.style.padding = "0px 0px 0px 10px";
$('#channel-name').append($(fundSource));

function updateTranscripts(){
  let transcriptsDiv = $("#content > ytd-transcript-renderer > #body > ytd-transcript-body-renderer")
  for (var i =0 ; i< (transcriptsDiv[0].children.length - 1); i++) {
    j = i+1
    let cmd = $("#content > ytd-transcript-renderer > #body > ytd-transcript-body-renderer > div:nth-child" + "(" +j+ ") > div:nth-child(2) > div");
    // get the current text and store in array
    let currentTranscript = cmd[0].innerText;

    //get the offset value
    // Set it to empty initially
    cmd[0].innerText = "";
    currentText = currentTranscript.split(" ");
    let attr = cmd[0].attributes;
    var className = attr[0].value;
    var tabIndex = attr[2].value;
    var offset = attr[3].value;

    let text = "";           
    for (let val of currentText){
      
      let originalWord = val
      let refactoredWord = originalWord.replace(/[^a-zA-Z ]/g, "");
      let lowerCaseWord = refactoredWord.toLowerCase(); 

      if (dataSet.has(lowerCaseWord)){
        text += '<div class = "demonetized_words cue style-scope ytd-transcript-body-renderer" role ="button" tabindex='+tabIndex +' start-offset='+offset +'>' + originalWord + " " + '</div>' + " ";
      }
      else {
        text += originalWord + " ";
      }
    }  
    console.log(text)
    cmd[0].innerHTML = text;      
}
}

//Open Transcript Event
$(document).on ('click', '#contentWrapper > ytd-menu-popup-renderer > tp-yt-paper-listbox > ytd-menu-service-item-renderer:nth-child(2)', function(event) {
  if (event) {
  // Get the transcripts children
  // Set a timeout here
  setTimeout( updateTranscripts , 1000);
  }
})
