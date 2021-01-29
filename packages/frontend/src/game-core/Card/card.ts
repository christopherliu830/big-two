import { Mesh } from 'three';
import { Card } from 'common';
import { load, generateOutlineMesh } from './loader';
import type { HandAvatar } from '../Hand';
import { RaycastHit, InputOutput } from '../Input';

export class CardAvatar extends Mesh implements Card.Card {

  suit: Card.Suit;

  value: Card.Value;

  netId: string;

  parent: HandAvatar;

  flipped: boolean;

  selected: boolean;

  private _outlineMesh: THREE.Mesh;

  private _handlers: (() => void)[] = [];

  private _input: InputOutput;

  static Create(
    input: InputOutput,
    suit: Card.Suit,
    value: Card.Value,
    netId: string,
    back = 0
  ): CardAvatar {
    const { geometry, material } = load(suit, value, back);
    const c = new CardAvatar(geometry, material);

    c.suit = suit;
    c.value = value;
    c.name = `${Card.Suit[suit]}:${Card.Value[value]}`;
    c.netId = netId;
    c._input = input;
    c._outlineMesh = generateOutlineMesh(c);
    c._handlers.push(input.onMouseMove.sub(c._onMouseMove.bind(c)));
    c.castShadow = true;
    c.receiveShadow = true;

    return c;
  }

  select(value: boolean): void {
    if (value) this._highlight();
    else this._lowlight();
    this.selected = value;
  }

  /** Disables card from being highlighted, removes its parents and removes all event listeners */
  disableInteraction(): void {
    this._handlers.forEach((h) => h());
    this._lowlight();
  }

  enableInteraction(): void {
    this._handlers.push(
      this._input.onMouseMove.sub(this._onMouseMove.bind(this))
    );
  }

  /**
   * Change the card's appearance to match the card.
   */
  switch(card: Card.Card) {
    const { suit, value } = card;
    const { geometry, material } = load(suit, value, 0);
    this.material = material;
    this.geometry = geometry;
    this._outlineMesh = generateOutlineMesh(this);
  }

  private _onMouseMove({ hit }: { hit: RaycastHit }) {
    if (hit.object === this) {
      this._highlight();
    } else if (!this.selected) {
      this._lowlight();
    }
  }

  private _highlight() {
    this.receiveShadow = false;
    this._outlineMesh.visible = true;
    this._outlineMesh.renderOrder = 998;
    this.renderOrder = 999;
    (this.material as THREE.Material[]).forEach((m) => {
      m.depthTest = false;
    });
    (this._outlineMesh.material as THREE.Material).depthTest = false;
  }

  private _lowlight() {
    this.receiveShadow = true;
    this._outlineMesh.visible = false;
    this.renderOrder = 0;
    this._outlineMesh.renderOrder = this.renderOrder - 1;
    (this.material as THREE.Material[]).forEach((m) => {
      m.depthTest = true;
    });
    (this._outlineMesh.material as THREE.Material).depthTest = true;
  }
}
