var baseUrl = "https://dnatesterback.azurewebsites.net/api/v1/";

$(document).ready(function() {  
   loadHumans();
}); 
  
  
function loadHumans(){
$.ajax({
		dataType: 'json',
        contentType: 'application/json',
		crossDomain: true,	
		host: "DnaWebClient",
		userAgent: "DnaWebClient",
		method: 'get',
		url: baseUrl+"human",
		xhrFields: {
		withCredentials: false
		},
		headers: {
		'Access-Control-Allow-Credentials' : true,
		'Access-Control-Allow-Origin':'*',
		'Access-Control-Allow-Methods':'GET',
		'Access-Control-Allow-Headers':'application/json'}
		}).then(function(data) { 
		
		var json = JSON.stringify(data);
		var items = JSON.parse(json);
		console.log("Json"+json);  
		
		deleteList();
		for (var index in items) {   
			createCard(items[index]);
		}
		
		}) .fail(function() {
		console.log( 'Error.' );
		});
}

function createCard (data) { 
 
  var borderCard = document.createElement("div");  
	  borderCard.setAttribute('class', 'col-lg-4 col-md-6 mb-4 d-block');
		  var extCard = document.createElement("div");  
				extCard.setAttribute('class', 'card');
				borderCard.appendChild(extCard);
					var intCard = document.createElement("div");  
						intCard.setAttribute('class', 'card');
						extCard.appendChild(intCard);
							var bodyCard = document.createElement("div");  
								bodyCard.setAttribute('class', 'card-body');
								intCard.appendChild(bodyCard);
										var topCard = document.createElement("div");  
											topCard.setAttribute('class', 'row');
											bodyCard.appendChild(topCard);
												var indicator = document.createElement("div");  
													indicator.setAttribute('class', 'col-3');
													topCard.appendChild(indicator);	
														var imgIndicator = document.createElement("a");  
															imgIndicator.setAttribute('class', data.hasMutation?'btn btn-floating mdb-color red':'btn btn-floating mdb-color green');
															indicator.appendChild(imgIndicator);
												var dataText = document.createElement("div");  
													dataText.setAttribute('class', 'col-7');
													topCard.appendChild(dataText);	
														var nameText = document.createElement("h6");  
															nameText.setAttribute('class', 'card-title font-weight-bold');
															nameText.textContent = data.name;
															dataText.appendChild(nameText);
														var date = document.createElement("p");  
															date.setAttribute('class', 'card-text');
															const rgx = /-/gi;
															date.textContent = 'Creado en: ' + data.createdAt.substring(0, 10).replace(rgx,'/');
															dataText.appendChild(date);
										var bottomCard = document.createElement("div");  
											bottomCard.setAttribute('class', 'col mt-3 text-center');
											bodyCard.appendChild(bottomCard);	
													var mutateMsg = document.createElement("h5");  
														mutateMsg.setAttribute('class', data.hasMutation?'card-title red-text':'card-title green-text');
														mutateMsg.textContent = data.hasMutation?'CON MUTACIÓN':'SIN MUTACIÓN'
														bottomCard.appendChild(mutateMsg);	
 
  var listContainer = document.getElementById("listContainer");
  listContainer.appendChild(borderCard); 
}

function deleteList () { 
  var listContainer = document.getElementById("listContainer"); 
  listContainer.textContent = '';
}

function login () {   
  window.location.pathname = window.location.pathname.replace('index','main');
}

function analyzerHumans () {
showHumans();	
 $.ajax({
		dataType: 'json',
        contentType: 'application/json',
		crossDomain: true,	
		host: "DnaWebClient",
		userAgent: "DnaWebClient",
		method: 'get',
		url:baseUrl+"stats",
		xhrFields: { withCredentials: false	},
		headers: {
		'Access-Control-Allow-Credentials' : true,
		'Access-Control-Allow-Origin':'*',
		'Access-Control-Allow-Methods':'GET',
		'Access-Control-Allow-Headers':'application/json'}
		}).then(function(data) { 
		
		var json = JSON.stringify(data);
		var items = JSON.parse(json);
		console.log("Json"+json);  
		   
			var total = items.count_mutations;
			var ratioNoMutant = items.count_no_mutation_ratio;
				
			var sm = total * ratioNoMutant;
			var cm = total-sm;	
			  
			var txtDetector = document.getElementById("txtDetector"); 
			txtDetector.textContent = 'ADN detector CM:' + cm + ' SM: ' + sm;
		
		}) .fail(function() {
		console.log( 'Error.' );
		});
}
  
function showHumans(){ 
    var listContainer = document.getElementById("listContainer"); 
    var children = listContainer.childNodes;
	children.forEach(function(item){ 
			item.classList.remove("d-none");
			item.classList.add("d-block");
	});
}

function hideHuman(from){ 
    var listContainer = document.getElementById("listContainer"); 
    var children = listContainer.childNodes;
	children.forEach(function(item){ 
		let child = item.querySelectorAll(from?'.red':'.green'); 
		if(child.length>0){
			item.classList.remove("d-block");
			item.classList.add("d-none");
		} else {
			item.classList.remove("d-none");
			item.classList.add("d-block");
		}
	});
}

function trySaveHuman(){
  
	var _nombre = "";//Validar 50 lenght, letras, espacios, numeros y acentos.
	_nombre = document.getElementById('User').value; 

	if(!_nombre || 0 === _nombre.length){
		alert("Debe ingresar nombre.");
		return;
	}
	if(!_nombre.match("^[a-zA-Z0-9 ñÀ-ú]*$")){
		alert("Solo se permite texto alfanumerico y espacios.");
		return;
	}
	if(_nombre.lenght > 50){
		alert("Excedío el numero de caracteres permitido para nombre.");
		return;
	}			
	var dna = createRandomDna();
	var json = { "dna":dna.split(',')};
	var jsonStr = JSON.stringify(json);
	console.log(jsonStr);  
	    
	$.when(
		isMutant(jsonStr)		
	).then(function(data,xhr) {
				var json = JSON.stringify(data);
				console.log(json+xhr); 
			mutant(dna,_nombre);
	}).fail(function(data, textStatus, xhr) {
			if(data.status == 403) { human(dna,_nombre)};
	})
	
	
}

function isMutant(jsonStr) {
	return	$.ajax({
		dataType: 'json',
		crossDomain: true,	
		host: "DnaWebClient",
		userAgent: "DnaWebClient",
		data: jsonStr,
		contentType: 'application/json',
		method: 'post',
        url:baseUrl+"mutation",
		xhrFields: {
		withCredentials: false
		},
		headers: {
		'Access-Control-Allow-Credentials' : true,
		'Access-Control-Allow-Origin':'*',
		'Access-Control-Allow-Methods':'GET',
		'Access-Control-Allow-Headers':'application/json'}
		 })
}

function mutant(dna,_nombre) {
	
		console.log("Mutant"); 

			var user = { id:0,dna:dna,hasMutation:true,createdAt:new Date().toISOString(),name:_nombre};
			var json = JSON.stringify(user);
			console.log(json);

			$.ajax({
				dataType: 'json',
				crossDomain: true,	
				host: "DnaWebClient",
				userAgent: "DnaWebClient",
				data: json,
				contentType: 'application/json',
				method: 'post',
				url:baseUrl+"human",
				xhrFields: {
				withCredentials: false
				},
				headers: {
				'Access-Control-Allow-Credentials' : true,
				'Access-Control-Allow-Origin':'*',
				'Access-Control-Allow-Methods':'GET',
				'Access-Control-Allow-Headers':'application/json'}
				 }).then(function(data) {
				var json = JSON.stringify(data);
				console.log(json); 
				loadHumans();
				}); 
}
 
function human(dna,_nombre) {
	
		console.log("Human"); 

			var user = { id:0,dna:dna,hasMutation:false,createdAt:new Date().toISOString(),name:_nombre};
			var json = JSON.stringify(user);
			console.log(json);

			$.ajax({
				dataType: 'json',
				crossDomain: true,	
				host: "DnaWebClient",
				userAgent: "DnaWebClient",
				data: json,
				contentType: 'application/json',
				method: 'post',
				url: baseUrl+"human",
				xhrFields: {
				withCredentials: false
				},
				headers: {
				'Access-Control-Allow-Credentials' : true,
				'Access-Control-Allow-Origin':'*',
				'Access-Control-Allow-Methods':'GET',
				'Access-Control-Allow-Headers':'application/json'}
				 }).then(function(data) {
				var json = JSON.stringify(data);
				console.log(json); 
				loadHumans();
				}); 
}

function createRandomDna () {    
  var dna = "";
  
  for (var i = 0; i < 6; i++) {
	var base = new RandExp(/[ATCG]{6}/).gen();
	var separator = i<5?",":"";
	dna=dna+base+separator;
  }
  return dna;
}