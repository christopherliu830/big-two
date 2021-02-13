import { NetworkMessage, Message } from 'common';
import { Socket } from 'socket.io';
import { Table } from './manager';
import { v4 as uuid } from 'uuid';
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

  get sessionMessage(): NetworkMessage.SessionData {
    return new NetworkMessage.SessionData({
      player: {
        id: this.id,
        name: this.name,
        color: this.color,
      },
      score: this.score,
    });
  }

  abstract get score(): number;
  abstract set score(value: number);
  abstract connected: boolean;
  abstract send(message: Message.Base): void;
  abstract close(): void;
  abstract sendSessionsList(sessions: Session[]): void;
  abstract sendSystemChat(chat: string): void;
  abstract broadcast(message: Message.Base): void;

  constructor(table: Table, config: NetworkMessage.Join.Payload) {
    super();
    const { id, name, color } = config.player;

    this.id = id;
    this.name = name;
    this.color = color;
    this.table = table;
  }

  sendAll(message: Message.Base): void {
    this.table.io.to(this.table.id).emit(message.header, message.payload);
  }
}

export class ClientSession extends Session {
  get connected(): boolean {
    return this._socket.connected;
  }
  private _socket!: Socket;
  private _score = 0;

  get score(): number {
    return this._score;
  }
  set score(value: number) {
    this._score = value;
    this.sendAll(this.sessionMessage);
  }

  constructor(
    socket: Socket,
    table: Table,
    config: NetworkMessage.Join.Payload
  ) {
    super(table, config);

    socket && this.setSocket(socket);

    this.on(Message.Type.ClientChat, this._handleIncomingChat);
  }

  setSocket(socket: Socket): void {
    if (this._socket && this._socket.id === socket.id) {
      console.log(this.name, ': reusing socket');
      return;
    }

    this._socket = socket;

    // Forward our socket events
    this._socket.onAny((event: Message.Type, ...args: unknown[]) => {
      this.emit(event, ...args);
      console.log(this.name, '\n', JSON.stringify(args), '\n');
    });
    this._socket.on(Message.Type.Disconnect, this._handleDisconnect);

    this.emit(Message.Type.Connect);
  }

  private _handleDisconnect = (reason: string): void => {
    console.log(`${this.name} has disconnected. Reason: ${reason}`);
    this.table.onDisconnect(this);
    this.table.notifySessionJoin(this);
  };

  close(): void {
    this._socket.disconnect();
  }

  /**
   * Send a message to this player
   * @param message the message to send.
   */
  send(message: Message.Base): void {
    if (!message.header) throw Error('No Message Header');
    console.log('emitting', message.header, 'to', this.name);
    this._socket.emit(message.header, message.payload);
  }

  /**
   * Send a message to all other players.
   * @param message the message to send.
   */
  broadcast(message: Message.Base): void {
    console.log(message.header, message.payload);
    this._socket
      .to(this.table.id)
      .broadcast.emit(message.header, message.payload);
  }

  /**
   * Send the list of sessions to a player. This includes the session itself.
   * @param sessions The sessions list.
   */
  sendSessionsList(sessions: Session[]): void {
    sessions.forEach((toSend) => {
      const sessionData = new NetworkMessage.SessionData({
        player: {
          id: toSend.id,
          name: toSend.name,
          color: toSend.color,
        },
        score: toSend.score,
      });
      this.send(sessionData);
    });
  }

  /**
   * Send a chat from the server.
   * @param payload
   */
  sendSystemChat(chat: string): void {
    const message = new NetworkMessage.Chat({
      key: uuid(),
      message: chat,
      player: {
        id: 'System',
        color: 'gray',
        name: 'System',
      },
    });
    this._socket.emit(message.header, message.payload);
  }

  /**
   * Broadcast a socket's chat to the table
   */
  private _handleIncomingChat(
    payload: NetworkMessage.FromClientChat.Payload
  ): void {
    if (payload.message[0] === '/') {
      // Ignore command messages
      return;
    }
    const message = new NetworkMessage.Chat({
      key: uuid(),
      message: payload.message,
      player: {
        id: this.id,
        name: this.name,
        color: this.color,
      },
    });
    this.table.io.to(this.table.id).emit(message.header, message.payload);
  }
}

/**
 * A fake session for bots
 */
export class FakeSession extends Session {
  private _score = 0;
  private _connected = true;

  get connected(): boolean {
    return this._connected;
  }

  get score(): number {
    return this._score;
  }
  set score(value: number) {
    this._score = value;
    this.sendAll(this.sessionMessage);
  }

  constructor(table: Table, config: NetworkMessage.Join.Payload) {
    super(table, config);
  }

  close(): void {
    this._connected = false;
    this.table.onDisconnect(this);
  }

  send(): void {
    return;
  }

  sendSessionsList(): void {
    return;
  }

  sendSystemChat(message: string): void {
    console.log(this.name, 'received:', message);
  }

  broadcast(message: Message.Base): void {
    this.table.io.to(this.table.id).emit(message.header, message.payload);
  }
}
