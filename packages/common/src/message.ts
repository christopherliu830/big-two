export namespace Message {
  export abstract class Base {
    header: string;
    payload: Payload;
    callback?: Function;
    filter?: Function;

    constructor(payload) {
      this.payload = payload;
    }
  }

  export interface Payload {}

  export interface PlayerData {
    id: string;
    name: string;
    color: string;
  }

  export enum Type {
    // These three are special use for socket.io
    Connect = "connect",
    Disconnect = "disconnect",
    ConnectError = "connect_error",

    // These are not
    ServerChat = "CHAT",
    ClientChat = "CLIENT_CHAT",
    SessionsData = "SESSIONS_DATA",
    Join = "JOIN",
    JoinAck = "JOIN_ACK",
    BroadcastData = "BROADCAST_DATA",
    GameStart = "GAME_START",
    SetOwner = "SET_OWNER",
    SetTurn = "SET_TURN",

    // Game Actions
    PlayCards = "PLAY_CARDS",
    Pass = "PASS",
    DrawCards = "DRAW_CARDS",
    BeginTrick = "BEGIN_TRICK",
  }
}
