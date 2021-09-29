var h = new HashTable({});
removeOverlay();

chrome.storage.local.get('video1', function(result) {
	console.log('Value currently is ' + result.video1);

	if(result.video1 === "")
	{
		displayOverlay('<br> <label>Please look at the filtered results and answer the related questions in the surevy, the <i>Next</i> button will appear here shortly: </label>   <a id="next" style="font-size:18px;" target="_Blank" hidden href="https://www.youtube.com/results?search_query=afghanistan">Next</a><br><br>Definitions of the channels categories:<br> <i><ul> <li>- Mainstream News Media: Large mass news media.</li>  <li>- Local News: Servicing local area.</li>  <li>- Government Funded: Government institution or media outlets.</li>  <li>- Politician: Someone who has held office or is running for office.</li>  <li>- Private Non-news Company: Reporting different activities or views of the company.</li>  <li>- Online News Organization: A professional group of multiple news and politics creators such as journalists and commentators, primarily publishing online.</li>  <li>- Individual YouTube Creator: Individual creator who might be a professional or associated with a large media corporation.</li> </ul></i>  <br> <br><br>');
		var removeContent = document.getElementsByClassName("style-scope ytd-page-manager")[0];
		removeContent.hidden = true;
		chrome.storage.local.set({video1: "covid"}, function() {
			console.log('Value is set to ' + "covid");
		});
	}
	if(result.video1 === "afghanistan")
	{
		displayOverlay('<br> <label>Please look at the filtered results and answer the related questions in the surevy, the <i>Next</i> button will appear here shortly: </label> <a id="next" style="font-size:18px;" target="_Blank" hidden href="https://plexweb.cs.nmsu.edu/searchSurvey">Next</a><br><br>Definitions of the channels categories:<br> <i><ul> <li>- Mainstream News Media: Large mass news media.</li>  <li>- Local News: Servicing local area.</li>  <li>- Government Funded: Government institution or media outlets.</li>  <li>- Politician: Someone who has held office or is running for office.</li>  <li>- Private Non-news Company: Reporting different activities or views of the company.</li>  <li>- Online News Organization: A professional group of multiple news and politics creators such as journalists and commentators, primarily publishing online.</li>  <li>- Individual YouTube Creator: Individual creator who might be a professional or associated with a large media corporation.</li> </ul></i>  <br> <br><br>');
		var removeContent = document.getElementsByClassName("style-scope ytd-page-manager")[0];
		removeContent.hidden = true;
		chrome.storage.local.set({video1: ""}, function() {
		  console.log('Value is set to ' + "");
		});
	}
		
});



const url = chrome.runtime.getURL('src/content_scripts/chClass.json');
fetch(url)
	.then((response) => response.json()) //assuming file contains json
	.then((json) => {
		readFile(json);
		

		var class1 = "Mainstream News Media";
		var class2 = "Online News Organization";
		var class3 = "Individual YouTube Creator";
		var class4 = "Politician";
		var class5 = "Private Non-news Company";
		var class6 = "Government Funded";
		var class7 = "Local News";
		
		var class1_div = "Mainstream";
		var class2_div = "Online";
		var class3_div = "Individual";
		var class4_div = "Politician";
		var class5_div = "Private";
		var class6_div = "Government";
		var class7_div = "Local";

		var videos_g1 = document.querySelectorAll("#items > ytd-video-renderer");
		//hide(videos_g1)
		
		var videos_g2 = document.querySelectorAll("#contents > ytd-video-renderer");
		//hide(videos_g2);

		var ch_sub_sections = document.querySelectorAll("#content-section");
		//hide(ch_sub_sections);

		var playList_sections = document.querySelectorAll("#contents > ytd-playlist-renderer");
		//hide(ch_sub_sections);

		var books = document.querySelectorAll("#contents > ytd-video-renderer");
		//hide(books);

		var content = document.querySelector("#contents");
		//content.hidden = true;

		//Create Three lists
		$('<style>															\
			table{ table-layout:fixed; width:90%; border-collapse: collapse; border-style: hidden; z-index:1;}	\
			table th { border: 1px solid black;}       		\
			th{font-size:18px; text-align:center; color:black; border: 2px solid white;} 	\
			td{font-size:12px; padding: 10px 5px 5px 5px ; vertical-align:top; margin:auto; color:black; }   \
			.text-wrapper.ytd-video-renderer {width:90%; max-width: 90%; min-width: 90%;} \
		</style>'+
			
			'<table>' +
			'<col width="7%"/>' +
			'<col width="7%"/>' +
			'<col width="7%"/>' + 
			'<col width="7%"/>' +
			'<col width="7%"/>' + 
			'<col width="7%"/>' + 
			'<col width="7%"/>' +
			'<tr>'+
				'<th>' + class1 + '</th>' + 
				'<th>' + class2 + '</th>' + 
				'<th>' + class3 + '</th>' + 
				'<th>' + class4 + '</th>' +
				'<th>' + class5 + '</th>' +
				'<th>' + class6 + '</th>' + 
				'<th>' + class7 + '</th>' +
			'</tr>' +
			'<tr>'+
				'<td class="c1"></td>' + 
				'<td class="c2"></td>' + 
				'<td class="c3"></td>' + 
				'<td class="c4"></td>' + 
				'<td class="c5"></td>' + 
				'<td class="c6"></td>' + 
				'<td class="c7"></td>' + 
			'</tr>'
			+'</table>').appendTo("#overlay");
		

		var class1_div_tag = document.createElement('div');
		class1_div_tag.setAttribute("class", class1_div);
		class1_div_tag.setAttribute("id"   , class1_div);
		class1_div_tag.setAttribute("style", "margin-top: 25px;");
		
		var class2_div_tag = document.createElement('div');
		class2_div_tag.setAttribute("class", class2_div);
		class2_div_tag.setAttribute("id"   , class2_div);
		class2_div_tag.setAttribute("style", "margin-top: 25px;");
		
		var class3_div_tag = document.createElement('div');
		class3_div_tag.setAttribute("class", class3_div);
		class3_div_tag.setAttribute("id"   , class3_div);
		class3_div_tag.setAttribute("style", "margin-top: 25px;");
		
		var class4_div_tag = document.createElement('div');
		class4_div_tag.setAttribute("class", class4_div);
		class4_div_tag.setAttribute("id"   , class4_div);
		class4_div_tag.setAttribute("style", "margin-top: 25px;");
		
		var class5_div_tag = document.createElement('div');
		class5_div_tag.setAttribute("class", class5_div);
		class5_div_tag.setAttribute("id"   , class5_div);
		class5_div_tag.setAttribute("style", "margin-top: 25px;");
		
		var class6_div_tag = document.createElement('div');
		class6_div_tag.setAttribute("class", class6_div);
		class6_div_tag.setAttribute("id"   , class6_div);
		class6_div_tag.setAttribute("style", "margin-top: 25px;");
		
		var class7_div_tag = document.createElement('div');
		class7_div_tag.setAttribute("class", class7_div);
		class7_div_tag.setAttribute("id"   , class7_div);
		class7_div_tag.setAttribute("style", "margin-top: 25px;");
		
		$(class1_div_tag).appendTo(".c1");
		$(class2_div_tag).appendTo(".c2");
		$(class3_div_tag).appendTo(".c3");
		$(class4_div_tag).appendTo(".c4");
		$(class5_div_tag).appendTo(".c5");
		$(class6_div_tag).appendTo(".c6");
		$(class7_div_tag).appendTo(".c7");
		for (var i = 0; i < videos_g1.length ; i++) {
			//videos_g2[i].hidden = false;
			var channel_name = videos_g1[i].querySelector("#text > a");
			if (channel_name == null)
			continue
			channel_name = channel_name.innerText;
			
			var chCatg = h.getItem(channel_name.toLowerCase());
			console.log(channel_name + "   " + chCatg);
			if (chCatg !== undefined) {
				var tag = document.createElement("v"+i);
				tag.appendChild(videos_g1[i]);
				var element1 = videos_g1[i].getElementsByClassName("text-wrapper style-scope ytd-video-renderer");
				placeVideoinList(tag, chCatg);
				placeVideoinList(element1, chCatg);
			}
		}
		for (var i = 0; i < videos_g2.length ; i++) {
			//videos_g2[i].hidden = false;
			var channel_name = videos_g2[i].querySelector("#text > a");
			if (channel_name == null)
			continue
			channel_name = channel_name.innerText;
			
			var chCatg = h.getItem(channel_name.toLowerCase());
			console.log(channel_name + "   " + chCatg);
			if (chCatg !== undefined) {
				var tag = document.createElement("v"+i);
				tag.appendChild(videos_g2[i]);
				placeVideoinList(tag, chCatg);
				var element1 = videos_g2[i].getElementsByClassName("text-wrapper style-scope ytd-video-renderer");
				placeVideoinList(element1, chCatg);
				
			}
		}
		setTimeout(function () {document.getElementById('next').hidden = false;}, 15000);


		/*
		scrollOnce();
		var videos_g3 = document.querySelectorAll("#items > ytd-video-renderer");
			for (i = 0; i < 10; i++) {
			//videos_g2[i].hidden = false;
			var channel_name = videos_g3[0].querySelector("#text > a");
			channel_name = channel_name.innerText;
			console.log(channel_name);
			var chCatg = h.getItem(channel_name.toLowerCase());
			if (chCatg !== undefined) {
				placeVideoinList(videos_g3[i], chCatg);
			}
			else {
				placeVideoinList(videos_g3[i], class3)
			}
			}
		scrollOnce();
		var videos_g4 = document.querySelectorAll("#items > ytd-video-renderer");
			for (i = 0; i < 10; i++) {
			//videos_g2[i].hidden = false;
			var channel_name = videos_g4[0].querySelector("#text > a");
			channel_name = channel_name.innerText;
			console.log(channel_name);
			var chCatg = h.getItem(channel_name.toLowerCase());
			if (chCatg !== undefined) {
				placeVideoinList(videos_g4[i], chCatg);
			}
			else {
				placeVideoinList(videos_g4[i], class3)
			}
			
			//videos_g2 = document.querySelectorAll("#dismissible");
			//hide(videos_g2);
		}
		*/
		//console.log(h.getItem('cnn'));
		//chrome.runtime.sendMessage("Finish");
	}); // end of fetch
