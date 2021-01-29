import { DOMElement } from 'react';
import * as THREE from 'three';
import { CardAvatar } from '../Card';
import Environment from '../Environment';
import { GameManager } from '../GameManager';
import { Card, GameAction } from 'common';

const labelStyle = {

}

/**
 * The mesh-like representation of the card meshes in the game space.
 */
export class HandAvatar extends THREE.Group {
  playerId: string;
  cards: CardAvatar[] = [];
  spreadScaling = 1;
  rotationScaling = -0.2;
  arc = 0.2;
  cardSizeX = 0.67;

  constructor(id: string, position: THREE.Vector3) {
    super();
    this.playerId = id;
    this.position.copy(position);
    GameManager.on(GameAction.Type.DrawCards, (payload: GameAction.DrawCards.Payload) => this._handleDrawCards(payload));
  }

  addCard(...card: CardAvatar[]) {
    this.add(...card);
    this.cards.push(...card);
    this.spread();
    return this;
  }

  private _handleDrawCards(payload: GameAction.DrawCards.Payload) {
    if (payload.id === this.playerId) {
      const { cards } = payload;
      this.addCard(...cards.map(({suit, value}) => CardAvatar.Create(suit, value)));
    }
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