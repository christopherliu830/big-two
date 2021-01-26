import { DOMElement } from 'react';
import * as THREE from 'three';
import { CardAvatar } from '../Card';
import Environment from '../Environment';

const labelStyle = {

}

/**
 * The mesh-like representation of the card meshes in the game space.
 */
export class HandAvatar extends THREE.Group {
  cards: CardAvatar[] = [];
  spreadScaling = 1;
  rotationScaling = -0.2;
  arc = 0.2;
  cardSizeX = 0.67;

  constructor(position: THREE.Vector3) {
    super();
    this.position.copy(position);
  }

  addCard(...card: CardAvatar[]) {
    this.add(...card);
    this.cards.push(...card);
    this.spread();
    return this;
  }

  spread() {
    const len = this.cards.length;
    if (len === 1) { 
      return;
    }
    for(let i = 0; i < len; i++) {
      const offset = (i/(len-1)-0.5);
      const rotY = offset * this.rotationScaling;
      this.cards[i].position.x = offset * this.spreadScaling * this.cardSizeX;
      this.cards[i].position.z = Math.abs(offset) * this.arc;
      this.cards[i].rotation.y = rotY;
    }
  }

  raycast(raycaster: THREE.Raycaster, intersects: THREE.Intersection[]) {
    this.cards.forEach(c => {
      c.raycast(raycaster, intersects);
    })
  }

}