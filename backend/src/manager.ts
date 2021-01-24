import { Server, Socket } from 'socket.io';
import Player from './player';
import { v4 as uuidv4 } from 'uuid';
import { getDeck } from './card';

/**
 * Represents players and the socket object
 */
export class Table {

  id:string;

  sessions:{[client:string]:Player}={}; // Players that have once connected to the table
  players:Player[]=[]; // Players that are currently connected to the table
  colors:string[]=[];
  io:Server;
  started:boolean=false;
  playerIndex:number=0;

  // Game state
  cardStack:string[]=[];
  currentMulti:number=0;
  passedInRow:number=0;


  constructor(io:Server, id?:string) {
    this.colors=['darkred', 'midnightblue', 'darkslategray', 'indigo']
    this.id = id ? id : uuidv4();

    // Create a room on the socket.io server 
    this.io = io.to(this.id);
  }

  connect(client:Socket) {
    client.on('disconnect', (reason:string) => this.onDisconnect(client, reason));
    client.on('CLIENT_EVENT', (data, cb) => this.update(client, data, cb));
    client.on('chat', (data:string) => {this.onChatReceived(client, data)});

    // New player joining
    if(!this.sessions[client.playerid]) {

      console.log(client.playerid, 'connected');
      // Join the socket.io room
      client.join(this.id);

      // Set up the player object
      const newPlayer = new Player(client, this);
      const c = this.colors.pop();
      if (c) newPlayer.color = c;
      this.sessions[client.playerid] = newPlayer;
      this.players.push(newPlayer);
      this.broadcastPlayerInfo();
      
      if (this.players.length > 1) { 
        this.start(); 
      }
      else {
        client.emit('status', 'Waiting for players...');
      }
    }
    // Reconnect, or connected already
    else {

      client.join(this.id);
      const oldPlayer = this.sessions[client.playerid];

      // Reconnection
      if (this.players.indexOf(oldPlayer) < 0) {
        this.players.push(oldPlayer);
        oldPlayer.connection = client;
        oldPlayer.onReconnect(client);
        this.broadcastPlayerInfo();
      }
      else { // Connected already
        oldPlayer.connection.disconnect(true); // Close the old connection
        oldPlayer.connection = client;
        oldPlayer.onReconnect(client);
      }

      if (!this.started) {
        client.emit('status', 'Waiting for players...');
      }
    }

  }

  onClientEvent(client:Socket, data:any) {
    switch(data.type) {
      case 'PLAY_CARDS':
        client.to(this.id).emit('GAME_EVENT', {
          type: 'OTHER_PLAY',
          cardNames: data.cardNames,
        })
        break;
    }
  }

  onDisconnect(client:Socket, reason:string) {
    this.players = this.players.filter(p => p.id !== client.playerid);
    console.log('player disconnected, now ', this.players.length, 'players.');
    this.broadcastPlayerInfo();
  }

  onChatReceived(client:Socket, message:string) {
    this.io.emit('chat', {
      chat: {
        sender: this.sessions[client.playerid].name,
        color: this.sessions[client.playerid].color,
        message: message,
        key: uuidv4(),
        system: false,
      }
    })
  }

  systemChat(message:string, player?:Player) {
    const toSend = {
      sender: 'System',
      system: true,
      message: message,
      key: uuidv4()
    }

    if (player) player.connection.emit('chat', toSend);
    else this.io.emit('chat', toSend);
  }

  broadcast(type:string, data?:any) {
    this.io.emit(type, data);
  }

  start() {
    this.broadcast('start');

    const deck = getDeck();

    // Deal 
    this.players.forEach(player => {
      deck.splice(0, 3).map(c => player.draw(c));
    });
  }

  beginTrick() {

    this.broadcast('GAME_EVENT', {type:'BEGIN_TRICK'});
    this.cardStack = [];
    this.currentMulti = 0;
    this.passedInRow = 0;

  }

  update(client:Socket, data:any, cb?:any) {
    const cplayer = this.players[this.playerIndex % this.players.length];

    // This shouldn't happen
    if (!cplayer) {
      console.error('Error: No current player!');
      return;
    }

    // Reject actions from the non-current players
    if (cplayer.id !== client.playerid) {

      cb && cb({ ok: false, });
      client.send({
        chat: {
          system: true,
          message: 'Not your turn!',
          sender: 'System',
        }
      })
      return;

    }

    console.log(client.playerid.substr(0, 4), 'did', data);
    const ret = cplayer.process(data);
    cb && cb(ret);

    if (!ret.ok) return;

    if (data.type === 'PASS') this.passedInRow += 1;
    else this.passedInRow = 0;
    this.playerIndex += 1;

    if (this.passedInRow === this.players.length - 1) {
      this.passedInRow = 0;
      this.beginTrick();
    }

    for(let i = 0 ; i < this.players.length; i++) {
      const player = this.players[i];
      if ( player.checkWon() ) {
        this.systemChat( `${player.name} won!!! Restarting...` );

        player.score += 1;
        this.broadcastPlayerInfo();
        return this.start();
      }
    }

    this.systemChat(`It is now ${this.players[this.playerIndex % this.players.length].name}'s turn.`);
  }

  broadcastPlayerInfo() {
    this.io.emit('tableUpdate', {
      players: this.players.map(p => ({
        name: p.name, 
        id: p.id,
        score: p.score,
      }))
    })
  }

}

export interface Chat {
  message:string,
  sender:string,
  system:boolean,
}