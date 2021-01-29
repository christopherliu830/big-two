import Emitter from 'component-emitter';
import { Connection } from '../Network';

export enum Input {
  Select = 'SELECT',
  Unselect = 'UNSELECT',

}

export class TypedEmitter<T extends string> implements Emitter<T> {
  private _emitter: Emitter<T> = new Emitter();

  on = (event: T, listener: Function) => {
    return this._emitter.on(event, listener);
  };

  off = (event: T, listener: Function) => {
    return this._emitter.off(event, listener);
  };

  once = (event: T, listener: Function) => {
    return this._emitter.once(event, listener);
  };

  hasListeners = (event: T) => {
    return this._emitter.hasListeners(event);
  };

  listeners = (event: T) => {
    return this._emitter.listeners(event);
  };

  emit = (event: T, ...args: any[]) => {
    return this._emitter.emit(event, args);
  }
}
