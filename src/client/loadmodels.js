import * as THREE from "three";

export default class LoadModels{
	constructor(){
		this.chicken = null;
		this.cow = null;
		this.world = null;
	}
	load(){
		let self = this;
		return new Promise((fulfill, reject) => {
			self.loadWorld(self)
				.then((mesh) => {
					this.world = mesh;
					return self.loadSkeletalModel("./src/client/reference/chicken1.json");
				})
				.then((mesh) => {
					self.chicken = mesh;
					return self.loadSkeletalModel("./src/client/reference/cow.json");
				})
				.then((mesh) => {
					self.cow = mesh;
					fulfill();
				});
		});
	}

	loadWorld(ctx){
		return new Promise((fulfill, reject) =>{
			let loader = new THREE.JSONLoader();
			loader.load('./src/client/reference/world.json', ( geometry, materials ) => {
				var mesh = new THREE.Mesh(
					geometry,
					new THREE.MeshFaceMaterial(materials)
				);
				mesh.receiveShadow = true;
				mesh.castShadow = true;
				fulfill(mesh);
			});
		});
	}

	loadSkeletalModel(path){
		return new Promise( (fulfill, reject) => {
			let loader = new THREE.JSONLoader();
			loader.load(path, ( geometry, materials ) => {
				for ( var i = 0; i < materials.length; i ++ ) {
					var m = materials[ i ];
					m.skinning = true;
				}

				var mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial( materials ) );
				mesh.geometry.dynamic = true;
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				fulfill(mesh);
			});
		});
	}
}
