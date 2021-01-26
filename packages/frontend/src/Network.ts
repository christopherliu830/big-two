import { io, Socket } from 'socket.io-client';
import { MessageBase, Message } from 'common';
import { ISignal, SignalDispatcher } from'strongly-typed-events';


type Handler = (...args: any[]) => void;

interface Network {
  socket: Socket,

  connect(url: string, config: Message.Join , cb: () => void): void;
  send(data: MessageBase): void;
  on(action: Message.Type, handler: Handler): any;
  off(action: Message.Type, handler: Handler): void;
  close(): void;

  _queuedHandlers: Array<{action: Message.Type, handler: Handler}>;

};

/** A simple socket.io wrapper, restricting sent messages to
 *  Message.Type
 */
export const Network: Network = {
  socket: null,
  _queuedHandlers: [],

  connect(this: Network, url, config, cb) {
    console.log('connecting to ', url);
    this.socket = io(url);
    this.socket.connect();

    this._queuedHandlers.forEach(({action, handler}) => {
      this.socket.on(action, handler);
    });
    this._queuedHandlers.length = 0;

    this.socket.on(Message.Type.Connect, () => {
      this.send(config);
      cb();
    })

    this.socket.onAny((...args) => {
      console.log('Received', args);
    })
  },

  send(this: Network, data) {
    console.log('sending', data);
    this.socket.emit(data.header, data.payload);
  },

  on(this: Network, action, handler) {
    if (!this.socket) return this._queuedHandlers.push({action, handler});
    return this.socket.on(action, handler);
  },
  
  off(this: Network, action, handler) {
    return this.socket.off(action, handler);
  },

  close(this: Network) {
    this.socket.close();
  }

}