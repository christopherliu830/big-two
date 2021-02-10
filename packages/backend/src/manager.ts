import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { NetworkMessage as Message, NetworkMessage } from "common";
import { Session, ClientSession, FakeSession } from "./session";
import { BigTwo } from "./BigTwo/BigTwo";

/**
 * Represents players and the socket object
 */
export class Table {
  id: string;
  io: Server;

  private _game = new BigTwo();
  private _ownerid: string;

  get sessions() {
    return Object.values(this._tokens);
  }

  /**
   * Associate a uuid token (the player id) to a session object.
   * Used in socket.on('connection'), don't use this anywhere else probably.
   */
  private _tokens: { [token: string]: Session } = {};

  constructor(io: Server, id: string, ownerid: string) {
    this.id = id;

    // Create a room on the socket.io server
    this.io = io.to(this.id);
    this._ownerid = ownerid;
  }

  join(socket: Socket, config: Message.Join.Payload) {
    const { id, name } = config;
    socket.join(this.id);

    let session: ClientSession;
    if (id in this._tokens) {
      session = this._tokens[id] as ClientSession;
      console.log("Reconnecting", session.name, "as", name);
      session.name = config.name;
      session.color = config.color;
      session.setSocket(socket);
      if (config.id === this._ownerid) {
        this.hookOwner(session);
        session.send(new NetworkMessage.SetOwner());
      }
    } else {
      session = new ClientSession(socket, this, config);
      console.log(session.name, "has connected");
      this._tokens[config.id] = session;
      if (config.id === this._ownerid) {
        this.hookOwner(session);
        session.send(new NetworkMessage.SetOwner());
      }
    }

    session.sendSessionsList(this.sessions);

    this.notifySessionJoin(session);
  }

  /**
   * Give the first person to join owner privileges.
   * Right now that means we listen for their command to start the game.
   */
  hookOwner(session: Session) {
    session.once(
      Message.FromClientChat.Header,
      (payload: NetworkMessage.FromClientChat.Payload) => {
        if (payload.message === "/start") {
          this.start();
        }
      }
    );
  }

  start() {
    while (this.sessions.length < 2) {
      const id = uuidv4();
      const config: Message.Join.Payload = {
        id: id,
        name: "Bot",
        color: "gray",
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

    this.sessions
      .filter((s) => s.id != newSession.id)
      .forEach((session) => {
        session.send(sData);
      });
  }
}
