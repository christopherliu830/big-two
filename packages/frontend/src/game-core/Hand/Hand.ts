import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { CardAvatar } from '../Card';
import { GameManager } from '../GameManager';
import { Input } from '../Input';
import Environment, { RaycastHit } from '../Environment';
import { Card, GameAction } from 'common';

/**
 * The mesh-like representation of a collection of card meshes in the game space.
 */
export class HandAvatar extends THREE.Group {
  playerId: string;
  cards: CardAvatar[] = [];
  spreadScaling = 1;
  rotationScaling = -0.2;
  arc = 0.2;
  cardSizeX = 0.67;
  local: boolean;
  _selected: Set<CardAvatar> = new Set();

  constructor(id: string, position: THREE.Vector3, local: boolean) {
    super();
    this.playerId = id;
    this.local = local;
    this.position.copy(position);

    if (local) {
      Environment.onMouseUp.sub(this._handleMouseUp);
      Environment.onMouseMove.sub(this._handleMouseMove);
    }
  }

  addCard(...cards: CardAvatar[]) {

    cards.forEach(card => {
      card.parent?.removeCard(card);
    })

    // handle mesh adding
    this.add(...cards);
    this.cards.push(...cards);
    this.spread();

    return this;
  }

  removeCard = (...cards: CardAvatar[]) => {
    this.remove(...cards);
    cards.forEach(card => {
      this._selected.delete(card);
      const i = this.cards.indexOf(card);
      if (i > -1) this.cards.splice(i, 1);
    })
  }

  select = (card: CardAvatar, selected: Boolean) => {
    selected ? this._selected.add(card) : this._selected.delete(card) ;
  }

  private _handleMouseUp = ({ event, hit }: { event: MouseEvent, hit: RaycastHit }) => {
    if (event.button === 0) { // ghetto

      const distFromWorldCenter = hit.point.length();
      console.log(distFromWorldCenter);
      if (distFromWorldCenter < 0.8) {
        this._submitCards();
      } else  {
        this.spread();
      }
    }
  }

  private _handleMouseMove = ({ hit }: { hit: RaycastHit }) => {
    if (Input.mouseDown === 0) {
      this._selected.forEach(s => {
        const p = s.parent;
        s.parent?.remove(s);
        s.position.copy(hit.point);
        s.position.y = 0;
        if (p) p.attach(s);
      })
    }
  }

  private _submitCards() {
    const cards: Card.Card[] = [];
    this._selected.forEach(card => {
      cards.push({suit: card.suit, value: card.value});

      // Weird positioning stuff means you have to do this
      card.getWorldPosition(card.position);

      this.removeCard(card);
      card.disableInteraction();

      this.parent?.add(card);
      // this.position.x = 0;
      // this.position.y = GameManager.stackHeight * 0.01;
      // this.position.z = 0;
    })

    if (cards.length === 0) return; // Don't submit nothing!

    const action = new GameAction.PlayCards({ 
      id: this.playerId,
      cards: cards,
    });
    GameManager.sendGameAction(action);
    this.spread();
  }

  spread() {
    const len = this.cards.length;
    if (len === 1) { 
      new TWEEN.Tween(this.cards[0].position).to({
        x: 0,
        y: 0,
        z: 0,
      }, 80)
        .easing(TWEEN.Easing.Bounce.InOut)
        .start()
      return;
    }

    for(let i = 0; i < len; i++) {
      const offset = (i/(len-1)-0.5);
      const rotY = offset * this.rotationScaling;
      new TWEEN.Tween(this.cards[i]).to({
        position: {
          x: offset * this.spreadScaling * this.cardSizeX,
          z: Math.abs(offset) * this.arc,
        },
        rotation: {
          y: rotY,
        }
      }, 80)
        .easing(TWEEN.Easing.Bounce.InOut)
        .start()
    }
  }

  raycast(raycaster: THREE.Raycaster, intersects: THREE.Intersection[]) {
    this.cards.forEach(c => {
      c.raycast(raycaster, intersects);
    })
  }

}