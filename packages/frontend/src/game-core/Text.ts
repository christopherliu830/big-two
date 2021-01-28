import { Vector3 } from 'three';

// TODO: Don't do this...
const style = `
  position: absolute;
  background-color: white;
  pointer-events: none;
  transform: translateX(-50%);
`;

export class GameText {
  /**
   * Creates absolutely positioned text.
   * @param text
   * @param position The position as a percentage from left, top on root
   * @param root Containing element.
   */
  static Create(
    text: string,
    position: { x: number; y: number },
    root: HTMLElement
  ) {
    const el = document.createElement('div');
    el.innerHTML = text;
    el.style.cssText = style;
    root.appendChild(el);
    el.style.left = `${position.x * 100}%`;
    el.style.top = `${position.y * 100}%`;
    return el;
  }
}
