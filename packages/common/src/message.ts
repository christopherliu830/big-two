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

  export interface Payload { }

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
    BroadcastData = 'BROADCAST_DATA',

    GameAction = 'GAME_ACTION',
    // Game Actions
    PlayCards = 'PLAY_CARDS',
    Pass = 'PASS',
    DrawCards = 'DRAW_CARDS',
  }
}
