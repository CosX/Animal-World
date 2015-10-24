/* global io */
/* global THREE */
let Cow = require("./cow").Cow;
let World = require("./world").World;
let LoadModels = require("./loadmodels").LoadModels;
let ChatHandler = require("./chatHandler").ChatHandler;

export class Playground{
	constructor(name){
		let self = this;
		
		this.socket = null;
		this.isdragging = false;
		this.world;
		this.animal = null;
		this.animals = [];
		this.clock = new THREE.Clock()
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
		
		this.hemilight;
		this.dirlight;
		
		this.raycaster = new THREE.Raycaster();
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		
		this.camera.position.set(75, 0, -40);
		this.camera.target = new THREE.Vector3( 0, 0, 0 );
		this.camera.up.set(1, 0, -1);
		this.camera.lookAt( this.camera.target );
		
		this.setlighting();
		this.setskydome();
		this.setrenderer();
		
		this.controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
		this.controls.target.copy( this.camera.target );
		this.controls.noPan = true;
		this.controls.rotateSpeed = 8.0;
		this.controls.minDistance = 20;
		this.controls.maxDistance = 400;
		
		this.textbox = document.querySelectorAll(".chat")[0];
		this.textboxIsActive = false;
		this.chat = new ChatHandler();
		
		this.clientClickX = 0;
    	this.clientClickY = 0;
		
		this.textbox.addEventListener("focus", function(){
			self.textboxIsActive = true;
		}, true);
		
		this.textbox.addEventListener("blur", function(){
			self.textboxIsActive = false;
		}, true);
		
		this.renderer.domElement.addEventListener("mouseup", function(event){ self.onMouseUp(event) }, false);
		this.renderer.domElement.addEventListener("mousedown", function(event){ self.onMouseDown(event) }, false);
		window.addEventListener("resize", function(){ self.onWindowResize() }, false );
		window.addEventListener("keydown", function(event){ self.onKeyDown(event) }, false);
		
		this.reference = new LoadModels();
		this.reference.load().then(function(){
			self.socket = io.connect("http://localhost:3000/");
			self.initialize(name);
		});
		
	}
	
	initialize(name){
		let self = this;
		
		this.world = new World(this.reference, 500);
		this.world.loadToScene(this.scene);
		
		this.socket.on("giveid", (id)=>{
			self.animal = new Cow(id, new THREE.Vector3(37.049533439151695, 504.9169002010969, 152.38907703563717), name, 4, self.reference, self.scene);
			self.draw();
			self.animal.updateMovement(self.world.mesh);
			console.log(self.animal.body.position);
			self.socket.emit("new animal", { 
				x: self.animal.body.position.x,
				y: self.animal.body.position.y,
				z: self.animal.body.position.z,
				name: self.animal.name
			});
			self.animal.body.add(self.camera);
		});
		self.socket.on("allplayers", (data) => {
			data.forEach((animal) => {
				let c = new Cow(animal.id, new THREE.Vector3(animal.x, animal.y, animal.z), animal.name, 4, self.reference, self.scene);
				c.updateMovement(self.world.mesh);
				self.animals.push(c);
			});
			document.querySelector("#animalcount").textContent = self.animals.length + 1;
		});
		
		self.socket.on("newplayer", (animal) => {
			let ani = new Cow(animal.id, new THREE.Vector3(animal.x, animal.y, animal.z), animal.name, 4, self.reference, self.scene);
			ani.updateMovement(self.world.mesh);
			self.animals.push(ani);
			document.querySelector("#animalcount").textContent = self.animals.length + 1;
			
		});
		
		self.socket.on("removeplayer", (data) => {
			for(var i = 0; i < self.animals.length; i++) {
			    if(self.animals[i].id == data.id) {
					self.animals[i].remove();
			        self.animals.splice(i, 1);
			        break;
			    }
			}
			document.querySelector("#animalcount").textContent = self.animals.length + 1;
		});
		
		self.socket.on("message", (animal) => {
			self.chat.appendMessage(animal.name, animal.message);
		});
		
		self.socket.on("move", (animal) => {
			let movinganimal = self.animals.find((a) => { return a.id === animal.id });
			let newpoint = new THREE.Vector3(animal.x, animal.y, animal.z);
			movinganimal.moveTowardsTarget(newpoint);
		});
		
	}
	onMouseDown(event){
		this.clientClickX = event.clientX;
    	this.clientClickY = event.clientY;
	}
	
	onMouseUp(event){
		let self = this;
		if (event.target !== self.renderer.domElement) { return; }
	 	let x = event.clientX;
        let y = event.clientY;
        if( x != self.clientClickX || y != self.clientClickY ){return; }
		
		event.preventDefault();
		var mouse = {	
			x: ( x / window.innerWidth ) * 2 - 1,
			y: - ( y / window.innerHeight ) * 2 + 1
		}
		this.raycaster.setFromCamera( mouse, this.camera );

		var intersects = this.raycaster.intersectObject( this.world.mesh );
		
		if(intersects.length){
			var point = intersects[ 0 ].point;
			var newpoint = new THREE.Vector3(point.x / self.animal.scale, point.y / self.animal.scale, point.z / self.animal.scale);
			self.animal.moveTowardsTarget(newpoint);
			
			self.socket.emit("move animal", { 
				x: newpoint.x,
				y: newpoint.y,
				z: newpoint.z
			});
		}
		
	}
	
	onKeyDown(event){
		let self = this;
  		let keyCode = event.keyCode;
	  	if(this.textboxIsActive && keyCode === 13 && self.textbox.value !== ""){
		  	self.socket.emit("new message", {
				message: self.textbox.value  
		  	});
		  	self.chat.appendMessage(self.animal.name, self.textbox.value);
	   		self.textbox.value = "";
	  	}
	}
	
	onWindowResize(){
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}
	
	setskydome(){
		this.scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
		this.scene.fog.color.setHSL( 0.6, 0, 1 );
		
		var vertexShader = document.getElementById( 'vertexShader' ).textContent;
		var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
		var uniforms = {
			topColor: 	 { type: "c", value: new THREE.Color( 0x264348 ) },
			bottomColor: { type: "c", value: new THREE.Color( 0x044F67 ) },
			offset:		 { type: "f", value: 33 },
			exponent:	 { type: "f", value: 0.6 }
		};
		//uniforms.topColor.value.copy( this.hemilight.color );

		this.scene.fog.color.copy( uniforms.bottomColor.value );

		var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
		var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

		var sky = new THREE.Mesh( skyGeo, skyMat );
		this.scene.add( sky );
	}
	
	setlighting(){
		this.hemilight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
		this.hemilight.color.setHSL( 0.6, 1, 0.6 );
		this.hemilight.groundColor.setHSL( 0.095, 1, 0.75 );
		this.hemilight.position.set( 0, 500, 0 );
		this.scene.add( this.hemilight );

		this.dirlight = new THREE.DirectionalLight( 0xffffff, 1 );
		this.dirlight.color.setHSL( 0.1, 1, 0.95 );
		this.dirlight.position.set( -1, 1.75, 1 );
		this.dirlight.position.multiplyScalar( 50 );
		this.scene.add( this.dirlight );

		this.dirlight.castShadow = true;

		this.dirlight.shadowMapWidth = 2048;
		this.dirlight.shadowMapHeight = 2048;

		var d = 50;

		this.dirlight.shadowCameraLeft = -d;
		this.dirlight.shadowCameraRight = d;
		this.dirlight.shadowCameraTop = d;
		this.dirlight.shadowCameraBottom = -d;

		this.dirlight.shadowCameraFar = 3500;
		this.dirlight.shadowBias = -0.0001;
	}
	
	setrenderer(){
		this.renderer.setClearColor( "#CCCCCC" );
		this.renderer.sortObjects = false;
		this.renderer.autoClear = false;
		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.shadowMapEnabled = true;
		this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
		let container = document.createElement( 'div' );
		document.body.appendChild(container);
		container.appendChild( this.renderer.domElement );
	}
	
	draw(){
		let self = this;
		window.requestAnimationFrame(function(){self.draw();});
		this.renderer.clear();
		this.renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
		this.renderer.render(this.scene, this.camera);
		this.controls.update();
		
		self.handleMovement(self.animal);
		
		self.animals.forEach((animal) => {
			self.handleMovement(animal);
		});
	}
	
	handleMovement(animal){
		if(animal.moving){
			animal.updateMovement(this.world.mesh, this.scene);
		}
		animal.textMesh.lookAt(this.camera.position);
		animal.textMesh.up.copy(this.camera.up);
	}
}