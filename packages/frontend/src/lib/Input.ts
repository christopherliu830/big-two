import { Message } from 'common';
import { ISimpleEvent, SimpleEventDispatcher } from 'strongly-typed-events';

interface Vector2 {
  x: number;
  y: number;
}

export interface MouseMoveEvent {
  event: MouseEvent;
  x: number;
  y: number;
}

interface InputHandler {
  initialize: (el: HTMLElement) => void;

  /** The mouse position in normalized DOM coordinates. */
  mousePosition: Vector2;

  /** Which mouse button is pressed? */
  mouseDown: number;

  /** the DOM's mouse event */
  onMouseDown: ISimpleEvent<MouseEvent>;

  /** the DOM's mouse event */
  onMouseUp: ISimpleEvent<MouseEvent>;

  /** the DOM's mouse event */
  onMouseMove: ISimpleEvent<MouseMoveEvent>;

  _domEl: HTMLElement;
  _onMouseDown: SimpleEventDispatcher<MouseEvent>;
  _onMouseUp: SimpleEventDispatcher<MouseEvent>;
  _onMouseMove: SimpleEventDispatcher<MouseMoveEvent>;
  _handleMouseMove: (event: MouseEvent) => void;
  _handleMouseDown: (event: MouseEvent) => void;
  _handleMouseUp: (event: MouseEvent) => void;
}

export const Input: InputHandler = {
  mousePosition: { x: 0, y: 0 },
  mouseDown: -1,

  _onMouseMove: new SimpleEventDispatcher<MouseMoveEvent>(),
  _onMouseUp: new SimpleEventDispatcher<MouseEvent>(),
  _onMouseDown: new SimpleEventDispatcher<MouseEvent>(),

  _domEl: null,
  onMouseDown: null,
  onMouseMove: null,
  onMouseUp: null,

  initialize(el?: HTMLElement) {
    this._domEl = el;
    const elOrWindow = el || window;
    elOrWindow.onmousemove = (event) => this._handleMouseMove(event);
    elOrWindow.onmousedown = (event) => this._handleMouseDown(event);
    elOrWindow.onmouseup = (event) => this._handleMouseUp(event);
    this.onMouseDown = this._onMouseDown.asEvent();
    this.onMouseMove = this._onMouseMove.asEvent();
    this.onMouseUp = this._onMouseUp.asEvent();
  },

  _handleMouseDown(event: MouseEvent) {
    this.mouseDown = event.button;
    this._onMouseDown.dispatch(event);
  },

  _handleMouseUp(event: MouseEvent) {
    this.mouseDown = -1;
    this._onMouseUp.dispatch(event);
  },
  _handleMouseMove(event: MouseEvent) {
    if (this._domEl) {
      const { clientWidth: w, clientHeight: h } = this._domEl;
      this.mousePosition.x = (event.offsetX / w) * 2 - 1;
      this.mousePosition.y = -(event.offsetY / h) * 2 + 1;
    } else {
      const { innerWidth: w, innerHeight: h } = window;
      this.mousePosition.x = (event.clientX / w) * 2 - 1;
      this.mousePosition.y = -(event.clientY / h) * 2 + 1;
    }
    this._onMouseMove.dispatch({
      event,
      x: this.mousePosition.x,
      y: this.mousePosition.y,
    });
  },
};

export interface EnvironmentEvent {
  event: MouseEvent;
  hit: RaycastHit;
}

export interface RaycastHit {
  object: THREE.Object3D;
  point: THREE.Vector3;
  distance: number;
}

export abstract class InputOutput {
  abstract get onMouseMove(): ISimpleEvent<EnvironmentEvent>;

  abstract get onMouseDown(): ISimpleEvent<EnvironmentEvent>;

  abstract get onMouseUp(): ISimpleEvent<EnvironmentEvent>;

  abstract submit(message: Message.Base): void;

  mouseDown: number;
}
