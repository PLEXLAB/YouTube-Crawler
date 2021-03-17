var class1 = "Authoritative";
var class2 = "Controversial";
var class3 = "Others";

var videos_g1 = document.querySelectorAll("#items > ytd-video-renderer");
hide(videos_g1) 

var videos_g2 = document.querySelectorAll("#dismissible");
hide(videos_g2);

var ch_sub_sections = document.querySelectorAll("#content-section");
hide(ch_sub_sections);

var playList_sections = document.querySelectorAll("#contents > ytd-playlist-renderer");
hide(ch_sub_sections);

var books = document.querySelectorAll("#contents > ytd-video-renderer");
hide(books);

//Create Three lists
$('<style>															\
		table{width:100%; border-collapse: collapse; border-style: hidden; z-index:1;}	\
		table td, table th { border: 1px solid white;}       		\
		th{font-size:30px; color:white; border: 2px solid white;} 	\
		td{font-size:20px; color:white; border: 2px solid white;}   \
	</style>'+
	'<table class="fixed">' +
		'<col width="33%"/><col width="33%"/><col width="33%"/>' +
		'<tr><th>'+class1+'</th><th>'+class2+'</th><th>'+class3+'</th></tr>'+
		'<tr><td><div class = "'+class1+'"></div></td><td><div class = "'+class2+'"></div></td><td><div class = "'+class3+'"></div></td></tr>'+
	+'</table>').appendTo("#header-container");

//Add one video to each list... needs a loop over the list of collected videos
for(i=0; i<4; i++){
	videos_g2[i].hidden = false;
	var channel_name = videos_g2[0].querySelector("#text > a");
	channel_name	 = channel_name.innerText; 
	console.log(channel_name);
	//if ch name ... check it from the file
}
// based on ch name we assign to div 
$(videos_g2[0]).appendTo("."+class1+"");
$('<hr style="height:2px;border-width:0;color:white;background-color:white">').appendTo("."+class1+"");
$(videos_g2[1]).appendTo("."+class2+"");
$(videos_g2[2]).appendTo("."+class3+"");
$(videos_g2[3]).appendTo("."+class1+"");

// Function
function hide(list){
	for (i = 0; i < list.length; ++i) {
		list[i].hidden = true;
	}
}