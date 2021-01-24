import { Card } from './Card';
// import { PassButton } from '../three-assets/pass-button';
import Environment from './Environment';
import * as THREE from 'three';
import { Socket } from 'socket.io-client';
import { socket } from '../socket';
import { Input } from './Input';
import { Network } from './Network';

// class GameManager1 {

//   env:Environment;
//   hand:Hand;
//   deck:Deck;
//   worldMouse:THREE.Vector3=new THREE.Vector3();
//   playArea:THREE.Object3D;
//   round:number=0;
//   io:Socket;
//   inited:boolean;
//   started:boolean;
//   passButton:PassButton;
//   domElement:HTMLElement;
//   onMessage:any;
  
//   init(domElement:HTMLElement) {
//     if (this.inited) return;
//     else this.inited = true;

//     this.domElement = domElement;

//     // Dummy environment until the game starts
//     this.env = new Environment();

//     socket.on('start', () => this.start());
//     socket.on('GAME_EVENT', (data:any) => this.onEvent(data));

//     domElement.addEventListener('mousemove', e => this.handleMouseMove(e));
//     domElement.addEventListener('mousedown', e => this.handleMouseDown(e));
//     domElement.addEventListener('mouseup', e => this.handleMouseUp(e));
//   }

//   start() {
//     this.started = true;

//     // Create new environment
//     this.env = new Environment();

//     this.hand = new Hand();
//     this.env.add(this.hand);

//     this.passButton = new PassButton();
//     this.passButton.position.set(3, 0, 0);
//     this.env.add(this.passButton);

//     this.playArea = new THREE.Mesh (
//       new THREE.BoxGeometry(4, 1, 4),
//       new THREE.MeshStandardMaterial({color: 'darkgreen', side: THREE.DoubleSide})
//     )
//     this.playArea.receiveShadow = true;
//     this.playArea.position.set(0, 0.05, -1);
//     this.playArea.scale.y = 0.1;
//     this.env.scene.add(this.playArea); // Add to scene only
//   }

//   onEvent(event:any) {
//     switch(event.type) {
//       case 'DRAW':

//         const c = new Card(event.card);
//         this.env.add(c);
//         this.hand.add(c);
//         break;

//       case 'OTHER_PLAY':

//         const cards = [];

//         // Rotate the cards when they're added
//         for(let i = 0; i < event.cardNames.length; i++) {
//           const card = new Card(event.cardNames[i]);
//           card.mesh.rotation.y = THREE.MathUtils.lerp(0.3, -0.3, (i+1)/(event.cardNames.length+1));
//           card.mesh.receiveShadow = false;
//           card.mesh.castShadow = false;
//           cards.push(card);
//         }

//         this.addCardsToField(cards);

//         break;
//       case 'BEGIN_TRICK':

//         this.playArea.remove(...this.playArea.children);
//         console.log('?');

//         break;
      

//     }
//     if (event.message) document.getElementById('info').innerHTML = event.message;
//   }

//   inPlay() {
//     return this.env.raycaster.intersectObject(this.playArea).length > 0;
//   }

//   addCardsToField(cards:Card[]) {
//     // Put the card on the play area correctly
//     for(let i = 0; i < cards.length; i++) {
//       const card = cards[i];
//       card.mesh.receiveShadow = false;
//       card.mesh.castShadow = false;
//       this.playArea.add(card.mesh);
//       card.position.x = (i+1)/(cards.length+1) - 0.5;
//       card.position.y = this.round * 0.1 +  1 + i * 0.01;
//       card.position.z = 0;
//       card.mesh.rotation.x = 0;
//       card.mesh.rotation.z = 0;
//     }

//     // Temporary
//     this.round += 1;
//   }

//   /**
//    * Send request to server to play cards. If accepted, cards
//    * are added to field.
//    * @param cards Cards to send to server
//    */
//   async playCards(cards:Card[]):Promise<any> {
//     return new Promise((resolve, reject) => {
//       socket.emit('CLIENT_EVENT', {
//         type: 'PLAY_CARDS',
//         cardNames: cards.map(c => c.cardName),
//       }, (response:any) => {
//         if (response.ok) {
//           resolve(response.message);
//         }
//         else {
//           reject(response.message);
//         }
//       });
//     })
//   }

//   pass() {
//     socket.emit('CLIENT_EVENT', {
//       type: 'PASS',
//     })
//   }

//   handleMouseMove(e: MouseEvent) {
//     if (!this.started) return;
//     this.env.handleMouseMove(e);
//   }

//   handleMouseDown(e: MouseEvent) {
//     if (!this.started) return;
//     this.env.handleMouseDown(e);
//   }

//   handleMouseUp(e: MouseEvent) {
//     if (!this.started) return;
//     this.env.handleMouseUp(e);
//   }
// }

export const GameManager = {

  environment: Environment,

  _started: false,

  /** Initialize the environment */
  initialize(domEl: HTMLCanvasElement) {
    if (this._started) return console.error('Manager already initialized!');
    this._started = true;
    Input.initialize(domEl);
    this.environment = new Environment(domEl);
  },

}
