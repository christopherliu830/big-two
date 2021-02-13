import { Card } from "./card";
import { Message } from "./message";

export namespace GameAction {
  export interface GameAction extends Message.Base {
    header: Message.Type;
    payload: GameAction.Payload;
    /**
     * If the player is getting someone else's action,
     * filter the data and hide sensitive/hidden information.
     */
    filter: () => GameAction;
  }

  export interface Payload extends Message.Payload {
    id: string;
  }

  export class PlayCards implements GameAction {
    header = PlayCards.Type;
    payload: PlayCards.Payload;
    callback?: Function;

    constructor(action: PlayCards.Payload) {
      this.payload = action;
    }

    filter = () => this;
  }
  export namespace PlayCards {
    export const Type = Message.Type.PlayCards;
    export interface Payload extends GameAction.Payload {
      cards: Card.Card[];
    }
  }

  /**
   * Client receives this action to display a card in their
   * environment locally.
   */
  export class DrawCards implements GameAction {
    header = DrawCards.Type;
    payload: DrawCards.Payload;

    constructor(payload: DrawCards.Payload) {
      this.payload = payload;
    }

    filter = () => {
      const copy = {
        id: this.payload.id,
        cards: this.payload.cards.map((c) => ({
          suit: Card.Suit.Hidden,
          value: Card.Value.Hidden,
          netId: c.netId,
        })),
      };
      return new DrawCards(copy);
    };
  }
  export namespace DrawCards {
    export const Type = Message.Type.DrawCards;
    export interface Payload extends GameAction.Payload {
      cards: Card.Card[];
    }
  }

  export class ClearHand implements GameAction {
    header = ClearHand.Type;
    payload: GameAction.Payload;

    constructor(payload: GameAction.Payload) {
      this.payload = payload;
    }
    filter = () => this;
  }
  export namespace ClearHand {
    export const Type = Message.Type.ClearHand;
    export type Payload = GameAction.Payload;
  }
}
