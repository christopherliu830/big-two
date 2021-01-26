import { GameAction } from './src/actions';
import { Message } from './src/network-message';
import { MessageBase } from './src/message';
declare namespace Card {
    enum Suit {
        Diamond = 0,
        Club = 1,
        Heart = 2,
        Spade = 3
    }
    enum Value {
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
        Two = 12
    }
    interface Card {
        suit: Suit;
        value: Value;
    }
    function deck(): Card[];
}
export { GameAction, Message, MessageBase, Card };
/**
 * Shared message types between front and backend.
 * When sending in socket.io, create a subclassed Message and send
 * using .header and .payload.
 * When receiving, call .on(type, payload: Message.Payload)
 */
export interface PlayerConfig {
    id: string;
    name: string;
    color: string;
}
