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

  get interactable() {
    return this._interactable;
  }

  flipped: boolean;

  get selected() {
    return this._selected;
  }
  set selected(value) {
    value ? this._highlight() : this._lowlight();
    this.parent?.select(this, value);
    this._selected = value;
  }

  targeted: boolean;

  private _outlineMesh: THREE.Mesh;
  private _handlers: (() => void)[] = [];
  private _selected: boolean;
  private _interactable: boolean;

  static Create(suit: Card.Suit, value: Card.Value, back: number = 0) {
    const { geometry, material } = load(suit, value, back);
    const c = new CardAvatar(geometry, material);

    c.suit = suit;
    c.value = value;
    c.name = `${Card.Suit[suit]}:${Card.Value[value]}`;
    c._outlineMesh = generateOutlineMesh(c);
    c._handlers.push(Environment.onMouseDown.sub(c._onMouseDown));

    return c;
  }

  /** Disables card from being highlighted, removes its parents and removes all event listeners */
  disableInteraction() {
    this._interactable = false;
    this._handlers.forEach(h => h());
    this._lowlight();
  }

  private _onMouseDown = ({ event, hit }: {event: MouseEvent, hit: RaycastHit}) => {
    switch(event.button) {
      case 2:
        if (hit.object === this) {
          this.selected = !this.selected;
        }
        break;
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
}



const suitOrder = [ 'DIAMOND', 'CLUB', 'HEART', 'SPADE' ]
const numOrder = [ '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE', '2' ]

