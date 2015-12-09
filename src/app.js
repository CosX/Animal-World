
import Playground from './playground.js'
let modal = document.querySelectorAll(".modal-container")[0];
let form = document.getElementById("AnimalForm");

form.addEventListener("submit", (event) => {
	event.preventDefault();
	if(document.getElementById("name").value !== ""){
		modal.style.display = 'none';
		new Playground(document.getElementById("name").value);
	} else{
		alert("Enter name plz!");
	}
});
