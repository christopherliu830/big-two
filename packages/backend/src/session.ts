import { Message, MessageBase, GameAction } from 'common';
import { Socket } from 'socket.io';
import { Table } from './manager';
import { v4 as uuid } from 'uuid';
import Player from './player';
import {
  EventDispatcher,
  SignalDispatcher,
  SimpleEventDispatcher,
} from 'strongly-typed-events';

/**
 * Use a session to associate a connected client to a socket.
 * A socket can change if the user refreshes their tab / reconnects,
 * so methods to send should be restricted to session lists.
 */
export class Session {
  id: string;
  table: Table;
  name: string;
  color: string;
  player: Player;

  _onGameAction = new EventDispatcher<Session, GameAction.GameAction>();
  get onGameAction() {
    return this._onGameAction.asEvent();
  }
  _onReconnect = new SignalDispatcher();
  get onConnect() {
    return this._onReconnect.asEvent();
  }

  get connected() {
    return this._socket.connected;
  }

  get socket(): Socket | null {
    return this._socket;
  }

  private _socket!: Socket;

  setSocket(socket: Socket) {
    if (this._socket && this._socket.id === socket.id) {
      console.log(this.name, ': reusing socket');
      return;
    }

    this._socket = socket;

    // If we're replacing the socket, it means a reconnect
    if (this._socket) this._onReconnect.dispatch();

    // Subscribe to events here
    this._socket.onAny((...args) =>
      console.log(this.name, JSON.stringify(args), '\n')
    );
    this._socket.on(Message.Type.ClientChat, (p) =>
      this._handleIncomingChat(p)
    );
    this._socket.on(Message.Type.Disconnect, (reason: string) =>
      this.onDisconnect(socket, reason)
    );
    this._socket.on(
      Message.Type.GameAction,
      this._handleIncomingGameAction.bind(this)
    );
  }

  constructor(
    socket: Socket | null,
    table: Table,
    config: Message.Join.Payload
  ) {
    const { id, name, color } = config;

    this.id = id;
    this.name = name;
    this.color = color;
    this.table = table;
    socket && this.setSocket(socket);

    this.player = new Player();
  }

  onDisconnect(socket: Socket, reason: string) {
    console.log(`${this.name} has disconnected. Reason: ${reason}`);
    this.table.updateRemoteSessions();
  }

  /**
   * Send session data to a client.
   * @param sessions The session to show in the players list
   */
  sendSessionsData(sessions: Session[]) {
    const sessionsData = new Message.SessionsData({
      sessions: sessions
        .filter((s) => s.connected)
        .map((session) => ({
          id: session.id,
          name: session.name,
          color: session.color,
          score: session.player.score,
          me: session.id === this.id,
        })),
    });
    this._socket.emit(sessionsData.header, sessionsData.payload);
  }

  /**
   *
   * @param payload Send a game action to a player
   */
  sendGameAction(poo: GameAction.GameAction) {
    const m = new Message.ActionMessage(poo);
    this._socket.emit(m.header, m.payload);
  }

  /**
   * Broadcast a socket's data to the table
   */
  private _handleIncomingChat(payload: Message.FromClientChat.Payload) {
    const message = new Message.Chat({
      key: uuid(),
      message: payload.message,
      sender: this.name,
      color: this.color,
    });
    this.table.io.emit(message.header, message.payload);
  }

  /**
   * Unpack a game action and dispatch its event
   */
  private _handleIncomingGameAction(
    payload: GameAction.GameAction,
    callback?: Function
  ) {
    payload.callback = callback;
    this._onGameAction.dispatch(this, payload);
  }
}

/**
 * A fake session for bots
 */
export class FakeSession extends Session {
  get connected() {
    return true;
  }

  constructor(table: Table, config: Message.Join.Payload) {
    super(null, table, config);
  }

  setSocket() {}

  sendSessionsData(sessions: Session[]) {}

  sendGameAction() {}
}
