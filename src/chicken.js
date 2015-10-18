/* global THREE */
export class Chicken{
	constructor(id, x, z, message, scale, reference, scene){
		this.id = id;
		this.scale = scale;
		this.position = new THREE.Vector3(x, 0, z);
		this.group = new THREE.Group();
		this.scene = scene;
		this.speed = 12;
		this.rotation = 0;
		this.moving = false;
		this.rotating = false;
		this.body = reference.cow.clone();
		this.name = "Dave";
		this.message = message;
		this.options = {
			size: 2,
			height: 10,
			curveSegments: 2,
			font: "helvetiker",
			bevelEnabled: false
		};
		var textShapes = THREE.FontUtils.generateShapes( this.message, this.options );
		var text = new THREE.ShapeGeometry( textShapes );
		this.textMesh = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: "#000000", side: THREE.DoubleSide } ) );
		this.textMesh.position.y = 8;
		this.textMesh.position.x = 0;
		this.group.add( this.textMesh );
		this.loadModel(); 
	}
	
	rotate(deg){
		this.group.children.forEach(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.rotation.y += deg;
			}
		});
	}
	
	setText(val){
		this.group.remove(this.textMesh);
		let y = this.textMesh.position.y;
		let x = this.textMesh.position.x;
		let z = this.textMesh.position.z;
		let rotation = this.textMesh.rotation.y;
		var textShapes = THREE.FontUtils.generateShapes( val, this.options );
		var text = new THREE.ShapeGeometry( textShapes );
		this.message = val;
		this.textMesh = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: "#000000", side: THREE.DoubleSide } ) ) ;
		this.textMesh.position.set(x, y, z);
		this.textMesh.rotation.y = rotation;
		this.group.add( this.textMesh );
	}
	
	setposition(x, z, rot){
		this.group.children.forEach(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.rotation.y = rot;
				mesh.position.x = x;
				mesh.position.z = z;
			}
		});
	}
	
	remove(){
		this.scene.remove(this.group);
	}
	
	loadModel(){
		this.group.add(this.body);
		this.group.scale.set( this.scale, this.scale, this.scale );
		this.setposition(this.position.x, this.position.z, 0);
		this.scene.add(this.group);
	}
}