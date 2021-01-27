import Environment from './Environment';
import { Input } from './Input';
import { Card, Message, GameAction } from 'common';
import { Network } from '../Network';
import { ISimpleEvent, SimpleEventDispatcher } from 'strongly-typed-events';
import Emitter from 'component-emitter';

interface GameManager extends Emitter {
  stackHeight: number,
  environment: Environment, 
  started: boolean,

  onGameAction: ISimpleEvent<GameAction.GameAction>;

  initialize: (domEl: HTMLCanvasElement) => void;
  setupPlayers(payload: Message.SessionsData.Payload): void;
  sendGameAction(p: GameAction.GameAction): void;

  _onGameAction: SimpleEventDispatcher<GameAction.GameAction>;
  _localConnections: Set<string>;
  _handleGameAction(action: GameAction.GameAction): void;
  _emitter: Emitter<GameAction.Type>

}

const GameManager: GameManager = {

  stackHeight: 0,

  environment: null,
  started: false,

  get onGameAction() {
    return this._onGameAction.asEvent();
  },

  on(event: string, ...args: any[]) {
    return this._emitter.on(event, ...args);
  },
  
  once(event: string, listener: Function) {
    return this._emitter.once(event, listener);
  },

  off(event: string, listener: Function) {
    return this._emitter.off(event, listener);
  },

  emit(event: string, ...args: any[]) {
    return this._emitter.emit(event, ...args);
  },

  hasListeners(event: string) {
    return this._emitter.hasListeners(event);
  },

  listeners(event: string) {
    return this._emitter.listeners(event);
  },

  _onGameAction: new SimpleEventDispatcher<GameAction.GameAction>(),
  _localConnections: new Set<string>(),
  _emitter: new Emitter(),

  /** Initialize the environment */
  initialize(domEl: HTMLCanvasElement) {
    if (this.started) return console.error('Manager already initialized!');
    this.started = true;
    Input.initialize(domEl);
    this.environment = new Environment(domEl);
    Network.on(Message.Type.SessionsData, this.setupPlayers.bind(this));
    Network.on(Message.Type.GameAction, this._handleGameAction.bind(this));
  },

  setupPlayers(this: GameManager, payload: Message.SessionsData.Payload) {
    // Add any new players
    payload.sessions.forEach(sessionData => {
      if (!this._localConnections.has(sessionData.id)) {
        this._localConnections.add(sessionData.id);
      }
      this.environment.updatePlayer(sessionData);
    })
  },

  sendGameAction(p: GameAction.GameAction) {
    const message = new Message.ActionMessage(p);
    Network.send(message, p.callback);
  },

  _handleGameAction(p: GameAction.GameAction) {
    this.emit(p.type, p.payload);
  }
};

export { GameManager };


