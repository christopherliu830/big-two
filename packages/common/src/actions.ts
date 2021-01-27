import { Card } from './card';

export namespace GameAction {
  export enum Type {
    PlayCards = 'PLAY_CARDS',
    Pass = 'PASS',
    DrawCards = 'DRAW_CARDS',
  }
  export interface GameAction {
    type: GameAction.Type;
    payload: { id: string };
    callback?: Function;

    /**
     * If the player is getting someone else's action,
     * filter the data and hide sensitive/hidden information.
     */
    filter: () => GameAction;
  }
  export class PlayCards implements GameAction {
    type = Type.PlayCards;
    payload: PlayCards.Payload;
    callback?: Function;

    constructor(action: PlayCards.Payload) {
      this.payload = action;
    }

    filter = () => this; // I don't know what to do here yet

  }
  export namespace PlayCards {
    export interface Payload {
      id: string,
      cards: Card.Card[],
    }
  }

  /**
   * Client receives this action to display a card in their
   * environment locally.
   */
  export class DrawCards implements GameAction {
    type = Type.DrawCards;
    payload: DrawCards.Payload;
    
    constructor(payload: DrawCards.Payload) { 
      this.payload = payload 
    };

    filter = () => {
      const copy = {
        id: this.payload.id,
        cards: this.payload.cards.map(c => ({
          suit: Card.Suit.Hidden,
          value: Card.Value.Hidden,
        }))
      };
      return new DrawCards(copy);
    }
  }
  export namespace DrawCards {
    export interface Payload {
      id: string,
      cards: Card.Card[],
    }
  }
}