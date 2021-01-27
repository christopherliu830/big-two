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
    const deck = Card.deck();
    Card.shuffle(deck);


    sessions.forEach(session => {

      session.sendSessionsData(sessions);

      const action = new GameAction.DrawCards({id: session.id, cards: deck.splice(0, 13)});
      this._history.push(action);
      sessions.forEach(s => {
        this._sendFiltered(s, action);
      })

      session.onGameAction.sub(this._update.bind(this));
      session.onConnect.sub(() => this.resendHistory(session));
    });

  }

  /**
   * When a session reconnects, catch them up on the game's history and current session data.
   * @param session 
   */
  resendHistory(session: Session) {
    session.sendSessionsData(this._sessions);
    this._history.forEach(action => this._sendFiltered(session, action));
  }

  private _sendFiltered = (session: Session, action: GameAction.GameAction) => {
    if (session.id === action.payload.id) {
      session.sendGameAction(action);
    } else {
      session.sendGameAction(action.filter());
    }
  }

  private _update(sender: Session, action: GameAction.GameAction) { 
    if (this._sessions.indexOf(sender) != this.turnIndex) {
      window.setTimeout(() => {
        console.log(action.callback);
        action.callback && action.callback(false);
      }, 1000 );
      return;
    }

    switch(action.type) {
      case GameAction.Type.PlayCards:
        this._handlePlayCards(action as GameAction.GameAction);
        return;
    }

  }

  private _handlePlayCards(action: GameAction.GameAction) {
    action.callback && setTimeout(action.callback, 1000, false);
  }

  handleInput() {

  }

  beginTrick() {

  }

}
