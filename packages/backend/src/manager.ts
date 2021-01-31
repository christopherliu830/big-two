import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { NetworkMessage as Message } from 'common';
import { Session, ClientSession, FakeSession } from './session';
import { BigTwo } from './BigTwo/BigTwo';

/**
 * Represents players and the socket object
 */
export class Table {
  id: string;
  io: Server;

  private _game = new BigTwo();

  get sessions() {
    return Object.values(this._tokens);
  }

  /**
   * Associate a uuid token (the player id) to a session object.
   * Used in socket.on('connection'), don't use this anywhere else probably.
   */
  private _tokens: { [token: string]: Session } = {};

  constructor(io: Server, id?: string) {
    this.id = id ? id : uuidv4();

    // Create a room on the socket.io server
    this.io = io.to(this.id);
  }

  join(socket: Socket, config: Message.Join.Payload) {
    const { id, name } = config;
    socket.join(this.id);

    let session: ClientSession;
    if (id in this._tokens) {
      session = this._tokens[id] as ClientSession;
      console.log('Reconnecting', session.name, 'as', name);
      session.name = config.name;
      session.color = config.color;
      session.setSocket(socket);
    } else {
      session = new ClientSession(socket, this, config);
      console.log(session.name, 'has connected');
      session.sendSessionsList(this.sessions);
      this._tokens[config.id] = session;
      this.notifySessionJoin(session);
      if (this.sessions.length > 1) this.start();
    }

    this.notifySessionJoin(session);

  }

  start() {
    while (this.sessions.length < 2) {
      const id = uuidv4();
      const config: Message.Join.Payload = {
        id: id,
        name: 'Bot',
        color: 'gray',
        table: this.id,
      };
      this._tokens[id] = new FakeSession(this, config);
    }
    this._game.start(this.sessions);
  }

  /**
   * Resend lobby data to connected sessions.
   */
  notifySessionJoin(newSession: Session) {
    const sData = new Message.SessionData({
      id: newSession.id,
      name: newSession.name,
      color: newSession.color,
      score: newSession.player.score,
    });

    this.sessions.filter(s => s.id != newSession.id).forEach(session => {
      session.send(sData);
    })
  }
}
