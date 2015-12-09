
export default class ChatHandler {
	constructor(){
		let self = this;
		let awayclass = "away";

		this.infobox = document.querySelectorAll(".info")[0];
		this.messagebox = document.querySelectorAll(".message-box")[0];
		this.toggler = document.querySelectorAll(".toggle-away")[0];

		this.toggler.addEventListener("click", () => {
			self.infobox.classList.toggle(awayclass);
		 }, false);
	}

	appendMessage(name, value){
		var div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<span class="name">${name}</span>: <span class="value">${value}</span>`;
   	this.messagebox.appendChild(div);
	 	this.messagebox.scrollTop = this.messagebox.scrollHeight;
	}
}
