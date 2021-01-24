import { Socket } from 'socket.io';
import { Table, Chat } from './manager';
import { checkSameValue, cardCompareTo } from './util';

export default class Player {

  id: string;
  name:string;
  connected:boolean = true;
  connection:Socket;
  cards:string[]=[];
  table:Table;
  color:string='black';
  score:number=0;

  constructor(connection:Socket, table:Table) {
    this.id = connection.playerid;
    this.name = connection.player.name;
    this.connection = connection;
    this.table = table;
  }

  onDisconnect() {
    this.connected = false;
  }

  /**
   * Draw a card and send the event to the player
   */
  draw(cardName:string) {

    this.cards.push(cardName);

    const options = {
      type: 'DRAW',
      card: cardName
    }

    this.connection.emit('GAME_EVENT', options);
  }

  process(event:any) : {ok:boolean, chat?:Chat} {
    switch(event.type) {

      case 'PLAY_CARDS':
        if (event.cardNames.length < 1) throw new Error(`${this.id} tried to play nothing`); // Sanity check
        for(let i = 0 ; i < event.cardNames.length; i++) {
          const card = event.cardNames[i];
          if (this.cards.indexOf(card) === -1) {
            this.table.systemChat(`You don\'t have a ${card} in your hand!`, this);
            return { ok: false };
          }
        }

        // If all cards in the array are the same
        return { ok: this.playCards(event) };

      case 'PASS':

        return {
          ok: true,
        };
    }

    // This should not be called
    return { 
      ok: false, 
      chat: {
        system: true,
        message: 'Error, unsupported action',
        sender: 'System',
      }};
  }

  playCards(event:any) {

    if (checkSameValue(event.cardNames)) {
      const sorted = event.cardNames.sort(cardCompareTo);
      const card = sorted[sorted.length-1];
      const multiplicity = event.cardNames.length;

      // If we're in the middle of a round
      if (this.table.cardStack.length > 0) {

        if (this.table.currentMulti !== multiplicity) {
          this.table.systemChat('You must match the last number of cards played!', this);
          return false;
        }
        
        // If card has a lower value than lastCard
        const lastCard = this.table.cardStack[this.table.cardStack.length-1];
        if (cardCompareTo(card, lastCard) < 1) {
          this.table.systemChat(`You must play a higher value card than ${lastCard}`, this);
          return false;
        }

        // Pass through to bottom

      }
      else {
        this.table.currentMulti = multiplicity;
        // Pass through to bottom 
      }

      this.table.cardStack.push(card);
      this.remove(event.cardNames);

      this.connection.to(this.table.id).emit('GAME_EVENT', {
        type: 'OTHER_PLAY',
        cardNames: event.cardNames,
      })

      const value = card.split('_')[1];
      if (multiplicity === 1) this.table.systemChat(`${this.name} just played a ${value}!`, this); 
      else this.table.systemChat(`${this.name} just played ${multiplicity} ${value}s!`, this); 
      return true;

    }

    this.table.systemChat('Playing a set of different cards is not currently supported', this);

    return false;
  }

  remove(cards:string[]) {
    cards.forEach( (card:string) => {
      const index = this.cards.indexOf(card);
      if (index > -1) this.cards.splice(index, 1);
    })
  }

  checkWon() {
    return this.cards.length === 0;
  }

  onReconnect(connection:Socket) {
    this.connection = connection;
    console.log('reconnecting');
    connection.emit('reconnect');

    // Update the hand
    this.cards.forEach(card => {
      this.connection.emit('GAME_EVENT', {
        type: 'DRAW', 
        card: card,
      })
    })

    // Update the table's stack
    this.table.cardStack.forEach(card => {
      this.connection.emit('GAME_EVENT', {
        type: 'OTHER_PLAY',
        cardNames: new Array(this.table.currentMulti).fill(card)
      })
    });

  }
}