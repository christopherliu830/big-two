/*
import Environment, { GameObject } from '../game-core/Environment';
import { getOutlineMesh, generateText } from './materials';
import * as THREE from 'three';
import manager from '../game-core/GameManager';

export class PassButton extends GameObject {

  outlineMesh:THREE.Mesh;

  constructor() {
    super();
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.1, 1),
      new THREE.MeshBasicMaterial({color:'lightgray'})
    );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.position.set(3, 0.2, 2);
    this.outlineMesh = getOutlineMesh(this.mesh, 'green');
    generateText('pass').then(geometry => {
      geometry.computeBoundingBox();
      const m = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({color:'white'}),
      );
      m.rotation.x = -Math.PI / 2;
      const v = geometry.boundingBox.max.clone().multiplyScalar(0.5);
      m.position.set(m.position.x - v.x, 0, v.z - 0.7);
      m.castShadow = true;
      m.receiveShadow = true;
      this.mesh.add(m);
    });
  }

  onFocused(isFocused:boolean) {
    this.outlineMesh.visible = isFocused;
  }

  handleMouseDown(e:MouseEvent) {
    super.handleMouseDown(e);
    if (this.env.current.gameObject === this) {
      manager.pass();
    }
  }
}
*/
