var h = new HashTable({})

const url = chrome.runtime.getURL('src/content_scripts/chClass.json');
fetch(url)
	.then((response) => response.json()) //assuming file contains json
	.then((json) => {
		readFile(json)

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

		var content = document.querySelector("#contents");
		content.hidden = true;

		//remove the "filtering..." overlay
		$("overlay").remove();

		//Create Three lists
		$('<style>															\
			table{width:100%; border-collapse: collapse; border-style: hidden; z-index:1;}	\
			table td, table th { border: 1px solid white;}       		\
			th{font-size:30px; color:white; border: 2px solid white;} 	\
			td{font-size:20px; color:white; border: 2px solid white;}   \
		</style>'+
			'<table class="fixed">' +
			'<col width="33%"/><col width="33%"/><col width="33%"/>' +
			'<tr><th>' + class1 + '</th><th>' + class2 + '</th><th>' + class3 + '</th></tr>' +
			'<tr><td><div class = "' + class1 + '"></div></td><td><div class = "' + class2 + '"></div></td><td><div class = "' + class3 + '"></div></td></tr>' +
			+'</table>').appendTo("#header-container");

		//Add one video to each list... needs a loop over the list of collected videos
		for (i = 0; i < 4; i++) {
			videos_g2[i].hidden = false;
			var channel_name = videos_g2[0].querySelector("#text > a");
			channel_name = channel_name.innerText;
			console.log(channel_name);
			var chCatg = h.getItem(channel_name);
			if (chCatg !== undefined) {
				placeVideoinList(videos_g2[i], chCatg);
			}
			else {
				placeVideoinList(videos_g2[i], class3)
			}
		}
		console.log(h.getItem('cnn'));
		//chrome.runtime.sendMessage("Finish");
	}); // end of fetch
