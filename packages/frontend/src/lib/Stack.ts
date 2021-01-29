import { Group, LinearMipMapNearestFilter, Object3D, QuaternionKeyframeTrack } from 'three'; 
import * as TWEEN from '@tweenjs/tween.js';
import { create } from 'lodash';
import { Vector3, Quaternion, Euler } from 'three';

const forward = new Vector3(1, 0, 0);
const spreadScaling = 0.2;
const duration = 140;

class Stack extends Group {
  height = 0;

  add = (...objects: Object3D[]) => {

    let spread = -spreadScaling * objects.length / 2;
    objects.forEach(obj => {
      super.add(obj);

      const qend = new Quaternion();
      qend.copy(obj.quaternion);

      obj.rotateOnAxis(forward, Math.PI);

      const qstart = new Quaternion();
      qstart.copy(obj.quaternion);

      const goal = new Vector3();
      goal.y = this.height;
      const tf = new Vector3(1, 0, 0);
      tf.applyQuaternion(obj.quaternion).normalize(); 
      console.log(tf);
      goal.add(tf.multiplyScalar(spread));
      console.log(tf);
      this.height += 0.01;
      spread += spreadScaling;

      const t = {t: 0};
      const update = () => {
        Quaternion.slerp(qstart, qend, obj.quaternion, t.t);
        obj.position.y = -(t.t) * (t.t);
      }

      new TWEEN.Tween(t).to({t: 1}, duration)
        .onUpdate(update)
        .start();
      new TWEEN.Tween(obj)
        .to({
          position: {x: goal.x, y: [0, +2, this.height], z: goal.z},
        }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut) 
        .start();
    })
    return this;
  }
}

export const CardStack = {
  Stack: new Stack(),
  destroy() { this.Stack = null; },
  create() { this.Stack = new Stack() }
}