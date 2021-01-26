import { Table } from '../manager';
import { FakeSession, Session } from '../session';
import { Card, Message, GameAction } from 'common';

export class BigTwo {

  /**
   * This array does not change for the duration of the game.
   * i.e. the players should not change during a Big Two game
   * unlike in Table, where the number changes as people join.
   */
  private _sessions: Session[] = [];
  private _history: GameAction.GameAction[] = [];

  private turnIndex = 0;

  start(sessions: Session[]) {
    this._sessions = sessions;
    sessions.forEach(session => {
      session.sendSessionsData(sessions)
      const card: Card.Card = {
        suit: Card.Suit.Diamond,
        value: Math.floor(Math.random() * 13),
      };
      const action = new GameAction.DrawCards({id: session.id, cards: [card]});
      this._history.push(action);
      session.sendGameAction(action);
      session.onGameAction.sub((s, m) => this._update(s, m));
      session.onConnect.sub(() => this.resendHistory(session));
    });
  }

  /**
   * When a session reconnects, catch them up on the game's history and current session data.
   * @param session 
   */
  resendHistory(session: Session) {
    session.sendSessionsData(this._sessions);
    this._history.forEach(action => {
      session.sendGameAction(action);
    })
  }

  private _update(sender: Session, action: GameAction.GameAction) { 

  }

  handleInput() {

  }

  beginTrick() {

  }

}
