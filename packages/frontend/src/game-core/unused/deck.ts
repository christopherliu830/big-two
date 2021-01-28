/*
import { GameObject } from "../Environment";

import { getMesh } from '../Card/materials';
import { getOutlineMesh } from '../Card/materials';
import { Card } from '../Card/card';
import { Mesh } from "three";
import { GameManager } from '../GameManager';
import Environment from '../Environment';

export class Deck extends GameObject {
  cards:Array<Card>=[];
  outlineMesh:Mesh;

  private _size:number=0;
  get size() { return this._size; }
  set size(s:number) { 
    this._size = s; 
    this.mesh.scale.y = s;
    this.mesh.position.y = this.mesh.geometry.boundingBox.max.y * (s+1);
  }

  constructor(position?:THREE.Vector3) {
    super();
    this.mesh = getMesh();
    this.outlineMesh = getOutlineMesh(this.mesh);
    if (position) this.position.copy(position);
  }

  add(card:Card) {
    this.size = this.size + 1;
    this.cards.push(card);
    this.changeTopMaterial();
  }

  changeTopMaterial() {
    if (this.cards.length > 0) {
      const card = this.cards[this.cards.length-1];
      const materials = this.mesh.material as THREE.Material[];
      const cardMaterials = card.mesh.material as THREE.Material[];
      if (card.flipped) materials[2] = cardMaterials[3]; 
      else materials[2] = cardMaterials[2];
    }
  }

  onCollision(other:GameObject) {
    super.onCollision(other);
    if (!other) return;
    if (other instanceof Card) {
      this.add(other);
      this.env.remove(other);
    }
  }

  handleMouseMove(e: MouseEvent) {
    super.handleMouseMove(e);
    if (this.env.intersected[0].gameObject === this) {
      this.outlineMesh.visible = true;
    }
    else {
      this.outlineMesh.visible = false;
    }
  }

  onSelected(selected:boolean) {
    if (selected) {
      const c = this.cards.pop();
      if (!c) return;
      this.size--;
      this.env.add(c);
      console.log('AAAAAAAAAAAAAFF');
      // Manager.hand.add(c);
      this.changeTopMaterial();
    }
  }
}
*/
