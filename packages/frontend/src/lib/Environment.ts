import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { ISimpleEvent, SimpleEventDispatcher } from 'strongly-typed-events';
import { GameAction, Message, NetworkMessage } from 'common';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { CardAvatar } from './Card';
import { HandAvatar } from './Hand';
import { GameText } from './Text';
import { Connection } from '../Network';
import { InputOutput, EnvironmentEvent } from './Input';
import { Vector3 } from 'three';
import { CardStack } from './Stack';

// TODO: Put this somewhere else
const config = {
  playerPositions: {
    me: {
      position: new THREE.Vector3(0, 0, 1.5),
      rotation: new THREE.Euler(0, 0, 0),
    },
    others: [
      {
        position: new THREE.Vector3(-3, 0, 0),
        rotation: new THREE.Euler(0, -Math.PI / 2, 0),
      },
      {
        position: new THREE.Vector3(0, 0, -3),
        rotation: new THREE.Euler(0, -Math.PI, 0),
      },
      {
        position: new THREE.Vector3(3, 0, 0),
        rotation: new THREE.Euler(0, Math.PI / 2, 0),
      },
    ],
  },
};

class Environment extends InputOutput {
  static raycaster = new THREE.Raycaster();

  // three.js stuff
  renderer: THREE.WebGLRenderer;

  composer: EffectComposer;

  scene: THREE.Scene;

  camera: THREE.PerspectiveCamera;

  static worldMouse: THREE.Vector3 = new THREE.Vector3();

  get onMouseDown(): ISimpleEvent<EnvironmentEvent> {
    return this._onMouseDown.asEvent();
  }

  get onMouseUp(): ISimpleEvent<EnvironmentEvent> {
    return this._onMouseUp.asEvent();
  }

  get onMouseMove(): ISimpleEvent<EnvironmentEvent> {
    return this._onMouseMove.asEvent();
  }

  mouseDown = -1;

  close: () => void;
  submit: (message: Message.Base) => void;

  private _onMouseMove = new SimpleEventDispatcher<EnvironmentEvent>();

  private _onMouseDown = new SimpleEventDispatcher<EnvironmentEvent>();

  private _onMouseUp = new SimpleEventDispatcher<EnvironmentEvent>();

  private _intersects: THREE.Intersection[] = [];

  private _players: Record<string, HandAvatar> = {};

  private _animation = 0;

  constructor(connection: Connection) {
    super();

    this._initScene();

    const canvas = this.renderer.domElement;
    canvas.onmousedown = this._handleMouseDown;
    canvas.onmousemove = this._handleMouseMove;
    canvas.onmouseup = this._handleMouseUp;
    canvas.oncontextmenu = (event: any) => event.preventDefault();
    window.onresize = this.onResize;

    connection.on(Message.Type.DrawCards, this.addCards);
    connection.on(Message.Type.SessionsData, this.updateSessions);
    connection.on(Message.Type.PlayCards, this.playCards);
    connection.on(Message.Type.BeginTrick, this.beginTrick);
    this.submit = this._submitWrapper(connection.send.bind(connection));

    CardStack.create();
    this.scene.add(CardStack.Stack);

    this.close = () => {
      this.scene.remove(CardStack.Stack);
      CardStack.destroy();

      connection.off(Message.Type.DrawCards, this.addCards);
      connection.off(Message.Type.SessionsData, this.updateSessions);
      connection.off(Message.Type.PlayCards, this.playCards);
      connection.off(Message.Type.BeginTrick, this.beginTrick);
      this.submit = null;

      canvas.remove();
      window.onresize = null;
      window.cancelAnimationFrame(this._animation);
    };
  }

  createText(text: string, position: THREE.Vector3): HTMLElement {
    return GameText.Create(
      text,
      this.toScreenXY(position),
      this.renderer.domElement.parentElement
    );
  }

  toScreenXY(position: THREE.Vector3): THREE.Vector3 {
    const vector = position.clone();

    vector.project(this.camera);
    vector.x = vector.x / 2 + 0.5;
    vector.y = 0.5 - vector.y / 2;
    vector.z = 0;

    return vector;
  }

  private _createHand = (
    id: string,
    label: string,
    index: number,
    local: boolean,
    color = 'black'
  ) => {
    const hand = new HandAvatar(id, local, this);
    if (!local) {
      hand.position.copy(config.playerPositions.others[index].position);
      hand.rotation.copy(config.playerPositions.others[index].rotation);
    } else {
      hand.rotation.copy(config.playerPositions.me.rotation);
      hand.position.copy(config.playerPositions.me.position);
    }

    // const text = this.createText(
    //   label,
    //   hand.position.clone().setZ(hand.position.z - 1)
    // );
    // text.style.color = color;
    this.scene.add(hand);
    return hand;
  };

  /**
   * Add cards to a player's hand.
   * @param payload.id The uuid of the player who's cards to add
   * @param payload.cards An array of Cards to add.
   */
  addCards = (payload: GameAction.DrawCards.Payload): void => {
    const { cards } = payload;
    this._players[payload.id].addCard(
      ...cards.map(({ suit, value, netId }) => {
        const c = CardAvatar.Create(this, suit, value, netId);
        c.netId = netId;
        return c;
      })
    );
  };

  playCards = (payload: GameAction.DrawCards.Payload): void => {
    const { cards } = payload;
    const hand = this._players[payload.id];

    const down = new Vector3(0, -1, 0);
    const origin = new Vector3(0, 10, 0);
    Environment.raycaster.set(origin, down);

    hand.playCards(...cards);
  };

  beginTrick = (): void => {
    this.scene.remove(CardStack.Stack);
    CardStack.destroy();
    CardStack.create();
    this.scene.add(CardStack.Stack);
  };

  updateSessions = (payload: NetworkMessage.SessionData.Payload): void => {
    const { id, name, color } = payload.player;
    if (!this._players[id]) {
      const len = Object.values(this._players).filter((p) => !p.local).length;
      this._players[id] = this._createHand(id, name, len, false, color);
    } else {
      this._players[id].name = name;
    }
  };

  addLocalPlayer = (id: string, name: string, color: string): void => {
    if (!this._players[id]) {
      this._players[id] = this._createHand(id, name, 0, true, color);
    } else {
      this._players[id].name = name;
    }
  };

  private _submitWrapper = (submitFunc: Function) => {
    return (message: Message.Base) => {
      if (message.callback) {
        const original = message.callback;
        message.callback = (arg: boolean) => {
          this._onSubmitReturn(arg);
          original(arg);
        };
      }
      submitFunc(message);
    };
  };

  private _onSubmitReturn = (arg: boolean) => {
    console.log('callback retunred:', arg);
  };

  private _handleMouseMove = (event: MouseEvent) => {
    const { clientWidth: w, clientHeight: h } = this.renderer.domElement;
    const mouse = { x: 0, y: 0 };
    mouse.x = (event.offsetX / w) * 2 - 1;
    mouse.y = -(event.offsetY / h) * 2 + 1;

    Environment.raycaster.setFromCamera(mouse, this.camera);
    this._intersects.length = 0;
    Environment.raycaster.intersectObjects(
      this.scene.children,
      false,
      this._intersects
    );
    if (this._intersects.length > 0) {
      Environment.worldMouse = this._intersects[0].point;
      this._onMouseMove.dispatch({
        event,
        hit: this._intersects[0],
      });
    }
  };

  private _handleMouseDown = (event: MouseEvent) => {
    this.mouseDown = event.button;
    this._onMouseDown.dispatch({
      event,
      hit: this._intersects[0],
    });
  };

  private _handleMouseUp = (event: MouseEvent) => {
    this.mouseDown = -1;
    this._onMouseUp.dispatch({
      event,
      hit: this._intersects[0],
    });
  };

  private _initScene = (el?: HTMLCanvasElement) => {
    this.renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x477148);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, 999, 0.1, 1000);
    this.camera.position.set(0, 3, 0);
    this.camera.lookAt(0, 0, 0);

    const light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(400, 3000, -400);
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

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.1));

    const table = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 1, 1),
      new THREE.MeshStandardMaterial({ color: '#477148' })
    );
    table.rotation.x = -Math.PI / 2;
    table.receiveShadow = true;
    table.position.y = -0.1;

    this.scene.add(table);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.onResize();

    // this.addLocalPlayer('1', '2', 'black');
    // const hand = this._createHand('1', 'pee', 0, true, 'black');
    // const card = CardAvatar.Create(this, 1, 1, '1', 0);
    // const card1 = CardAvatar.Create(this, 1, 1, '2', 0);
    // const card2 = CardAvatar.Create(this, 1, 1, '3', 0);
    // const card3 = CardAvatar.Create(this, 1, 1, '4', 0);
    // const card4 = CardAvatar.Create(this, 1, 1, '5', 0);
    // const card5 = CardAvatar.Create(this, 1, 1, '6', 0);
    // const card6 = CardAvatar.Create(this, 1, 1, '7', 0);
    // hand.addCard(card);
    // hand.addCard(card1);
    // hand.addCard(card2);
    // hand.addCard(card3);
    // hand.addCard(card4);
    // hand.addCard(card5);
    // hand.addCard(card6);
    // setTimeout(() => {
    //   hand.playCards(
    //     { suit: 1, value: 1, netId: '1' },
    //     { suit: 1, value: 1, netId: '4' },
    //     { suit: 1, value: 1, netId: '5' }
    //   );
    // }, 1500);

    requestAnimationFrame(this.animate);
  };

  onResize = (): void => {
    const width = this.renderer.domElement.clientWidth;
    const height = this.renderer.domElement.clientHeight;

    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  animate = (time?: number): void => {
    this._animation = requestAnimationFrame(this.animate);
    TWEEN.update(time);
    this.composer.render();
  };
}

export { Environment };
