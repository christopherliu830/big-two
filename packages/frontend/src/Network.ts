import { io, Socket } from 'socket.io-client';
import { Message } from 'common';
import Emitter from 'component-emitter';

type Handler = (...args: any[]) => void;

// interface Network {
//   socket: Socket;

//   connect(url: string, config: Message.Base, cb: () => void): void;
//   send(data: Message.Base, callback?: Function): void;
//   on(action: Message.Type, handler: Handler): any;
//   off(action: Message.Type, handler: Handler): void;
//   _queuedHandlers: Array<{ action: Message.Type; handler: Handler }>;
// }

/** A simple socket.io wrapper, restricting sent messages to
 *  Message.Type
 */
export class Connection {
  private _socket: Socket;

  // Don't destroy?
  constructor(url: string, config: Message.Base) {
    this._socket = io(url);

    this.once(Message.Type.Connect, () => {
      this.send(config);
    });

    this._socket.onAny((...args: unknown[]) => {
      console.log('Received:\n', ...args);
    });
  }

  send(message: Message.Base): Socket {
    return this._socket.emit(message.header, message.payload, message.callback);
  }

  on(type: Message.Type, handler: Handler): void {
    this._socket.on(type, handler);
    console.log(
      `Registered handler for ${type}, now ${
        this._socket.listeners(type).length
      }. Handler is: \n${handler}`
    );
  }

  once(type: Message.Type, handler: Handler): void {
    this._socket.once(type, handler);
  }

  off(type: Message.Type, handler: Handler): void {
    this._socket.off(type, handler);
    console.log(
      `Deregistered handler for ${type} now ${
        this._socket.listeners(type).length
      }`
    );
  }

  close(): Socket {
    return this._socket.disconnect();
  }
}

// export const Network: Network = {
//   socket: null,
//   _queuedHandlers: [],

//   connect(this: Network, url, config, cb) {
//     if (!this.socket) this.socket = io(url);
//     this.socket.connect();

//     this._queuedHandlers.forEach(({ action, handler }) => {
//       this.socket.on(action, handler);
//     });
//     this._queuedHandlers.length = 0;

//     this.socket.on(Message.Type.Connect, () => {
//       this.send(config);
//       cb();
//     });
//   },

//   send(this: Network, data, callback?: Function) {
//     this.socket.emit(data.header, data.payload, callback);
//   },

//   on(this: Network, action, handler) {
//     console.log('on', action, handler);
//     if (!this.socket) return this._queuedHandlers.push({ action, handler });
//     return this.socket.on(action, handler);
//   },

//   off(this: Network, action, handler) {
//     return this.socket.off(action, handler);
//   },
// };
