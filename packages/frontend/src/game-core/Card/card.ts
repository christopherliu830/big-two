import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { load, generateOutlineMesh } from './loader';
import { Mesh, Vector3 } from 'three';
import { Card } from 'common';
import Environment, { RaycastHit } from '../Environment';
import { Input } from '../Input';
import { GameManager } from '../GameManager';

export class CardAvatar extends Mesh implements Card.Card {

  suit: Card.Suit;
  value: Card.Value;

  interactable: boolean = true;
  flipped: boolean;
  selected: boolean;
  targeted: boolean;

  private _outlineMesh: THREE.Mesh;
  private _handlers: (() => void)[] = [];
  private _lastPosition: THREE.Vector3 = new THREE.Vector3();


  static Create(suit: Card.Suit, value: Card.Value, back: number = 0) {
    const { geometry, material } = load(suit, value, back);
    const c = new CardAvatar(geometry, material);
    c.suit = suit;
    c.value = value;
    c.name = `${Card.Suit[suit]} of ${Card.Value[value]}`;
    c._outlineMesh = generateOutlineMesh(c);
    c._handlers.push(Environment.onMouseMove.sub((e: Environment, i: RaycastHit) => c._handleMouseMove(e, i)));
    c._handlers.push(Input.onMouseDown.sub((e: MouseEvent) => c._onMouseDown(e)));
    c._handlers.push(Input.onMouseUp.sub((e: MouseEvent) => c._onMouseUp(e)));

    return c;
  }

  private _onMouseDown(event: MouseEvent) {
    switch(event.button) {
      case 0:
        this._lastPosition.copy(this.position);
        break;
      case 2:
        if (this.targeted) {
          this.selected = !this.selected;
          this.selected ? this._highlight() : this._lowlight();
        }
        break;
    }
  }

  private _onMouseUp(event: MouseEvent) {
    switch(event.button) {
      case 0:
        const t = new THREE.Vector3();
        this.getWorldPosition(t);
        if (t.z < 1) {
          this._submitForPlay();
        } else {
          new TWEEN.Tween(this).to({position: this._lastPosition}, 80)
            .easing(TWEEN.Easing.Bounce.InOut)
            .start()
        }
        break;
    }
  }

  private _handleMouseMove(env: Environment, hit: RaycastHit) {
    this.targeted = hit.object === this;

    // TODO : maybe fix this?
    if (this.selected && Input.mouseDown == 0) {
      
      const p = this.parent;
      this.parent?.remove(this);
      this.position.copy(hit.point).y = 0;
      p.attach(this);
    }
  }

  private _highlight() {
    this._outlineMesh.visible = true;
    this._outlineMesh.renderOrder = 998;
    this.renderOrder = 999;
    (this.material as THREE.Material[])[2].depthTest = false;
  }

  private _lowlight() {
    this.targeted = false;
    this._outlineMesh.visible = false;
    this._outlineMesh.renderOrder = 0;
    this.renderOrder = 1;
    (this.material as THREE.Material[])[2].depthTest = true;
  }

  private _submitForPlay() {
    this.interactable = false;
    this.position.y = GameManager.stackHeight * 0.01;
    this.position.z = 0;

    const p = this.parent;
    this.parent?.remove(this);
    this.position.x = this.rotation.y = Math.random() * 0.1 - 0.05;
    p.attach(this);

    this._lowlight();
    this._handlers.forEach(h => h());
    GameManager.play(this);
  }

  // flip() {
  //   new TWEEN.Tween(this.mesh.rotation)
  //     .to({z: '+3.14159265'}, 100).start();
  //   this.flipped = !this.flipped;
  // }

  // /**
  //  * returns a comparison between the first card and second. 
  //  * This will return card value (i.e) two is the highest
  //  * -1 if this is sorted before b, 0 if they are equal, 1 if this is sorted after b.
  //  */
  // compare(b:Card) {
  //   const [as, an] = this.cardName.split('_');
  //   const [bs, bn] = b.cardName.split('_');
  //   const ias = suitOrder.indexOf(as);
  //   const ian = numOrder.indexOf(an);
  //   const ibs = suitOrder.indexOf(bs);
  //   const ibn = numOrder.indexOf(bn);
  //   if (ian > ibn) return 1;
  //   else if (ian < ibn) return -1;
  //   else if (ias > ibs) return 1;
  //   else if (ias < ibs) return -1;
  //   else return 0;
  // }

  // static cardArray(backTexture:number=0) : Array<Card> {
  //   return Object.keys(textures.fronts).map(key => {
  //     return new Card(key, backTexture);
  //   })
  // }

  // static isValidCardName(name:string) {
  //   if (!name) return false;
  //   const [s, n] = name.split('_');
  //   return suitOrder.indexOf(s) > -1 && numOrder.indexOf(n) > -1;
  // }
}



const suitOrder = [ 'DIAMOND', 'CLUB', 'HEART', 'SPADE' ]
const numOrder = [ '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE', '2' ]

