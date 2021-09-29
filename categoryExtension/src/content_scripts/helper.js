//create object of type hash table
function HashTable(obj)
{
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    }
   
    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function()
    {
        this.items = {}
        this.length = 0;
    }
}
// End of Hashtable

//=====================
function hide(list){
	for (i = 0; i < list.length; ++i) {
		list[i].hidden = true;
	}
}

//==============
function readFile(json)
{
	for(var i = 0; i < json.length; i++) {
		var obj = json[i];
		h.setItem(obj.ChName, obj.ChType);
	}
}
//=====================
function placeVideoinList(videoElement, vClass)
{
	$(videoElement).appendTo("."+vClass+"");
	//$('<hr style="height:2px;border-width:0;color:black;background-color:black">').appendTo("."+vClass+"");

}
//======================
function displayOverlay(text) {
	$("<div id='overlay'><h1>"+text+"</h1></div>").css({
		"position": "fixed",
		"width": "100%",
		"height": "100%",
		"align": "center",
		"overflow":"scroll",
		"overflow-x":"hidden",
		"z-index": 10000,
		"vertical-align": "middle",
		"text-align": "left",
		"background-color": "rgba(248, 247, 216, 0.8)",
		"color": "black"
	}).appendTo("#page-manager");
}

function removeOverlay() {
    $("#overlay").remove();
}

function showSurvey() {
  document.getElementById("survey").style.visibility = "visible";
}
setTimeout("showSurvey()", 30000); // after 5 secs