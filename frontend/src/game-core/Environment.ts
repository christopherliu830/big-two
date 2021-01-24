import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Input } from './Input';
import { ISimpleEvent, SimpleEventDispatcher } from 'strongly-typed-events';

class Environment {
  // three.js stuff
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;

  // game objects
  gameObjects: GameObject[]=[];

  // performance
  fixedTimestep = .01;

  mouse:THREE.Vector2 = new THREE.Vector2();
  worldMouse:THREE.Vector3 = new THREE.Vector3();
  meshToGO: Record<string, GameObject> = {};

  intersected: {
    gameObject: GameObject,
    intersection: THREE.Intersection,
  }[] = [];
  current: {
    gameObject?: GameObject,
    hit?: THREE.Intersection,
  }={};
  mousedown: boolean;
  raycaster:THREE.Raycaster = new THREE.Raycaster();

  private _toRemove:{object:GameObject, keepInScene:boolean}[]=[];

  constructor(el: HTMLCanvasElement) {
    window.onresize = () => this.onResize();
    this.initScene(el);
  }

  add(obj:GameObject) {
    this.gameObjects.push(obj);
    obj.env = this;
    if (obj.mesh) {
      this.scene.add(obj.mesh);
      this.meshToGO[obj.mesh.uuid] = obj;
    }
  }

  private processRemovals() {
    this._toRemove.forEach(data => {
      const { object, keepInScene } = data;
      const index = this.gameObjects.indexOf(object);
      if (index > -1) this.gameObjects.splice(index, 1);
      if (!keepInScene) this.scene.remove(object.mesh);
      delete this.meshToGO[object.mesh.uuid];
    })
    this._toRemove = [];
  }

  remove(obj:GameObject, keepInScene:boolean=false) {
    this._toRemove.push({object:obj, keepInScene});
  }

  update() {
    this.gameObjects.forEach(g => g.update());

    this.processRemovals();
  }

  handleMouseDown(e: MouseEvent) {
    e.preventDefault();
    if (e.button === 0) this.mousedown = true;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.gameObjects.forEach(g => g.handleMouseDown(e));
  }

  handleMouseUp(e: MouseEvent) {
    this.mousedown = false;
    switch(e.button) {
      case 1:
        this.mousedown = true;
        break;
    }

    this.gameObjects.forEach(g => g.handleMouseUp(e));
  }

  handleMouseMove(e: MouseEvent) {
    // Update mouse position
    const mouse = new THREE.Vector2();
    const { clientWidth, clientHeight } = document.querySelector("canvas");
    mouse.x = (e.offsetX / clientWidth) * 2 - 1;
    mouse.y = -(e.offsetY / clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(mouse, this.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const target = new THREE.Vector3;
    this.raycaster.ray.intersectPlane(plane, target);
    if (target) this.worldMouse = target;

    const ints = this.raycaster.intersectObjects(this.scene.children);

    if (ints.length > 0) {
      const gameObject = this.meshToGO[ints[0].object.uuid];
      if (gameObject) {
        if (!this.current.hit) {
          this.current = { 
            hit: ints[0],
            gameObject: gameObject
          };
          this.current.gameObject.onFocused(true);
        }
        else if (this.current.hit.object !== ints[0].object) {
          this.current.gameObject.onFocused(false);
          this.current = { 
            hit: ints[0],
            gameObject: gameObject
          };
          this.current.gameObject.onFocused(true);
        }
      }
      else {
        this.current.gameObject && this.current.gameObject.onFocused(false);
        this.current = {
          hit: null,
          gameObject: null,
        }
      }
    }
    else {
      this.current.gameObject && this.current.gameObject.onFocused(false);
      this.current = {
        hit: null,
        gameObject: null,
      }
    }

    this.gameObjects.forEach(g => g.handleMouseMove(e));
  }

  initScene(el:HTMLCanvasElement) {
    console.log(el);

    this.renderer = new THREE.WebGLRenderer({canvas: el});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0xa8caff); // Light blue

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 999, 0.1, 1000);
    this.camera.position.set(0, 5, 2);
    this.camera.lookAt(0, 0, 0);

    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(300, 2000, 1000);
    light.castShadow = true;
    light.shadow.camera.top = 5;
    light.shadow.camera.bottom = -5;
    light.shadow.camera.left = -5;
    light.shadow.camera.right = 5;
    light.shadow.camera.near = 75;
    light.shadow.camera.far = 4000;
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.bias = 0.0000037;
    this.scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);
    this.camera.aspect = el.clientWidth / el.clientHeight;
    this.camera.updateProjectionMatrix();

    requestAnimationFrame(() => this.animate());
  }

  onResize() {
    const width = this.renderer.domElement.clientWidth;
    const height = this.renderer.domElement.clientHeight;

    if (this.renderer && this.camera) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width/height;
      this.camera.updateProjectionMatrix();
    }
  }

  animate(time?:number) {
    requestAnimationFrame(() => this.animate());
    TWEEN.update(time);
    this.renderer.render(this.scene, this.camera);
  }

  get target() {
    if (this.intersected.length < 0) return 0;
    return this.intersected[0]
  }
}

export class GameObject {
  mesh:THREE.Mesh;
  env:Environment;
  collisionsEnabled:boolean = true;

  constructor() {
  }

  get position() {
    return this.mesh.position;
  }

  testCollision(other:GameObject):boolean {
    if (!this.collisionsEnabled || !other.collisionsEnabled) return false;
    const a = this.mesh.geometry.boundingBox.clone();
    a.applyMatrix4(this.mesh.matrixWorld);
    const b = other.mesh.geometry.boundingBox.clone();
    b.applyMatrix4(other.mesh.matrixWorld);
    return a.intersectsBox(b);
  }

  /**
   * Fields like environment, mesh, etc. are set in init call (as opposed to constructor).
   */
  init():void{
  }

  update():void{ };
  fixedUpdate():void{ };
  lateUpdate():void{ };
  handleMouseMove(e:MouseEvent){ };
  handleMouseDown(e:MouseEvent){ };
  handleMouseUp(e:MouseEvent){ }
  onCollision(other:GameObject){ };
  onFocused(isFocused:boolean){ };
}

export default Environment;
