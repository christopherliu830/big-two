import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Card, GameAction } from 'common';
import { CardAvatar } from './Card';
import { InputOutput, RaycastHit } from './Input';
import { CardStack } from './Stack';
import { Quaternion, Vector3 } from 'three';

const config = {
  spread: {
    local: 0.4,
    remote: 0.1,
  },
  rotationScaling: -0.3,
  arc: {
    remote: 0.42,
    local: 1.7,
  },
};

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

  private _canSelect = false;

  private _input: InputOutput;

  private _inputsEnabled: boolean;

  constructor(id: string, local: boolean, input: InputOutput) {
    super();
    this.playerId = id;
    this.local = local;

    this._handleMouseUp = this._handleMouseUp.bind(this);
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._input = input;

    if (local) {
      this.arc = config.arc.local;
      this.spreadScaling = config.spread.local;
      this.enableInputs();
    } else {
      this.arc = config.arc.remote;
      this.spreadScaling = config.spread.remote;
    }

  }

  addCard(...cards: CardAvatar[]): void {
    cards.forEach((card) => {
      card.parent?.removeCard(card);
    });

    // handle mesh adding
    this.add(...cards);
    this.cards.push(...cards);
    this.spread();
  }

  removeCard = (...cards: CardAvatar[]): void => {
    cards.forEach((card) => {
      card.getWorldPosition(card.position);
      card.getWorldQuaternion(card.quaternion);
      this.remove(card);
      this._selected.delete(card);
      const i = this.cards.indexOf(card);
      if (i > -1) this.cards.splice(i, 1);
    });
  };

  playCards = (...cards: Card.Card[]): void => {
    const avatars: CardAvatar[] = [];
    cards.forEach(toPlay => {
      const avatar = this.cards.find((c) => toPlay.netId === c.netId);
      console.log(avatar.position.x);
      if (!avatar) throw Error('Did not have card');
      avatar.switch(toPlay);
      avatar.disableInteraction();
      this.removeCard(avatar);
      avatars.push(avatar);
    })

    CardStack.Stack.add(...avatars);
  }

  select = (card: CardAvatar, selected: boolean): void => {
    if (selected) {
      card.selected = true;
      this._selected.add(card);
    } else {
      card.selected = false;
      this._selected.delete(card);
    }
  };

  enableInputs() {
    if (!this._inputsEnabled) {
      this._inputsEnabled = true;
      this._input.onMouseDown.sub(this._handleMouseDown);
      this._input.onMouseMove.sub(this._handleMouseMove);
      this._input.onMouseUp.sub(this._handleMouseUp);
    }
  }

  disableInputs() {
    if (this._inputsEnabled) {
      this._inputsEnabled = false;
      this._input.onMouseDown.unsub(this._handleMouseDown);
      this._input.onMouseMove.unsub(this._handleMouseMove);
      this._input.onMouseUp.unsub(this._handleMouseUp);
    }
  }

  private _handleMouseDown({
    event,
    hit,
  }: {
    event: MouseEvent;
    hit: RaycastHit;
  }) {
    if (event.button === 2) {
      if (
        hit.object instanceof CardAvatar &&
        this.children.includes(hit.object)
      ) {
        if (this._selected.has(hit.object)) {
          this.select(hit.object, false);
        } else {
          this.select(hit.object, true);
        }
      }
    }
  }

  private _handleMouseUp({ event, hit }: { event: MouseEvent, hit: RaycastHit }): void {
    if (event.button === 0) {
      // ghetto

      const distFromWorldCenter = hit.point.length();
      if (distFromWorldCenter < 0.8) {
        this._submitCards();
      } else {
        this.spread();
      }
    }
  }

  private _handleMouseMove({ hit }: { hit: RaycastHit }) {
    if (this._input.mouseDown === 0) {
      this._selected.forEach((s) => {
        const p = s.parent;
        s.parent?.remove(s);
        s.position.copy(hit.point);
        s.position.y = 0;
        if (p) p.attach(s);
      });
    }
  }

  private _submitCards() {
    if (this._selected.size === 0) return;
    const cards: Card.Card[] = [];
    const selectedCards = this._selected;
    this._selected.forEach((card) => {
      cards.push({ suit: card.suit, value: card.value });
    });
    // this._canSelect = false;
    this.disableInputs();
    this._selected = new Set();

    const action = new GameAction.PlayCards({
      id: this.playerId,
      cards,
    });

    action.callback = (succeeded: boolean) => {
      this.enableInputs();
      this._selected = selectedCards;

      if (succeeded) {
        selectedCards.forEach((card) => {
          // Weird positioning stuff means you have to do this
          card.getWorldPosition(card.position);
          card.disableInteraction();
          this.removeCard(card);
          CardStack.Stack.add(card);
        });
      } 
      this.spread();
    };

    this._input.submit(action);
  }

  spread(): void {
    const len = this.cards.length;
    if (len === 1) {
      new TWEEN.Tween(this.cards[0].position)
        .to(
          {
            x: 0,
            y: 0,
            z: 0,
          },
          80
        )
        .easing(TWEEN.Easing.Bounce.InOut)
        .start();
      return;
    }

    for (let i = 0; i < len; i += 1) {
      const offset = i / (len - 1) - 0.5;
      const rotY = offset * this.rotationScaling;
      new TWEEN.Tween(this.cards[i])
        .to(
          {
            position: {
              x: offset * len * this.spreadScaling,
              z: Math.abs(offset) ** 2 * this.arc,
            },
            rotation: {
              y: rotY,
            },
          },
          80
        )
        .easing(TWEEN.Easing.Bounce.InOut)
        .start();

      this.cards[i].position.y = i * 0.001;
    }
  }

  raycast(raycaster: THREE.Raycaster, intersects: THREE.Intersection[]): void {
    this.cards.forEach((c) => {
      c.raycast(raycaster, intersects);
    });
  }
}
