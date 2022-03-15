/*
  This script .....
      
*/
/* Connects to the socket server */
//var socket = io.connect('https://www.demonetize.plexlab.net');
// var socket = io.connect('http://localhost:3002')
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


function requestData() {
  fetch('https://www.demonetize.plexlab.net/videoData/'+vID).then(response => response.text())
  .then(text => handleData(text)); 
}

window.onload=function()
{
  vID = processVID(window.location.toString());
  requestData(vID)
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // listen for messages sent from background.js
    if (request.message === 'hello!') {
      vID = processVID(request.url);
      requestData(vID)
    }
  });



function demonetizedWords(isAvailable, data) {

  var found = document.getElementById("demonClass");
  if (! found) {
  var demonKeywordsDiv = document.createElement('div');
  demonKeywordsDiv.setAttribute("id", "demonClass");
  var demonIdentifier = document.createElement('div');
  demonKeywordsDiv.style = 'background-color:gray;z-index:24;opacity:0.7;position:relative;text-align:center';
  if(isAvailable) {
    demonIdentifier.innerText = 'VIDEO DEMONETIZED';
    var demonKeywords = document.createElement('div');
    demonKeywords.innerText = 'DEMONETIZED KEYWORDS FOUND IN TRANSCRIPT - ';
    demonKeywords.style.cssText = 'font-size:16px;padding:10px;letter-spacing: 0.15px;padding:10px;color:white'
    demonIdentifier.style.cssText = 'font-size:18px;padding:10px;border-bottom:1px solid darkgray;color: #c00;font-weight:600;'
    var keywords = document.createElement('span');
    data = data.replace(/,/g, ', ')
    keywords.innerText = data
    $(demonKeywords).append(keywords)
  }
  else {
    // demonIdentifier.innerText = 'VIDEO NOT DEMONETIZED';
    var demonKeywords = document.createElement('div');
    demonKeywords.innerText = data.trim();
    demonKeywords.style.cssText = 'font-size:16px;padding:10px;letter-spacing: 0.15px;padding:10px;color:white;text-align:center;'   
  }

  $(demonKeywordsDiv).append(demonIdentifier)
  $(demonKeywordsDiv).append(demonKeywords)
  $('#movie_player').append(demonKeywordsDiv)
}
}

function handleData(data) {
  var dataArr = [];
  var isFound = false;

  //Do a check whether there are demonetized keywords
  if (data != "") {
    //Version 3
    console.log("data: " + data);
    var words = data.split("__");
    var data = words[0];
    if (words[1].trim() != "") {
      dataArr = words[1].replace("\n", "").split(","); 
      isFound = true;
    // Popup words
    demonetizedWords(isFound, data);
    
    // Wait for the page to load for 1000s
    setTimeout(() => {
    //Make the youtube title customised - For desktop view
    var title = $("h1 .ytd-video-primary-info-renderer");

    if (title[0] == null || title[0] == undefined) {
      title = $(".slim-video-information-title-and-badges .slim-video-information-title")
    }

    console.log(title)

    var titletext = title[0].innerText
    var titleArr = titletext.split(" ")
    // Set it to empty initially
    title[0].innerText = "";

    //Create a set
    dataSet = new Set(dataArr);


    let output = ""

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
        output += '<span class = "demonetized_words">' + originalWord + " " + '</span>';
      }
      else {
        output += originalWord + " ";
      }
    }
    title[0].innerHTML = output;    
  
    }, 1000);
  }
  else {
    demonetizedWords(isFound, data);
  }
}
};


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
  setTimeout( updateTranscripts , 500);
  }
})

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   //here we get the new 
//   console.log("URL CHANGED: " + request.data.url);
//   clientConnect(window.location.toString())
// });