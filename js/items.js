var items = []
var narratives = []
var narrativeItems = []
var currentSelection = []
var currentNarrative =""
var currentValue=""
var currentSort = ""


document.addEventListener("DOMContentLoaded", async function(event) {
	console.log(" DO NOT PEEP o((>ω< ))o")
	fetch('https://gist.githubusercontent.com/krzywonos/f71c6986338fc996d0a67527849428eb/raw/7cd037035068d342d47b7382a6248314fc9005df/data.json') //TODO: change to a permanent link once we make the repo public
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

		currentNarrative = narrativeObject[urlHash] || data.meta.startNarrative
		currentValue = data.meta.startValue
		prepareNarratives()
	})
});



function prepareNarratives() {
	currentSelection = items.filter(item => 
		narrativeItems[narratives.indexOf(currentNarrative)].includes(item['@sort'])
	)
	currentSelection.sort( (i,j) =>  
		i['@sort'] < j['@sort'] ? -1 : 1 
	)
	if (currentSelection.length==0) 
		currentSelection = items	

	var index  = currentSelection.findIndex( i => i['@sort'] == currentSort )
	if (index == -1) index = 0
	showInfo(index)
}

function showInfo(index) {
	var item = currentSelection[index]
	currentSort = item['@sort']
	inner("currentNarrative", currentNarrative);
	//var image = byId("imageCardImage");
	//var imgpath = item.image1;
	//image.src = imgpath;
	var imgdiv = byId("img1-div");
	var imgpath = "url('"+item.image1+"')";
	imgdiv.style.backgroundImage = imgpath;
	//imgdiv.style.display = "block";
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
	inner("tableName", "<h3>"+ item.shortName +"</h3>")
	inner("tableTime", item.info.Date)
	inner("tablePlace", item.info.Location)
	inner("tableType", item.info.Type)

	var indices = narrativeItems
		.map((list, index) => list.includes(item['@sort']) ? index : -1)
		.filter(index => index !== -1);

	var links = indices.map(index => 
		`<a style="margin-bottom:10rem;" href="#" onclick="changeNarrative('${narratives[index]}', currentValue)">${narratives[index]}</a>`
	).join(" | ");

	inner("tableLinks", links);
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
			// Reset all buttons to btn-danger
			button.classList.remove('btn-outline-danger');
			button.classList.add('btn-danger');
			
			// Set the button corresponding to the current index to btn-outline-danger
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
