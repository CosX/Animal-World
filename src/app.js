let Play = require("./playground.js");

let modal = document.querySelectorAll(".modal-container")[0];"modal-container"
let form = document.getElementById("AnimalForm");
form.addEventListener("submit", function (event) {
	event.preventDefault();
	if(document.getElementById("name").value !== ""){
		modal.style.display = 'none';
		new Play.Playground(document.getElementById("name").value); 
	} else{
		alert("Enter name plz!");
	}
});