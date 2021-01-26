import { Card } from './card';

export namespace GameAction {
  export enum Type {
    PlayCards = 'PLAY_CARDS',
    Pass = 'PASS',
    DrawCards = 'DRAW_CARDS',
  }
  export interface GameAction {
    type: GameAction.Type;
    payload: {};
  }
  export class PlayCards implements GameAction {
    type = Type.PlayCards;
    payload: PlayCards.Payload;

     constructor(action: PlayCards.Payload) {
      this.payload = action;
   }
  }
  export namespace PlayCards {
    export interface Payload {
      id: string,
      card: Card.Card,
      multiplicity: number,
    }
  }
  export class DrawCards implements GameAction {
    type = Type.DrawCards;
    payload: DrawCards.Payload;
    
    constructor(payload: DrawCards.Payload) { 
      this.payload = payload 
    };
  }
  export namespace DrawCards {
    export interface Payload {
      id: string,
      cards: Card.Card[],
    }
  }
}