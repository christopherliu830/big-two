import { Mesh, Object3D } from 'three';
import Environment from './Environment';

export abstract class InteractableObject extends Object3D {
  abstract onMouseEnter(e: Environment): void;

  abstract onMouseExit(e: Environment): void;

  abstract onMouseDown(e: Environment): void;

  abstract onMouseUp(e: Environment): void;

  static is(obj: Object3D | InteractableObject): obj is InteractableObject {
    return (obj as InteractableObject).onMouseEnter !== undefined;
  }
}
