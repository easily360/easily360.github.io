// JavaScript Document
window.onload = Ini;

var keys = [ "C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B" ];
var capos = [ "C", "B", "Bb", "A", "Ab", "G", "F#", "F", "E", "Eb", "D", "C#" ];

var currKey = keys.indexOf(key);
var currCapo = capo;
var currBase = 12;

function Ini(){
	SetHeader();
	SetSong();
	SetFooter();
	SetLyrics();
	SetKey(currKey);
}

function SetHeader(){
	var head = "<table width='768' border='0' align='center'><tr>" +
	  	"<td width='20%' align='left' id='singer'> Singer </td>" +
		"<td width='60%' align='center' id='song'> Song Name </td>" +
		"<td width='20%' align='right' id='key'> Original Key </td>" +
	  "</tr></table><br><table width='768' border='0' align='center' cellpadding='0'>" +
	  "<tr align='center'><td width='4%' align='left'> Key: </td>";
	for(var i = 0; i < keys.length; i++) head += "<td width='8%' class='key' onClick='SetKey(" + i + ")'>" + keys[i] + "</td>";
	head += "</tr><tr align='center'><td width='4%' align='left'> Capo: </td>";
	for(var i = 0; i < capos.length; i++) head += "<td width='8%' class='capo' onClick='SetCapo(" + i + ")'>" + capos[i] + "</td>";
	head += "</tr></table><br>";	
	document.getElementById("header").innerHTML = head;
}

function SetFooter(){
	if(document.body.innerHTML.indexOf("[Tab]") >= 0) 
	document.getElementById("footer").innerHTML = "<p>The TABlature is shown in Hexadecimal based on " + key + " Key, other Keys are for reference only.</p>";
}

function SetSong(){
	document.title = singer + " - " + song;
	var speed = timeSignature.length > 0 ? timeSignature + "&nbsp;&nbsp;" : "";
	var bpm = tempo.length > 0 ? "&#x2669;=" + tempo : "";
	document.getElementById("singer").innerHTML = singer + "<div>" + speed + bpm + "</div>";
	document.getElementById("song").innerHTML = song;
	
	var olds = [/- /g, /\. \{/g, /\]\{/g, /\|\|/g, /\|\_/g, 
				/\(/g, /\]\`\(/g, /\|\{/g, /\]\`\|\{/g, /\_/g, new RegExp("<br>", 'g'), /\&nbsp;\{/g];
	var nows = ["-&nbsp;", ".&nbsp;{", "]&nbsp;{", "`||", "`|_", 
				"`(", "](", "`|{", "]|{", "　", "", "`&nbsp;{"];
	for(var i = 0; i < olds.length; i++){
		document.getElementById("content").innerHTML = document.getElementById("content").innerHTML.replace(olds[i], nows[i]);
	}
	for(var i = 0; i < keys.length; i++){
		var old = new RegExp("{" + keys[i] + "}", 'g')
		var now = "<span class=\"" + keys[i] + "\">" + keys[(currBase + i) % 12] + "</span>";
		document.body.innerHTML = document.body.innerHTML.replace(old, now);
	}
}

function SetLyrics(){	
	var k = document.getElementsByClassName("lyrics");
	for(var i = 0; i < k.length; i++){ 
		var parts = new Array();	// Space, Paragraph, [Chords, Lyric] * n
		parts = k[i].innerHTML.split("[.]");
		var result = "<table align='left' border='0' style='border-color:transparent' cellspacing='1'><tr>" + 
		"<td class='paragraph' width='96'><strong>" + parts[1] + "</strong></td><td>";		
		for(var j = 2; j < parts.length; j++){
			if(parts[j].substring(parts[j].length - 3).indexOf("|") >= 0){
				parts[j] = parts[j].substring(0, parts[j].length - 3) + parts[j].substring(parts[j].length - 3).replace("|", "`|");
			} else parts[j] = parts[j] + "`";
			var content = new Array();
			content = parts[j].split("`");
			var isTab = parts[j].indexOf("[Tab]") >= 0;
			if(j % 2 == 0){ 
				if(j > 2) result += "<br><br>";
				result += "<table border='0' align='left' cellspacing='0' cellpadding='0'>";
			}
			result += "<tr>";
			for(var c = isTab ? 1 : 0; c < content.length; c++){
				result += "<td";
				if(content[c].indexOf("/*") >= 0) result += " class='commented'";
				else if(content[c].indexOf("!") >= 0){
					var index = 0;
					do{
						content[c] = content[c].replace("!", index % 2 == 0 ? "<span class='marked'>" : "</span>");
						index ++;
					}
					while(content[c].indexOf("!") >= 0);
					if(index % 2 == 0) content[c] += "</span>";
				}
				if(isTab){
					var tab = content[c].split(",");
					content[c] = "<table border='0' align='left' cellspacing='0' cellpadding='0' class='tabTable'><tr>";
					if(tab[0].indexOf("|") >= 0){ 
						tab[0] = tab[0].replace("|", "");
						content[c] += "<td class='tab' id='|'></td>";
					}
					if(tab[0].length > 2)
					for(var t = 0; t < tab.length; t++) content[c] += "<td class='tab' id='" + tab[t] + "'></td>";
					content[c] += "</tr></table>";
				}
				result += ">" + content[c] + "</td>";
			}
			result += "</tr>";
			if(j % 2 == 1 || j == parts.length - 1) result += "</table>";
		}		
		result += "</td></tr></table>";
		k[i].innerHTML = result;
	}
}

function SetKey(id){
	currKey = id;
	var k = document.getElementsByClassName("key");
	for(var i = 0; i < k.length; i++){ 
		if(currKey == i) k[i].innerHTML = "<div class='current'> " + keys[i] + "</div>";
		else k[i].innerHTML = keys[i];
	}
	SetCapo(currCapo);
}

function SetCapo(id){
	currCapo = id;
	var c = document.getElementsByClassName("capo");
	for(var i = 0; i < c.length; i++){ 
		capos[i] = keys[(12 - i + currKey)%12];
		if(currCapo == i) c[i].innerHTML = "<div class='current'> " + capos[i] + "</div>";
		else c[i].innerHTML = capos[i];
	}
	SetChords();
	SetTabs();
}

function SetChords(){
	var prevBase = currBase;
	currBase = currKey - keys.indexOf(key) + capo - currCapo + 12;
	for(var i = 0; i < keys.length; i++){
		var old = new RegExp("<span class=\"" + keys[i] + "\">" + keys[(prevBase + i) % 12] + "</span>", 'g')
		var now = "<span class=\"" + keys[i] + "\">" + keys[(currBase + i) % 12] + "</span>";
		document.body.innerHTML = document.body.innerHTML.replace(old, now);
	}
	var cp = currCapo > 0 ? "<div>Capo " + currCapo + " Play " + capos[currCapo]: "</div>";
	var def = key == keys[currKey] ? "" : " (Def. " + key + ")";
	document.getElementById("key").innerHTML = "Key " + keys[currKey] + def + cp;
}

function SetTabs(){
	var t = document.getElementsByClassName("tab");
	var add = currBase - 12;
	for(var i = 0; i < t.length; i++){
		//t[i].style.fontSize = "10px";
		var tmp = new Array();
		tmp = t[i].id.split("}");
		var result = "<table border='0' align='left' cellspacing='0' cellpadding='0'>";
		if(tmp.length < 2){
			if(tmp.length > 0){
				if(tmp[0].indexOf("|") >= 0) for(var c = 0; c < 6; c++) result += "<tr><td class='bar'> | </td></tr>";
				else result += "<tr><td>" + tmp[0] + "</td></tr>";
				result += "</table>";
				t[i].innerHTML = result;
			}
			continue;
		}
		var fingers = tmp[0].substring(tmp[0].indexOf("{") + 1);
		var length = tmp[1];
		var lines = new Array(6);
		var replaced = [-1, -1, -1, -1, -1, -1];
		for(var c = 0; c < 6; c++){ 
			lines[c] = Number(fingers.substring(c*2, c*2+2));
			if(lines[c] >= 0){
				lines[c] += add;
				var jump = c == 1 ? 4 : 5;
				for(var j = 2; j >=0; j--){
					if(lines[c] < -jump * j && c < 5 - j){ 
						replaced[c + j + 1] = lines[c] + (j + 1) * jump;
						break;
					}
				}
			}
			if(replaced[c] > lines[c]) lines[c] = replaced[c];
		}
		for(var c = 0; c < 6; c++){ 
			if(lines[c] < 0) lines[c] = "<s>" + RestLength(length) + "</s>";
			else lines[c] = lines[c].toString(16).toUpperCase() + "<s>" + RestLength(length - 1) + "</s>";
			result += "<tr><td>" + lines[c] + "</td></tr>";
		}
		result += "</table>";
		t[i].innerHTML = result;	
	}
}

function RestLength(l){
	var result = "";
	for(var i = 0; i < l; i++) result += "&nbsp;";
	return result;	
}