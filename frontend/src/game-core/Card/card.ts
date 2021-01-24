import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import textures from './textures';
import { GameObject } from '../Environment';
import { getMesh, getOutlineMesh } from '../../three-assets/materials';
import Environment from '../Environment';


export class Card extends GameObject {

  outlineMesh:THREE.Mesh;
  flipped:boolean;
  cardName:string;
  backTexture:number;
   
  private _focused:boolean;

  constructor(cardName:string, 
              backTexture:number=0,
              position?:THREE.Vector3) {
    super();

    if (!Card.isValidCardName(cardName)) {
      throw new Error(`Invalid Card Name ${cardName}!`);
    }

    this.mesh = getMesh(cardName, backTexture);
    this.cardName = cardName;
    this.backTexture = backTexture;
    this.outlineMesh = getOutlineMesh(this.mesh);
    if (position) this.position.copy(position);
  }

  onFocused(isFocused:boolean) {
    this.outlineMesh.visible = isFocused;
    // Use private focused variable so onFocused(true) can't be called >1 time.
    if (isFocused && !this._focused) {
      this.mesh.renderOrder += 999;
      this.outlineMesh.renderOrder += 999;
      this.mesh.receiveShadow = false;
      const m = this.mesh.material as Array<THREE.Material>;
      if (m) m[2].depthTest = false;
      this._focused = true;
    }
    else if (!isFocused && this._focused) {
      this.mesh.renderOrder -= 999;
      this.outlineMesh.renderOrder -= 999;
      this.mesh.receiveShadow = true;
      const m = this.mesh.material as Array<THREE.Material>;
      if (m) m[2].depthTest = true;
      this._focused = false;
    }
  }

  flip() {
    new TWEEN.Tween(this.mesh.rotation)
      .to({z: '+3.14159265'}, 100).start();
    this.flipped = !this.flipped;
  }

  /**
   * returns a comparison between the first card and second. 
   * This will return card value (i.e) two is the highest
   * -1 if this is sorted before b, 0 if they are equal, 1 if this is sorted after b.
   */
  compare(b:Card) {
    const [as, an] = this.cardName.split('_');
    const [bs, bn] = b.cardName.split('_');
    const ias = suitOrder.indexOf(as);
    const ian = numOrder.indexOf(an);
    const ibs = suitOrder.indexOf(bs);
    const ibn = numOrder.indexOf(bn);
    if (ian > ibn) return 1;
    else if (ian < ibn) return -1;
    else if (ias > ibs) return 1;
    else if (ias < ibs) return -1;
    else return 0;
  }

  static cardArray(backTexture:number=0) : Array<Card> {
    return Object.keys(textures.fronts).map(key => {
      return new Card(key, backTexture);
    })
  }

  static isValidCardName(name:string) {
    if (!name) return false;
    const [s, n] = name.split('_');
    return suitOrder.indexOf(s) > -1 && numOrder.indexOf(n) > -1;
  }
}

const raycaster = new THREE.Raycaster();
const suitOrder = [ 'DIAMOND', 'CLUB', 'HEART', 'SPADE' ]
const numOrder = [ '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE', '2' ]

