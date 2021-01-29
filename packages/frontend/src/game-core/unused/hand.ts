/*
import { Easing } from '@tweenjs/tween.js';
import { GameObject } from '../Environment';
import { Card } from '../Card/card';
import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { lerpnum as lerp, lerparc } from '../../util';
import { MeshBasicMaterial, Vector3 } from 'three';
import { GameManager } from '../GameManager';

export class Hand extends GameObject{
  static num:number = 0;
  cards:Array<Card>=[];
  selected:Array<Card>=new Array();
  offsets:Array<any> = new Array();

  add(card:Card) {
    if (this.cards.indexOf(card) == -1) {
      this.cards.push(card);
    }

    if (card.flipped) card.flip();

    new TWEEN.Tween(card.mesh.rotation)
      .to({x: Math.PI/8, z: 0, y: 0}, 200)
      .start();
    this.sort();
    this.refresh();
  }

  remove(card:Card) {
    const i = this.cards.indexOf(card);
    if (i === -1) return;
    this.cards.splice(i, 1);
    card.mesh.rotation.x = 0;
    card.mesh.receiveShadow = true;
    this.sort();
    this.refresh();
  }

  sort() {
    // Sort by card value
    this.cards.sort((a,b) => a.compare(b));
  }

  refresh() {
    const offset = (this.cards.length-1)/2 * CARD_DIMENSIONS.x;
    for(let i = 0; i < this.cards.length; i++) {
      const coords = {
        x: (i*CARD_DIMENSIONS.x - offset) * 0.6, 
        y: 0.9 + 0.002*i, // So it layers correctly 
        z: 2.6 + 2 * (((i+1)/(this.cards.length+1) - 0) * ((i+1)/(this.cards.length+1) - 1))
      }
      const rotation = {
        y: lerp(0.3, -0.3, (i+1)/(this.cards.length+1)),
        x: 0.01,
      }
      if (this.selected.includes(this.cards[i])) {
        coords.y += 0.2;
        coords.z -= 0.2;
        new TWEEN.Tween(this.cards[i].mesh)
          .to({position: coords, rotation}, 200)
          .easing(Easing.Quadratic.InOut)
          .start();
      }
      else {
        new TWEEN.Tween(this.cards[i].mesh)
          .to({position: coords, rotation}, 200)
          .easing(Easing.Quadratic.InOut)
          .start();
      }
    }
  }

  handleMouseDown(e: MouseEvent) {
    switch(e.button) {
      case 0:
        break;
      case 2:
        const i = this.cards.indexOf(this.env.current.gameObject as Card);
        if (i !== -1) {
          let j = this.selected.indexOf(this.cards[i]);
          if (j !== -1) {
            this.selected.splice(j, 1);
          }
          else {
            this.selected.push(this.cards[i]);
          }
          this.refresh();
        }
        break;
    }

    // Generate some offsets for seleted card
    while (this.selected.length > this.offsets.length) {
      const rand = Math.random();
      this.offsets.push((start: Vector3, t: number) => (new Vector3(
        start.x + lerp(-0.4, 0.4, t),
        start.y + 0.2 + (rand - 0.5) * 0.2,
        start.z + -(rand - 0.5) * 0.2,
      )))
    }
  }

  handleMouseMove(e: MouseEvent) {
    if (this.env.mousedown) {

      for(let i = 0; i < this.selected.length; i++) {
        const card = this.selected[i];
        const position = this.offsets[i](this.env.worldMouse, (i+1)/(this.selected.length+1));
        card.position.set(position.x, position.y, position.z);
        // if (manager.inPlay()) { // Inside the 'play area'
        //   card.outlineMesh.visible = true;
        //   const m = card.outlineMesh.material as MeshBasicMaterial;
        //   if (m) m.color.setColorName('green');
        // }
        // else {
        //   card.outlineMesh.visible = false;
        // }
      }
    }
  }

  handleMouseUp(e: MouseEvent) {
    switch(e.button) {

      case 0:

        // Remove from environment and submit for play
        // if (this.selected.length > 0 && manager.inPlay()) {

        //   manager.playCards(this.selected)
        //     .then(() => { // Cards were played successfully

        //       this.cards = this.cards.filter(c => !this.selected.includes(c));
        //       this.selected.forEach(card => {
        //         card.onFocused(false);
        //         this.env.remove(card);
        //       })
        //       manager.addCardsToField(this.selected);
        //       this.selected = [];
        //       this.refresh();

        //     })
        //     .catch(err => {

        //       this.selected.forEach(card => {

        //         card.onFocused(false);
        //         const m = card.outlineMesh.material as MeshBasicMaterial;
        //         m.color.setColorName('blue');
        //         card.outlineMesh.visible = false;

        //       })

        //       this.refresh();

        //     });
        // }
        // else {
        //   this.selected.forEach(card => {

        //     const m = card.outlineMesh.material as MeshBasicMaterial;
        //     m.color.setColorName('blue');
        //     card.outlineMesh.visible = false;

        //   })
        // }
        break;
    }

  }

}
*/