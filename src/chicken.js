import BaseAnimal from "./baseanimal.js";
export default class Chicken extends BaseAnimal {
  constructor(id, startposition, name, scale, reference, scene){
    super(id, startposition, name, scale, reference, scene);
    this.animaltype = "chicken";
  }

  getBones(){
		return [
			{
				name: "leftleg",
				leg: this.body.skeleton.bones[3],
				goingforward: true
			},
			{
				name: "rightleg",
				leg: this.body.skeleton.bones[5],
				goingforward: false
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
