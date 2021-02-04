import { GameAction } from './actions';
import { Message } from './message';

export namespace NetworkMessage {

  export const Type = Message.Type;

  /**
   * Request to join a table message.
   */
  export class Join extends Message.Base {
    header = Join.Header;
    payload: Join.Payload;
  }
  export namespace Join {
    export const Header = Message.Type.Join;
    export interface Payload {
      id: string;
      table: string;
      name: string;
      color: string;
    }
  }


  /**
   * Used by server to send a chat to a client.
   */
  export class Chat extends Message.Base {
    header = Chat.Header;
    payload: Chat.Payload;

    constructor(payload: Chat.Payload) { super(payload) };
  }
  export namespace Chat {
    export const Header = Message.Type.ServerChat;
    export interface Payload {
      sender: string; // The name of the sender!
      key: string;
      message: string;
      color: string;
    }
  }

  /**
   * Used by client to send a chat to server.
   */
  export class FromClientChat extends Message.Base {
    header = FromClientChat.Header;
    payload: FromClientChat.Payload;
    
    constructor(payload: FromClientChat.Payload) { super(payload); }
  }
  export namespace FromClientChat {
    export const Header = Message.Type.ClientChat;
    export interface Payload {
      message: string;
    }
  }

  /**
   * Server sends this to update the connected sessions.
   */
  export class SessionData extends Message.Base {
    header = SessionData.Header;
    payload: SessionData.Payload;

    filter = () => {}

    constructor(payload: SessionData.Payload) { super(payload); }
  }
  export namespace SessionData {
    export const Header = Message.Type.SessionsData;
    export interface Payload {
      id: string;
      name: string;
      color?: string;
      score?: number;
    }
  }

  export class BroadcastData extends Message.Base {
    header = Message.Type.BroadcastData
    payload: {};
  }
  export namespace BroadcastData {
    export interface Payload extends Message.Payload { }
  }

  export class BeginTrick extends Message.Base {
    header = BeginTrick.Type;
    payload = {};

    filter = () => this;

    constructor() { super({}); }
  }
  export namespace BeginTrick {
    export const Type = Message.Type.BeginTrick;
  }

  export class GameStart extends Message.Base {
    header = GameStart.Type;
    payload = {};

    filter = () => this;

    constructor() { super({}); }
  }
  export namespace GameStart {
    export const Type = Message.Type.GameStart;
  }
}
