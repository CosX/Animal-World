
import Playground from "./playground.js"
let modal = document.querySelectorAll(".modal-container")[0];
let form = document.getElementById("AnimalForm");

form.addEventListener("submit", (event) => {
	event.preventDefault();
	let animal = document.querySelector("input[name='animal']:checked").value;
	let name = document.getElementById("name").value;
	if(name !== ""){
		modal.style.display = "none";
		new Playground(name, animal);
	} else{
		alert("Enter name plz!");
	}
});
