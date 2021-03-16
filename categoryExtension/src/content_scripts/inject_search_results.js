document.querySelector("#video-title > yt-formatted-string").style.color = "blue";
var videos = document.querySelectorAll("#items > ytd-video-renderer");
console.log(videos);
for (i = 0; i < videos.length; ++i) {
    videos[i].hidden = true;
}  

var title = document.querySelector("#title");
$("<table><tr><th>"+ videos[1] + "</th><th>Contact</th><th>Country</th></tr></table>").appendTo(title);



