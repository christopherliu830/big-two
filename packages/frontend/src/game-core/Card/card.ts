import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { load, generateOutlineMesh } from './loader';
import { Mesh, Vector3 } from 'three';
import { Card } from 'common';
import Environment, { RaycastHit } from '../Environment';
import { Input } from '../Input';
import { GameManager } from '../GameManager';
import Emitter from 'component-emitter';
import { HandAvatar } from '../Hand';

export class CardAvatar extends Mesh implements Card.Card {

  suit: Card.Suit;
  value: Card.Value;
  parent: HandAvatar;


  flipped: boolean;

  get selected() {
    return this._selected;
  }
  set selected(value) {
    value ? this._highlight() : this._lowlight();
    this._selected = value;
  }

  targeted: boolean;

  private _outlineMesh: THREE.Mesh;
  private _handlers: (() => void)[] = [];
  private _selected: boolean;

  static Create(suit: Card.Suit, value: Card.Value, back: number = 0) {
    const { geometry, material } = load(suit, value, back);
    const c = new CardAvatar(geometry, material);

    c.suit = suit;
    c.value = value;
    c.name = `${Card.Suit[suit]}:${Card.Value[value]}`;
    c._outlineMesh = generateOutlineMesh(c);
    c._handlers.push(Environment.onMouseMove.sub(c._onMouseMove.bind(c)));
    c.castShadow = true;
    c.receiveShadow = true;

    return c;
  }

  /** Disables card from being highlighted, removes its parents and removes all event listeners */
  disableInteraction() {
    this._handlers.forEach(h => h());
    this._lowlight();
  }

  enableInteraction() {
    this._handlers.push(Environment.onMouseMove.sub(this._onMouseMove.bind(this)));
  }

  private _onMouseMove({hit }: {hit: RaycastHit}) {
    if (hit.object === this) {
      this._highlight();
    }
    else if (!this.selected) {
      this._lowlight();
    }
  }

  private _highlight() {
    this.receiveShadow = false;
    this._outlineMesh.visible = true;
    this._outlineMesh.renderOrder = 998;
    this.renderOrder = 999;
    (this.material as THREE.Material[]).forEach(m => m.depthTest = false);
    (this._outlineMesh.material as THREE.Material).depthTest = false;
  }

  private _lowlight() {
    this.receiveShadow = true;
    this.targeted = false;
    this._outlineMesh.visible = false;
    this.renderOrder = 0;
    this._outlineMesh.renderOrder = this.renderOrder - 1;
    (this.material as THREE.Material[]).forEach(m => m.depthTest = true);
    (this._outlineMesh.material as THREE.Material).depthTest = true;
  }
}



const suitOrder = [ 'DIAMOND', 'CLUB', 'HEART', 'SPADE' ]
const numOrder = [ '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE', '2' ]

