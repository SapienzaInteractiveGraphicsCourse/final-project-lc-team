import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';


export const player = (() => {

  class Player {
    constructor(params) {
      this.position_ = new THREE.Vector3(0, 0, 0);
      this.velocity_ = 0.0;
      this.direction_ = true;
      this.jump_ = false;
      this.high_ = true;
      this.low_ = false;
      this.goingup_ = true;
      this.goingdown_ = false; 

      this.playerBox_ = new THREE.Box3();

      this.params_ = params;

      this.LoadModel_();
      this.InitInput_();
    }

    LoadModel_() {
      const loader = new FBXLoader();
      loader.setPath('./resources/Dinosaurs/FBX/');
      loader.load('Velociraptor.fbx', (fbx) => {
        fbx.scale.setScalar(0.0025); 
        fbx.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        
        this.mesh_ = fbx;
        this.params_.scene.add(this.mesh_);

        fbx.traverse(c => {
          let materials = c.material;
          if (!(c.material instanceof Array)) {
            materials = [c.material];
          }
  
          for (let m of materials) {
            if (m) {
              m.specular = new THREE.Color(0x000000);
              m.color.offsetHSL(0, 0, 0.25);
            }
          }    
          c.castShadow = true;
          c.receiveShadow = true;
        });
      });
    }

    InitInput_() {
      this.keys_ = {
          spacebar: false,
      };
      this.oldKeys = {...this.keys_};

      document.addEventListener('keydown', (e) => this.OnKeyDown_(e), false);
      document.addEventListener('keyup', (e) => this.OnKeyUp_(e), false);
    }

    OnKeyDown_(event) {
      switch(event.keyCode) {
        case 32:
          this.keys_.space = true;
          break;
      }
    }

    OnKeyUp_(event) {
      switch(event.keyCode) {
        case 32:
          this.keys_.space = false;
          break;
      }
    }

    CheckCollisions_() {
      const colliders = this.params_.world.GetColliders();

      this.playerBox_.setFromObject(this.mesh_);
      this.playerBox_.expandByScalar(-0.5);

      for (let c of colliders) {
        const cur = c.collider;

        if (cur.intersectsBox(this.playerBox_)) {
          this.gameOver = true;
        }
      }
    }

    Update(timeElapsed) {
      if (this.keys_.space && this.position_.y == 0.0) {
        this.goingup_ = true;
        this.goingdown_  = false;
        this.velocity_ = 30;
        this.jump_ = true;
      }
      const acceleration = -75 * timeElapsed;

      this.position_.y += timeElapsed * (this.velocity_ + acceleration * 0.5);
      this.position_.y = Math.max(this.position_.y, 0.0);
      if (this.position_.y == 0.0) {
        this.jump_ = false;
      }
      this.velocity_ += acceleration;
      this.velocity_ = Math.max(this.velocity_, -100);
      if (this.mesh_){
        this.UpdateRun();
        this.mesh_.position.copy(this.position_);
        this.CheckCollisions_();
      }
    }

    //ANIMATIONS
    UpdateRun() {
      if (!this.jump_){
        if (this.direction_) {
          this.mesh_.traverse(c => {
            if (c.name == "BackUpLegR") {
              if (c.position.z > 1.9){
                this.direction_ = false;
              }
              createjs.Tween.get(c.position).to({ z: 2 }, 200);
            }
            if (c.name == "BackFootR" || c.name == "BackFootR_end") {
              createjs.Tween.get(c.position).to({ z: 2 }, 200);
            }
            if (c.name == "BackLowLegR_end") {
              createjs.Tween.get(c.position).to({ z: -0 }, 200);
            }
            if (c.name == "BackLowLegR")
              createjs.Tween.get(c.position).to({ z: -2 }, 200);

            if (c.name == "BackUpLegL") {
              createjs.Tween.get(c.position).to({ z: 2 }, 200);
            }
            if (c.name == "BackLowLegL_end") {
              createjs.Tween.get(c.position).to({ z: -2 }, 200);
            }
            if (c.name == "BackLowLegL") {
              createjs.Tween.get(c.position).to({ z: 0}, 200);
            }
            if (c.name == "BackFootL" || c.name == "BackFootL_end") {
              createjs.Tween.get(c.position).to({ z: -3 }, 200);
            }
            if (c.name =="Tail3"){
              createjs.Tween.get(c.position).to({ x: 1 }, 200);
            }
            if (c.name == "Tail4") {
              createjs.Tween.get(c.position).to({ x: 1 }, 200); 
            }
            if (c.name == "Tail5") {
              createjs.Tween.get(c.position).to({ x: 2 }, 200);
            }
          });
        }
      
        else {
          this.mesh_.traverse( c => {
            if (c.name == "BackUpLegR") {
              if (c.position.z < -1.9){
                this.direction_ = true;
              }
              createjs.Tween.get(c.position).to({ z: -2 }, 200);
            }
            if (c.name == "BackFootR" || c.name == "BackFootR_end") {
              createjs.Tween.get(c.position).to({ z: -3 }, 200);
            }
            if (c.name == "BackLowLegR_end") {
              createjs.Tween.get(c.position).to({ z: 0 }, 200);
            }
            if (c.name == "BackLowLegR")
              createjs.Tween.get(c.position).to({ z: 0 }, 200);

            if (c.name == "BackUpLegL") {
              createjs.Tween.get(c.position).to({ z: -2 }, 200);
            }
            if (c.name == "BackLowLegL_end") {
              createjs.Tween.get(c.position).to({ z: 2 }, 200);
            }
            if (c.name == "BackLowLegL") {
              createjs.Tween.get(c.position).to({ z: -1}, 200);
            }
            if (c.name == "BackFootL" || c.name == "BackFootL_end") {
              createjs.Tween.get(c.position).to({ z: 2 }, 200);
            }
            if (c.name == "Tail3") {
              createjs.Tween.get(c.position).to({ x: -1 }, 200);
            }
            if (c.name == "Tail4") {
              createjs.Tween.get(c.position).to({ x: -1 }, 200);
            }
            if (c.name == "Tail5") {
              createjs.Tween.get(c.position).to({ x: -2 }, 200);

            }
          });
        }  
      }
      else{
        if (this.position_.y > 4.8 && this.goingup_){
          this.goingup_ = false;
        }
        if (this.position_.y < 4.8 && !this.goingup_){
          this.goingdown_ = true;
        }
        if (this.high_ && this.goingup_){
          this.mesh_.traverse(c => {
            if (c.name == "root" && this.high_) {
              this.high_ = false;
              this.low_ = true;
              createjs.Tween.get(c.rotation).to({ x: Math.PI / 6 }, 200);
            }
        });
        }
        else if (this.low_ && this.goingdown_){
          this.mesh_.traverse(c => {
            if (c.name == "root" && this.low_) {
              this.low_ = false;
              this.high_ = true;
              createjs.Tween.get(c.rotation).to({ x: Math.PI/2 }, 200);
            }
        });
      }
    }
  }
}

  return {
      Player: Player,
  };
})();