/* global castShadow */
/* global THREE */
export class LoadModels{
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
					return self.loadSkeletalModel("./reference/Chicken.json"); 
				})
				.then((mesh) => { 
					self.chicken = mesh;
					return self.loadSkeletalModel("./reference/cow.json"); 
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
			loader.load('./reference/World.json', ( geometry, materials ) => {
				var mesh = new THREE.Mesh(
					geometry,
					new THREE.MeshFaceMaterial(materials)
				);
				mesh.receiveShadow = true;
				fulfill(mesh);
			});
		});
	}
	
	loadSkeletalModel(path){
		return new Promise( (fulfill, reject) => {
			let loader = new THREE.JSONLoader();
			loader.load(path, ( geometry, materials ) => {
				var mesh, material;
				
				mesh = new THREE.SkinnedMesh(
					geometry,
					new THREE.MeshFaceMaterial(materials)
				);
				
				material = mesh.material.materials;
				
				for (var i = 0; i < materials.length; i++) {
					var mat = materials[i];
					mat.skinning = true;
				}
				
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				fulfill(mesh);
			});
		});
	}
}