/* global io */
/* global THREE */
let Chicken = require("./chicken").Chicken;
let World = require("./world").World;
let LoadModels = require("./loadmodels").LoadModels;
export class Playground{
	constructor(){
		let self = this;
		
		this.socket = null;
		
		this.world;
		this.chicken = null;
		this.chickens = [];
		this.clock = new THREE.Clock()
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
		
		this.hemilight;
		this.dirlight;
		
		this.raycaster = new THREE.Raycaster();
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		
		this.camera.position.set(50, 50, 0);
		this.camera.target = new THREE.Vector3( 0, 0, 0 );
		this.camera.lookAt( this.camera.target );
		
		this.setlighting();
		this.setskydome();
		this.setrenderer();
		
		this.textbox = document.querySelectorAll(".chat")[0];
		this.textboxIsActive = false;
		
		this.textbox.addEventListener("focus", function(){
			self.textboxIsActive = true;
		}, true);
		
		this.textbox.addEventListener("blur", function(){
			self.textboxIsActive = false;
		}, true);
		
		window.addEventListener("mouseup", function(event){ self.onMouseUp(event) }, false);
		
		window.addEventListener("resize", function(){ self.onWindowResize() }, false );
		window.addEventListener("keydown", function(event){ self.onKeyDown(event) }, false);
		window.addEventListener("keyup", function(event){  self.onKeyUp(event) }, false);
		this.reference = new LoadModels();
		this.reference.load().then(function(){
			self.socket = io.connect("http://localhost:3000/");
			self.initialize();
		});
		
	}
	
	initialize(){
		let self = this;
		
		this.world = new World(this.reference, 60);
		this.world.loadToScene(this.scene);
		
		this.socket.on("giveid", (id)=>{
			self.chicken = new Chicken(id, 0, 0, "", 4, self.reference, self.scene);
			self.socket.emit("new chicken", { 
				x: self.chicken.body.position.x,
				y: self.chicken.body.position.y,
				z: self.chicken.body.position.z
			});
			self.chicken.body.add(self.camera);
			
			self.draw();
		});
		self.socket.on("allplayers", (data) => {
			data.forEach((chicken) => {
				let c = new Chicken(chicken.id, chicken.x, chicken.z, chicken.message, 4, self.reference, self.scene);
				c.setposition(chicken.x, chicken.z, chicken.roty)
				self.chickens.push(c);
			});
			document.querySelector("#chickencount").textContent = self.chickens.length + 1;
		});
		
		self.socket.on("newplayer", (chicken) => {
			console.log(chicken.id + " is in!")
			self.chickens.push(new Chicken(chicken.id, chicken.x, chicken.z, "", 4, self.reference, self.scene));
			document.querySelector("#chickencount").textContent = self.chickens.length + 1;
		});
		
		self.socket.on("removeplayer", (data) => {
			for(var i = 0; i < self.chickens.length; i++) {
			    if(self.chickens[i].id == data.id) {
					self.chickens[i].remove();
			        self.chickens.splice(i, 1);
			        break;
			    }
			}
			document.querySelector("#chickencount").textContent = self.chickens.length + 1;
		});
		
		self.socket.on("message", (chicken) => {
			let movingchicken = self.chickens.find((chick) => { return chick.id === chicken.id });
			movingchicken.setText(chicken.message);
		});
		
		self.socket.on("move", (chicken) => {
			let movingchicken = self.chickens.find((chick) => { return chick.id === chicken.id });
			movingchicken.setposition(chicken.x, chicken.z, chicken.roty);
			let delta = this.clock.getDelta();
			// movingchicken.group.children.forEach(function(mesh){
			// 	if(mesh instanceof THREE.MorphAnimMesh){
			// 		mesh.updateAnimation( 3000 * delta );
			// 	}
			// });
		});
		
		// setInterval(function(){
		// 	if(self.chicken.moving || self.chicken.rotating){
		// 		self.socket.emit('move chicken', { 
		// 			x: self.chicken.body.position.x,
		// 			y: self.chicken.body.position.y,
		// 			z: self.chicken.body.position.z,
		// 			roty: self.chicken.body.rotation.y
		// 		});
		// 	}
		// }, 60);
		
	}
	
	onMouseUp(event){
		let self = this;
		event.preventDefault();
		var mouse = {
			x: ( event.clientX / window.innerWidth ) * 2 - 1,
			y: - ( event.clientY / window.innerHeight ) * 2 + 1
		}
		this.raycaster.setFromCamera( mouse, this.camera );

		var intersects = this.raycaster.intersectObject( this.world.mesh );
		
		if(intersects.length){
			var point = intersects[ 0 ].point;
			var newpoint = new THREE.Vector3(point.x / self.chicken.scale, point.y / self.chicken.scale, point.z / self.chicken.scale);
			self.chicken.body.position.set(point.x / self.chicken.scale, point.y / self.chicken.scale, point.z / self.chicken.scale);
			
			self.chicken.body.position.set( 0, 0, 0 );
			self.chicken.body.lookAt( intersects[ 0 ].face.normal );

			self.chicken.body.position.copy( newpoint);
		}
		
	}
	
	onKeyDown(event){
		let self = this;
  		let keyCode = event.keyCode;
	  	if(!this.textboxIsActive){
			switch (keyCode) {
				case 68: //d
				  	self.chicken.rotate(-0.2);
			   		self.chicken.rotating = true;
			  		break;
				case 83: //s
			  		self.chicken.moving = true;
				  	self.chicken.speed = -12;
				  	break;
				case 65: //a
				  	self.chicken.rotate(0.2);
				  	self.chicken.rotating = true;
				  	break;
				case 87: //w
				  	self.chicken.moving = true;
				  	self.chicken.speed = 12;
				  	break;
			}
	  	}
	  	if(this.textboxIsActive && keyCode === 13){
		  	self.chicken.setText(self.textbox.value);
		  	self.socket.emit("new message", {
				message: self.chicken.message  
		  	});
	   		self.textbox.value = "";
		   	this.textbox.blur();
	  	}
	}
	onKeyUp(event){
		let self = this;
		let keyCode = event.keyCode;
	  	switch (keyCode) {
		  	case 68: //d
		   		self.chicken.rotating = false;
		  		break;
		    case 83: //s
			  	self.chicken.moving = false;
		      	break;
		  	case 65: //a
			  	self.chicken.rotating = false;
			  	break;
		    case 87: //w
			  	self.chicken.moving = false;
		      	break;
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
	}
}