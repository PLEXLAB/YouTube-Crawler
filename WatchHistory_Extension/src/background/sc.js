document.getElementById("myButton").addEventListener("click", myFunction);
function myFunction(){
	var text = document.getElementById("texttocopy").innerText;
	var elem = document.createElement("textarea");
	document.body.appendChild(elem);
	elem.value = text;
	elem.select();
	document.execCommand("copy");
	document.body.removeChild(elem);
}

