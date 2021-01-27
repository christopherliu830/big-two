import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { CardAvatar } from '../Card';
import { GameManager } from '../GameManager';
import { Input } from '../Input';
import Environment, { RaycastHit } from '../Environment';
import { Card, GameAction } from 'common';

const config = {
  spread: {
    local: 0.4,
    remote: 0.1,
  },
  rotationScaling: -0.3,
  arc: {
    remote: 0.42,
    local: 1.7,
  }
}

/**
 * The mesh-like representation of a collection of card meshes in the game space.
 */
export class HandAvatar extends THREE.Group {
  playerId: string;
  cards: CardAvatar[] = [];
  spreadScaling;
  rotationScaling = config.rotationScaling;
  arc: number;
  local: boolean;
  private _selected: Set<CardAvatar> = new Set();
  private _canSelect: boolean = false;

  constructor(id: string, local: boolean) {
    super();
    this.playerId = id;
    this.local = local;
    
    if (local) {
      this.arc = config.arc.local;
      this.spreadScaling = config.spread.local;
      this._canSelect = true;
      Environment.onMouseUp.sub(this._handleMouseUp.bind(this));
      Environment.onMouseMove.sub(this._handleMouseMove.bind(this));
    }
    else {
      this.arc = config.arc.remote;
      this.spreadScaling = config.spread.remote;
      this._canSelect = false;
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
    if (this._canSelect) {
      if (selected) {
        card.selected = true;
        this._selected.add(card);
      } else {
        card.selected = false;
        this._selected.delete(card);
      }
    }
  }

  private _handleMouseUp({ event, hit }: { event: MouseEvent, hit: RaycastHit }) {
    if (event.button === 0) { // ghetto

      const distFromWorldCenter = hit.point.length();
      if (distFromWorldCenter < 0.8) {
        this._submitCards();
      } else  {
        this.spread();
      }
    }
    else if (event.button === 2) {
      if (hit.object instanceof CardAvatar && this.children.includes(hit.object)) {
        if (this._selected.has(hit.object)) {
          this.select(hit.object, false);
        } else {
          this.select(hit.object, true);
        }
      }
    }
  }

  private _handleMouseMove({ hit }: { hit: RaycastHit }) {

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
    if (this._selected.size === 0) return;
    const cards: Card.Card[] = [];
    const selectedCards = this._selected;
    this._selected.forEach(card => {
      cards.push({suit: card.suit, value: card.value});
    })
    this._canSelect = false;
    this._selected = new Set();

    const action = new GameAction.PlayCards({ 
      id: this.playerId,
      cards: cards,
    });

    action.callback = (succeeded: boolean) => {
      this._canSelect = true;
      this._selected = selectedCards;

      if (succeeded) { 
        selectedCards.forEach(card => {
          // Weird positioning stuff means you have to do this
          card.getWorldPosition(card.position);
          this.removeCard(card);
          this.parent?.add(card);
          card.position.y = GameManager.stackHeight++ * 0.001;
        })
      } else {
        this.spread();
      }
    }
    GameManager.sendGameAction(action);
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
          x: offset * len * this.spreadScaling,
          z: Math.pow(Math.abs(offset), 2) * this.arc
        },
        rotation: {
          y: rotY,
        }
      }, 80)
        .easing(TWEEN.Easing.Bounce.InOut)
        .start()
      
      this.cards[i].position.y = i * 0.001;
    }
  }

  raycast(raycaster: THREE.Raycaster, intersects: THREE.Intersection[]) {
    this.cards.forEach(c => {
      c.raycast(raycaster, intersects);
    })
  }

}