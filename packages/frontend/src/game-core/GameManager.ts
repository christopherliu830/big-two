import Environment from './Environment';
import { Input } from './Input';
import { Card, Message } from 'common';
import { Network } from '../Network';

interface GameManager {
  handZ: number,
  stackHeight: number,
  environment: Environment, 
  started: boolean,
  players: Array<any>,

  initialize: (domEl: HTMLCanvasElement) => void;
  play: (card: Card.Card) => void;
  setupPlayers(payload: Message.SessionsData.Payload): void;

}

export const GameManager: GameManager = {

  // Configuration, TODO: move elsewhere
  handZ: 3,
  stackHeight: 0,

  environment: null,
  started: false,
  players: [],

  /** Initialize the environment */
  initialize(this: GameManager, domEl) {
    if (this.started) return console.error('Manager already initialized!');
    this.started = true;
    Input.initialize(domEl);
    this.environment = new Environment(domEl);
    Network.on(Message.Type.SessionsData, (payload) => this.setupPlayers(payload));
  },

  play(this: GameManager, card) {
    console.log('I\'m playing', card);
    this.stackHeight++;
  },

  setupPlayers(this: GameManager, payload: Message.SessionsData.Payload) {
    this.players = payload.sessions;
    this.environment.updatePlayers(payload);
  },
}
