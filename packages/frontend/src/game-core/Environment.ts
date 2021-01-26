import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Input, MouseMoveEvent } from './Input';
import { EventDispatcher, SignalDispatcher, SimpleEventDispatcher } from 'strongly-typed-events';
import { CardAvatar } from './Card';
import { HandAvatar } from './Hand';
import { GameAction } from 'common';
import { GameManager } from './GameManager';
import { GameText } from './Text';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { Vector3 } from 'three';


const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
let l: HTMLDivElement = document.createElement('div');

// TODO: Put this somewhere else
const config = { 
  playerPositions: {
    me: new THREE.Vector3(0, 0, 3),
    others: [
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(0, 0, -3),
      new THREE.Vector3(3, 0, 0),
    ]
  }
}

export interface RaycastHit {
  object: THREE.Object3D;
  point: THREE.Vector3;
  distance: number;
}

interface EnvironmentEvent {
  event: MouseEvent;
  hit: RaycastHit;
}

class Environment {

  static raycaster = new THREE.Raycaster();

  // three.js stuff
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;

  static worldMouse:THREE.Vector3 = new THREE.Vector3();

  static get onMouseMove() {
    return Environment._onMouseMove.asEvent();
  }
  static get onMouseUp() {
    return Environment._onMouseUp.asEvent();
  }
  static get onMouseDown() {
    return Environment._onMouseDown.asEvent();
  }

  private static _onMouseMove = new SimpleEventDispatcher<EnvironmentEvent>();
  private static _onMouseDown = new SimpleEventDispatcher<EnvironmentEvent>();
  private static _onMouseUp = new SimpleEventDispatcher<EnvironmentEvent>();
  private static _onStep = new SignalDispatcher();
  private _intersects: THREE.Intersection[] = [];
  private _players: Record<string, HandAvatar> = {};


  static get onStep() {
    return Environment._onStep.asEvent();
  }

  constructor(el: HTMLCanvasElement) {
    window.onresize = () => this.onResize();
    this._initScene(el);

    Input.onMouseMove.subscribe(this._handleMouseMove);
    Input.onMouseDown.subscribe(this._handleMouseDown);
    Input.onMouseUp.subscribe(this._handleMouseUp);
    GameManager.on(GameAction.Type.DrawCards, this._handleAddCards);
  }

  updatePlayer(player: { me: boolean, id: string, name: string, color?: string} ) {
    const { me: isMe, id, name, color } = player;
    if (!this._players[id]) {
      if (isMe) {
        this._createHand(id, name, config.playerPositions.me, isMe, color);
      }
      else {
        const len = Object.values(this._players).filter(p => !p.local).length;
        if (len > 3) throw Error('> 3 peers not supported');
        this._createHand(id, name, config.playerPositions.others[len], isMe, color);
      }
    }
    else {
      const c = this._players[id];
      c.name = name;
    }
  }

  createText(text: string, position: THREE.Vector3) {
    return GameText.Create(text, this.toScreenXY(position), this.renderer.domElement.parentElement);
  }

  toScreenXY(position: THREE.Vector3) {
    const vector = position.clone();

    const { top, left, width, height } = this.renderer.domElement.getBoundingClientRect();
    const w = width / 2;
    const h = height / 2;

    vector.project(this.camera);
    vector.x = (vector.x / 2) + 0.5;
    vector.y = (0.5 - (vector.y / 2));
    vector.z = 0;

    return vector;
  }

  private _createHand = (id: string, label: string, position: THREE.Vector3,
                         local: boolean, color: string = 'black') => {
    const hand = new HandAvatar(id, position, local);
    this._players[id] = hand;
    const text = this.createText(label, hand.position.clone().setZ(hand.position.z - 1));
    text.style.color = color;
    this.scene.add(hand);
    return hand;
  }

  private _handleAddCards = (payload: GameAction.DrawCards.Payload) => {
    const { cards } = payload;
    const local = this._players[payload.id].local;
    this._players[payload.id].addCard(...cards.map(({suit, value}) => {
      const c = CardAvatar.Create(suit, value);
      if (!local) c.disableInteraction();
      return c;
    }));
  }

  private _handleMouseMove = (event: MouseMoveEvent) => {
    const mouse = { x: event.x, y: event.y} ;
    Environment.raycaster.setFromCamera(mouse, this.camera);

    this._intersects.length = 0;
    Environment.raycaster.intersectObjects(this.scene.children, false, this._intersects);
    if (this._intersects.length > 0) {
      Environment.worldMouse = this._intersects[0].point;
      Environment._onMouseMove.dispatch({event: event.event, hit: this._intersects[0]});
    }
  }

  private _handleMouseDown = (event: MouseEvent) => {
    Environment._onMouseDown.dispatch({event: event, hit: this._intersects[0]});
  }

  private _handleMouseUp = (event: MouseEvent) => {
    Environment._onMouseUp.dispatch({event: event, hit: this._intersects[0]});
  }

  private _initScene = (el:HTMLCanvasElement) => {
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({canvas: el});
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setClearColor(0xa8caff);
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 999, 0.1, 1000);
    this.camera.position.set(0, 5, 0);
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
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 1, 1),
      new THREE.MeshBasicMaterial({color: 'gray'}),
    );
    plane.rotation.x = -Math.PI / 2;

    this.scene.add(plane);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.onResize();

    requestAnimationFrame(() => this.animate());
  }

  onResize = () => {
    const width = this.renderer.domElement.clientWidth;
    const height = this.renderer.domElement.clientHeight;

    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
    this.camera.aspect = width/height;
    this.camera.updateProjectionMatrix();
  }

  animate = (time?:number) => {
    requestAnimationFrame(this.animate);
    TWEEN.update(time);
    this.composer.render();
    Environment._onStep.dispatch();
  }

}

export default Environment;
