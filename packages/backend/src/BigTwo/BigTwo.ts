import { Table } from '../manager';
import { FakeSession, Session } from '../session';
import { Card, Message, GameAction } from 'common';

export class BigTwo {


  /**
   * This array does not change for the duration of the game.
   * i.e. the players should not change during a Big Two game
   * unlike in Table, where the number changes as people join.
   */
  private _players: Session[] = [];

  private turnIndex = 0;

  start(sessions: Session[]) {
    this._players = sessions;
    sessions.forEach(session => {
      session.sendSessionsData(sessions)
      if (!(session instanceof FakeSession)) {
        const card: Card.Card = {
          suit: Card.Suit.Diamond,
          value: Card.Value.Ace,
        };
        const action = new GameAction.DrawCards({id: session.id, cards: [card]});
        session.sendGameAction(action);
      }
      session.onGameAction.sub((s, m) => this._update(s, m));
    });
  }

  private _update(sender: Session, action: GameAction.GameAction) {
    console.log(sender, action);
  }

  handleInput() {

  }

  beginTrick() {

  }

}
