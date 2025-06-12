var items = []
var narratives = []
var narrativeItems = []
var currentSelection = []
var currentNarrative = ""
var currentValue = ""
var currentSort = ""
var currentId = ""


document.addEventListener("DOMContentLoaded", async function(event) {
	console.log(" DO NOT PEEP o((>ω< ))o")
	fetch('https://raw.githubusercontent.com/KodeKronicles/urban_dream/refs/heads/main/data.json')
	.then(response => response.json())
	.then(data => {	
		items = data.items
		var startWith = data.meta.startWith
		var item = items[startWith]
		narratives = data.meta.narratives
		narrativeItems = data.meta.narrativeItems

		narrativeObject = Object.fromEntries(
			narratives.map(narrative => [narrative.split(" ")[0].toLowerCase(), narrative])
		)
		urlHash = window.location.hash.substring(1).toLowerCase();

		currentNarrative = data.meta.startNarrative
		currentValue = data.meta.startValue
		currentId = parseInt(urlHash) || data.meta.startWith + 1
		prepareNarratives()
	})
});



function prepareNarratives() {
	currentSelection = items.filter(item => 
		narrativeItems[narratives.indexOf(currentNarrative)].includes(item['id'])
	)
	currentSelection.sort( (i,j) =>  
		i['id'] < j['id'] ? -1 : 1 
	)
	if (currentSelection.length==0) 
		currentSelection = items	

	var index  = currentSelection.findIndex( i => i['id'] == currentId )
	if (index == -1) index = 0
	showInfo(index)
}

function showInfo(index) {
	var item = currentSelection[index]
	currentSort = item['@sort']
	currentId = item['id']
	inner("currentNarrative", "<a href='#'>" + currentNarrative + "</a>");
	var imgdiv = byId("img1-div");
	var imgpath = "url('"+item.image1+"')";
	imgdiv.style.backgroundImage = imgpath;
	imgdiv.style.height = "100%";
	imgdiv.style.width = "100%";
	imgdiv.style.backgroundRepeat = "no-repeat";
	imgdiv.style.backgroundSize = "cover";
	var copyrightBox = byId("copyrightBox");
	copyrightBox.innerText = item.copyright;
	createInfoTable(item)
	inner("shortInfo","<p>"+item.shortInfo + "</p><p text-align: center;'>" + '<a type="button" class="btn btn-outline-danger btn-sm" onclick="more()" style="--bs-btn-padding-x: .5rem; --bs-btn-color: #d02e02;">Tell me more...</a></p>'); 
	inner("mediumInfo","<p>"+item.mediumInfo + "</p><p text-align: center;'>" + '<a type="button" class="btn btn-outline-danger btn-sm" onclick="less()" style="--bs-btn-padding-x: .5rem; --bs-btn-color: #d02e02;">Tell me less</a> or <a type="button" class="btn btn-outline-danger btn-sm" onclick="muchMore()" style="--bs-btn-padding-x: .5rem; --bs-btn-color: #d02e02;">Tell me even more...</a></p>');
	byId("longInfo").dataset['uri'] = item.longInfo
	currentValue = item.shortName
	prepareNavigationButtons(index)
}

function more() {
	hide("shortInfo") ;
	show("mediumInfo") ;
	hide("longInfo") ;
}

function less() {
	hide("mediumInfo") ;
	show("shortInfo") ;
	hide("longInfo") ;
}

function muchMore() {
	var uri = byId("longInfo").dataset['uri'];
	fetch(uri) //only works on a published page
	.then(response => response.text())
	.then(data => {	
		inner("longInfoContent",data) ;
		hide("itemContainer") ;
		show("longInfo") ;
		window.scrollTo(0,0)
	})
}

function hideLongInfo() {
	hide("mediumInfo") ;
	show("shortInfo") ;
	hide("longInfo") ;
	show("itemContainer") ;
}

function createInfoTable(item) {
	inner("tableName", "<h3>" + item.shortName + "</h3>");

	const fields = [
		{ id: "tableDate", key: "Date" },
		{ id: "tableLocation", key: "Location" },
		{ id: "tableStatus", key: "Status" },
		{ id: "tableSpace", key: "Space" },
		{ id: "tableTime", key: "Time" },
		{ id: "tableContext", key: "Context" },
		{ id: "tableIdeals", key: "Ideals" },
		{ id: "tableReality", key: "Reality" },
	];

	fields.forEach(({ id, key }) => {
		const value = item.info[key];
		const html = `<a href="#" onclick="changeNarrative('${value}', currentValue)">${value}</a>`;
		inner(id, html);
	});

	document.getElementById("currentNarrative").onclick = function () {
	changeNarrative("Exhibition", currentValue);
	};
}

function prepareNavigationButtons(index) {
	if (index > 0) {
		byId("buttonPrevious").disabled = false
		byId("buttonPrevious").onclick = () => showInfo(index-1)		
	} else {
		byId("buttonPrevious").disabled = true
		byId("buttonPrevious").onclick = null
	}
	if (index < currentSelection.length-1) {
		byId("buttonNext").disabled = false
		byId("buttonNext").onclick = () => showInfo(index+1)
	} else {
		byId("buttonNext").disabled = true
		byId("buttonNext").onclick = null
	}
	const buttons = document.querySelectorAll('[role="group-2"] button');
	buttons.forEach((button, i) => {
		if (i < currentSelection.length) {
			button.style.display = "inline-block";
			button.classList.remove('btn-outline-danger');
			button.classList.add('btn-danger');
			
			if (i === index) {
				button.classList.remove('btn-danger');
				button.classList.add('btn-outline-danger');
			}
			
			button.onclick = () => showInfo(i);
		} else {
			button.style.display = "none";
		}
	});
}

function changeNarrative(narrative,value) {
		currentNarrative = narrative
		currentValue = value
		prepareNarratives()
}

function byId(id) {
	return document.getElementById(id)
}

function show(id) {
	document.getElementById(id).classList.remove('d-none')
}

function hide(id) {
	document.getElementById(id).classList.add('d-none')
}

function inner(id,content, emptyFirst=true) {
	if(emptyFirst) document.getElementById(id).innerHTML = "" ; 
	document.getElementById(id).innerHTML += content ; 
}