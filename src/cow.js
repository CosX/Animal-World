import BaseAnimal from "./baseanimal.js";
export default class Cow extends BaseAnimal {
	constructor(id, startposition, name, scale, reference, scene){
		super(id, startposition, name, scale, reference, scene);
	}

	getBones(){
		return [
			{
				name: "rightbehindleg",
				leg: this.body.skeleton.bones[2],
				goingforward: true
			},
			{
				name: "leftbehindleg",
				leg: this.body.skeleton.bones[4],
				goingforward: false
			},
			{
				name: "rightfrontleg",
				leg: this.body.skeleton.bones[7],
				goingforward: false
			},
			{
				name: "leftfrontleg",
				leg: this.body.skeleton.bones[9],
				goingforward: true
			}
		];
	}

	updateAnimation(){
		this.bones.forEach((bone) => {
			if(bone.goingforward){
				bone.leg.rotation.y -= 0.02
			} else{
				bone.leg.rotation.y += 0.02
			}

			if(bone.leg.rotation.y > 0.3 || bone.leg.rotation.y < -0.3){
				bone.goingforward = !bone.goingforward;
			}
		});
	}
}
