export namespace Card {

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

  export function deck(): Card[] {
    const deck = [];
    for(let value in Value) {
      for(let suit in Suit) {
        deck.push({value, suit})
      }
    }
    return deck;
  }

}