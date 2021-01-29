import { NetworkMessage, GameAction, Message } from 'common';
import { Socket } from 'socket.io';
import { Table } from './manager';
import { v4 as uuid } from 'uuid';
import Player from './player';
import * as Emitter from 'component-emitter';


/**
 * Use a session to associate a connected client to a socket.
 * A socket can change if the user refreshes their tab / reconnects,
 * so methods to send should be restricted to session lists.
 */
export abstract class Session extends Emitter {

  /**
   * The player uuid that represents this session
   */
  id: string;

  table: Table;
  name: string;
  color: string;

  /**
   * The game-state object
   */
  player: Player;

  abstract connected: boolean;
  abstract send(message: Message.Base): void;
  abstract sendSessionsList(sessions: Session[]): void;
  abstract broadcast(message: Message.Base): void;

  constructor(table: Table, config: NetworkMessage.Join.Payload) {
    super();
    const { id, name, color } = config;

    this.id = id;
    this.name = name;
    this.color = color;
    this.table = table;
    this.player = new Player();
  }
}

export class ClientSession extends Session {

  get connected() {
    return this._socket.connected;
  }
  private _socket!: Socket;

  setSocket(socket: Socket) {
    if (this._socket && this._socket.id === socket.id) {
      console.log(this.name, ': reusing socket');
      return;
    }

    this._socket = socket;

    // Forward our socket events
    this._socket.onAny((event: Message.Type, ...args: unknown[]) => {
      this.emit(event, ...args);
      console.log(this.name, '\n', JSON.stringify(args), '\n')
    })

    this.emit(Message.Type.Connect);
  }

  constructor(
    socket: Socket,
    table: Table,
    config: NetworkMessage.Join.Payload
  ) {
    super(table, config);

    socket && this.setSocket(socket);

    this.on(Message.Type.ClientChat, this._handleIncomingChat);
    this.on(Message.Type.Disconnect, this._handleDisconnect);
  }

  _handleDisconnect = (reason: string): void => {
    console.log(`${this.name} has disconnected. Reason: ${reason}`);
    this.table.notifySessionJoin(this);
  }

  /**
   * Send a message to this player
   * @param message the message to send.
   */
  send(message: Message.Base) {
    this._socket.emit(message.header, message.payload);
  }

  /**
   * Send a message to all other players.
   * @param message the message to send.
   */
  broadcast(message: Message.Base) {
    console.log(message.header, message.payload);
    this._socket.to(this.table.id).broadcast.emit(message.header, message.payload);
  }

  sendSessionsList(sessions: Session[]) {
    sessions.filter(s => s.id !== this.id).forEach(toSend => {
      const sessionData = new NetworkMessage.SessionData({
        id: toSend.id,
        name: toSend.name,
        score: toSend.player.score,
        color: toSend.color,
      })
      this.send(sessionData);
    }) 
  }

  /**
   * Broadcast a socket's data to the table
   */
  private _handleIncomingChat(payload: NetworkMessage.FromClientChat.Payload) {
    const message = new NetworkMessage.Chat({
      key: uuid(),
      message: payload.message,
      sender: this.name,
      color: this.color,
    });
    this.table.io.emit(message.header, message.payload);
  }

  /**
   * Forward any kind of data to everyone else.
   * @param payload The object to be broadcasted
   */
  private _handleBroadcastObject(payload: NetworkMessage.BroadcastData.Payload) {
    const message = new NetworkMessage.BroadcastData(payload);
    this._socket.to(this.table.id).broadcast.emit(message.header, message.payload);
  }

}

/**
 * A fake session for bots
 */
export class FakeSession extends Session {
  get connected() {
    return true;
  }
  constructor(table: Table, config: NetworkMessage.Join.Payload) {
    super(table, config);
  }

  send(action: Message.Base) { }
  sendSessionsList() {}
  broadcast(message: Message.Base) {
    this.table.io.emit(message.header, message.payload);
  }
}
