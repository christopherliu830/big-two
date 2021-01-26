import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Message } from 'common';
import { Session, FakeSession } from './session';
import { BigTwo } from './BigTwo/BigTwo';

/**
 * Represents players and the socket object
 */
export class Table {

  id:string;
  io:Server;

  private _game = new BigTwo();

  get sessions() {
    return Object.values(this._tokens);
  }

  /**
   * Associate a uuid token (the player id) to a session object.
   * Used in socket.on('connection'), don't use this anywhere else probably.
   */
  private _tokens: {[token: string]: Session} = {};

  constructor(io:Server, id?:string) {
    this.id = id ? id : uuidv4();

    // Create a room on the socket.io server 
    this.io = io.to(this.id);
  }

  join(socket:Socket, config: Message.Join.Payload) {
    const { id, name } = config;
    socket.join(this.id);

    let session: Session;
    if (id in this._tokens) {
      session = this._tokens[id];
      console.log('Reconnecting', session.name, 'as', name);
      session.name = config.name;
      session.color = config.color;
      session.setSocket(socket);
    }
    else {
      session = new Session(socket, this, config);
      console.log(session.name, 'has connected');
      this._tokens[config.id] = session;
      this.start();
    }

    this.updateRemoteSessions();
  }

  start() {
    while (this.sessions.length < 4) {
      const id = uuidv4();
      const config: Message.Join.Payload = {
        id: id,
        name: 'Bot',
        color: 'gray',
      }
      this._tokens[id] = new FakeSession(this, config);
    }
    this._game.start(this.sessions);
  }

  /**
   * Resend lobby data to connected sessions.
   * Only broadcast connected sessions
   */
  updateRemoteSessions() {
    this.sessions.forEach(session => session.sendSessionsData(this.sessions));
  }
}