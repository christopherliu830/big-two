import { v4 as uuid } from 'uuid';

export namespace Card {
  export enum Suit {
    Hidden = -1,
    Diamond = 0,
    Club = 1,
    Heart = 2,
    Spade = 3,
  }

  export enum Value {
    Hidden = -1,
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
    netId: string;
  }

  export function shuffle(cards: Card[]) {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  export function deck(): Card[] {
    const deck = [];
    for (let suit = 0; suit < 4; suit++) {
      for (let value = 0; value < 13; value++) {
        deck.push({ value, suit, netId: uuid() });
      }
    }
    return deck;
  }

  /**
   * Comparison function for sorting. 
   */
  export function compare(a: Card, b: Card) {
    if (a.value !== b.value) return a.value - b.value;
    else return a.suit - b.suit;
  }
}
