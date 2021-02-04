import { io, Socket } from 'socket.io-client';
import { Message } from 'common';

type Handler = (...args: any[]) => void;

/** A simple socket.io wrapper, restricting sent messages to
 *  Message.Type
 */
export class Connection {
  private _socket: Socket;

  // Don't destroy?
  constructor(url: string, config: Message.Base) {
    console.log('connect', url);
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