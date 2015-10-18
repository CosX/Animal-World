export class World{
	constructor(reference, scale){
		this.scale = scale;
		this.mesh = reference.world.clone();
	}
	
	loadToScene(scene){
		this.mesh.scale.set( this.scale, this.scale, this.scale );
		scene.add(this.mesh);  
	}
}