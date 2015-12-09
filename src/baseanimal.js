export default class BaseAnimal{
  constructor(id, startposition, name, scale, reference, scene){
		this.id = id;
		this.scale = scale;
		this.position = startposition;
		this.target = new THREE.Vector3(0, 0, 0);
		this.group = new THREE.Group();
		this.scene = scene;
		this.speed = 12;
		this.rotation = 0;
		this.moving = false;
		this.rotating = false;
		this.body = reference.clone();
		this.bones = this.getBones();
		this.name = name;
		this.options = {
			size: 1.4,
			height: 10,
			curveSegments: 2,
			font: "helvetiker",
			bevelEnabled: false
		};
		var textShapes = THREE.FontUtils.generateShapes( this.name, this.options );
		var text = new THREE.ShapeGeometry( textShapes );
		this.textMesh = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: "#000000", side: THREE.DoubleSide } ) );
		this.textMesh.position.z = -5;
		this.textMesh.position.y = 3;
		this.body.add( this.textMesh );
		this.loadModel();
	}

	getBones(){
		throw new Error("Must be implemented by an animal.")
	}

	moveTowardsTarget(vec){
		this.target = vec;
		this.moving = true;
	}

	updateMovement(mesh){
		this.body.lookAt( this.target );
		this.body.translateZ(0.5);
		let pos = new THREE.Vector3(this.body.position.x * 1.05 * this.scale, this.body.position.y * 1.05 * this.scale, this.body.position.z * 1.05 * this.scale);
		let center = new THREE.Vector3( 0, 0, 0).sub(pos).normalize();
		let raycaster = new THREE.Raycaster(pos, center);
		let intersects = raycaster.intersectObject( mesh );

		if(intersects.length){
			let point = intersects[0].point;
			let newpoint = new THREE.Vector3(point.x / this.scale, point.y / this.scale, point.z / this.scale);
			this.body.position.copy(newpoint);
			let groundpoint = intersects[0].face.normal;
			let v1 = this.target.clone().sub(this.body.position).normalize();
			let v2 = groundpoint.clone().sub(this.body.position).normalize();
			let v3 = new THREE.Vector3().crossVectors(v1, v2).normalize();
			this.body.up.copy(v3);
			this.body.lookAt(groundpoint);
		}

		let distance = this.body.position.distanceTo( this.target );
		if(distance < 1){
			this.moving = false;
		}

		this.updateAnimation();
	}

	updateAnimation(){
    throw new Error("Must be implemented by an animal.")
	}

	remove(){
		this.scene.remove(this.group);
	}

	loadModel(){
		this.group.add(this.body);
		this.group.scale.set( this.scale, this.scale, this.scale );
		this.body.position.copy(this.position);
		this.scene.add(this.group);
	}
}
