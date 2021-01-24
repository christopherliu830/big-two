import { ISimpleEvent, SimpleEventDispatcher } from 'strongly-typed-events';

interface Vector2 {
  x: number,
  y: number,
}

interface MouseMoveEvent {
  event: MouseEvent,
  position: Vector2;
}

interface InputHandler {

  initialize: (el:HTMLElement) => void;

  /** The mouse position in normalized DOM coordinates. */
  mousePosition: Vector2;

  /** Is the mouse pressed? */
  mouseDown: boolean;

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
}

export const Input: InputHandler = {

  mousePosition: { x: 0, y: 0 },
  mouseDown: false,

  _onMouseMove: new SimpleEventDispatcher<MouseMoveEvent>(),
  _onMouseUp: new SimpleEventDispatcher<MouseEvent>(),
  _onMouseDown: new SimpleEventDispatcher<MouseEvent>(),

  _domEl: null,
  onMouseDown: null,
  onMouseMove: null,
  onMouseUp: null,

  initialize(el?: HTMLElement) {
    this._domEl = el;
    let elOrWindow = el || window;
    elOrWindow.onmousemove = event => this._handleMouseMove(event);
    elOrWindow.onmouseup = event => this._onMouseUp.dispatch(event);
    elOrWindow.onmousedown = event => this._onMouseDown.dispatch(event);
    this.onMouseDown = this._onMouseDown.asEvent();
    this.onMouseMove = this._onMouseDown.asEvent();
    this.onMouseUp = this._onMouseDown.asEvent();
  },
  
  _handleMouseMove(event: MouseEvent) {
    if (this._domEl) {
      const { clientWidth: w, clientHeight: h } = this._domEl;
      this.mousePosition.x = (event.offsetX / w) * 2 - 1;
      this.mousePosition.y = -(event.offsetY / h) * 2 + 1;
    }
    else {
      const { innerWidth: w, innerHeight: h } = window;
      this.mousePosition.x = (event.clientX / w) * 2 - 1;
      this.mousePosition.y = -(event.clientY / h) * 2 + 1;
    }
    this._onMouseMove.dispatch({event: event, position: this.mousePosition});
  }

}