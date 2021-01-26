import { GameAction } from './src/actions';
import { Message } from './src/network-message';
import { MessageBase } from './src/message';

namespace Card {

  export enum Suit {
    Diamond = 0,
    Club = 1,
    Heart = 2,
    Spade = 3,
  }

  export enum Value {
    Three = 0,
    Four = 1,
    Five = 2,
    Six = 3,
    Seven = 4,
    Eight = 5,
    Nine = 6,
    Ten = 7,
    Jack = 8,
    Queen = 9,
    King = 10,
    Ace = 11,
    Two = 12,
  }

  export interface Card {
    suit: Suit;
    value: Value;
  }

}


export { 
  GameAction, 
  Message, 
  MessageBase, 
  Card
};


/**
 * Shared message types between front and backend.
 * When sending in socket.io, create a subclassed Message and send
 * using .header and .payload.
 * When receiving, call .on(type, payload: Message.Payload)
 */
 
export interface PlayerConfig {
  id: string; // player uuid
  name: string;
  color: string;
}