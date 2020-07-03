$(document).ready(function() {
    $.ajax({
		dataType: 'json',
        contentType: 'application/json',
		crossDomain: true,	
		host: "DnaWebClient",
		userAgent: "DnaWebClient",
		method: 'get',
		url: "http://dnatester-env.eba-kiffzd8h.us-east-1.elasticbeanstalk.com/api/v1/human",
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
}); 
  

function createCard (data) { 
 
  var borderCard = document.createElement("div");  
	  borderCard.setAttribute('class', 'col-lg-4 col-md-6 mb-4');
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
 $.ajax({
		dataType: 'json',
        contentType: 'application/json',
		crossDomain: true,	
		host: "DnaWebClient",
		userAgent: "DnaWebClient",
		method: 'get',
		url: "http://dnatester-env.eba-kiffzd8h.us-east-1.elasticbeanstalk.com/api/v1/stats",
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
 
 
function saveHuman(){
  
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
	
	var user = { id:0,dna:"tgtg,cgsc,gscg,gtgt",hasMutation:false,createdAt:new Date().toISOString(),name:_nombre};
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
        url: "http://dnatester-env.eba-kiffzd8h.us-east-1.elasticbeanstalk.com/api/v1/human",
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
		});//Función para guardar el usuario.
}