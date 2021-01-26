import Environment from './Environment';
import { Input } from './Input';
import { Card, Message, GameAction } from 'common';
import { Network } from '../Network';
import { ISimpleEvent, SimpleEventDispatcher } from 'strongly-typed-events';
import Emitter from 'component-emitter';

interface GameManager {
  handZ: number,
  stackHeight: number,
  environment: Environment, 
  started: boolean,
  players: Array<any>,

  onGameAction: ISimpleEvent<GameAction.GameAction>;
  _onGameAction: SimpleEventDispatcher<GameAction.GameAction>;

  initialize: (domEl: HTMLCanvasElement) => void;
  play: (card: Card.Card) => void;
  setupPlayers(payload: Message.SessionsData.Payload): void;

  _handleGameAction(action: GameAction.GameAction): void;

}

const Base: GameManager = {

  // Configuration, TODO: move elsewhere
  handZ: 3,
  stackHeight: 0,

  environment: null,
  started: false,
  players: [],
  get onGameAction() {
    return this._onGameAction.asEvent();
  },
  _onGameAction: new SimpleEventDispatcher<GameAction.GameAction>(),

  /** Initialize the environment */
  initialize(domEl: HTMLCanvasElement) {
    if (this.started) return console.error('Manager already initialized!');
    this.started = true;
    Input.initialize(domEl);
    this.environment = new Environment(domEl);
    Network.on(Message.Type.SessionsData, (payload) => this.setupPlayers(payload));
    Network.on(Message.Type.GameAction, (action: GameAction.GameAction) => {
      // Forward the game event
      console.log(action);
      console.log(action.type);
      console.log(this.hasListeners(action.type))
      this.emit(action.type, action.payload);
    });
  },

  play(card: Card.Card) {
    console.log('I\'m playing', card);
    const action = new GameAction.PlayCards({
      card: card,
      multiplicity: 1,
    });
    this.stackHeight++;
  },

  setupPlayers(this: GameManager, payload: Message.SessionsData.Payload) {
    this.players = payload.sessions;
    this.environment.updatePlayers(payload);
  },

  _handleGameAction(p: GameAction.GameAction) {
    this.emit(p.type, p.payload);
  }
};

const GameManager = Emitter(Base) as GameManager & Emitter<GameAction.Type>;

export { GameManager };


