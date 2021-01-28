import { GameAction } from './actions';
import { MessageBase } from './message';

export namespace Message {
  export enum Type {
    // These three are special use for socket.io
    Connect = 'connect',
    Disconnect = 'disconnect',
    ConnectError = 'connect_error',

    // These are not
    ServerChat = 'CHAT',
    ClientChat = 'CLIENT_CHAT',
    SessionsData = 'SESSIONS_DATA',
    Join = 'JOIN',
    JoinAck = 'JOIN_ACK',
    PlayCards = 'PLAY_CARD',
    GameAction = 'GAME_ACTION',
  }
  export interface MessagePayload {}
  export class Join extends MessageBase {
    header: Type = Type.Join;
    payload: Join.Payload;

    constructor(payload: Join.Payload) {
      super();
      this.payload = payload;
    }
  }
  export namespace Join {
    export interface Payload {
      id: string;
      name: string;
      color: string;
    }
  }
  export class Chat extends MessageBase {
    header: Type = Type.ServerChat;

    payload: Chat.Payload;

    constructor(payload: Chat.Payload) {
      super();
      this.payload = payload;
    }
  }
  export namespace Chat {
    export interface Payload {
      key: string;
      message: string;
      color: string;
      sender: string;
    }
  }
  export class FromClientChat extends MessageBase {
    header: Type = Type.ClientChat;
    payload: FromClientChat.Payload;

    constructor(payload: FromClientChat.Payload) {
      super();
      this.payload = payload;
    }
  }
  export namespace FromClientChat {
    export interface Payload {
      message: string;
    }
  }
  export class SessionsData extends MessageBase {
    header: Type = Type.SessionsData;
    payload: SessionsData.Payload;

    constructor(payload: SessionsData.Payload) {
      super();
      this.payload = payload;
    }
  }
  export namespace SessionsData {
    export interface Payload {
      sessions: {
        id: string;
        name: string;
        color?: string;
        score?: number;
        me: boolean;
      }[];
    }
  }
  /** This is just the message wrapper for a GameAction */
  export class ActionMessage {
    header = Type.GameAction;
    payload: GameAction.GameAction;

    constructor(payload: GameAction.GameAction) {
      this.payload = payload;
    }
  }
}
