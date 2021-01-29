import { Table } from '../manager';
import { FakeSession, Session } from '../session';
import { Card, Message, GameAction, NetworkMessage } from 'common';

export class BigTwo {
  /**
   * This array does not change for the duration of the game.
   * i.e. the players should not change during a Big Two game
   * unlike in Table, where the number changes as people join.
   */
  private _sessions: Session[] = [];
  private _history: GameAction.GameAction[] = [];

  private turnIndex = 0;

  constructor() {
  }

  start(sessions: Session[]) {
    this._sessions = sessions;
    const deck = Card.deck();
    Card.shuffle(deck);

    sessions.forEach((session) => {
      session.sendSessionsList(this._sessions);
      const action = new GameAction.DrawCards({
        id: session.id,
        cards: deck.splice(0, 13),
      });

      this._history.push(action);

      sessions.forEach((s) => {
        this._sendFiltered(s, action);
      });

      session.on(Message.Type.PlayCards, this._handlePlayCards(session));
      session.on(Message.Type.Connect, () => this.resendHistory(session));
    });

  }

  /**
   * When a session reconnects, catch them up on the game's history and current session data.
   * @param session
   */
  resendHistory(session: Session) {
    session.sendSessionsList(this._sessions);
    this._history.forEach((action) => this._sendFiltered(session, action));
  }

  private _sendFiltered = (session: Session, action: GameAction.GameAction) => {
    if (session.id === action.payload.id) {
      session.send(action);
    } else {
      session.send(action.filter());
    }
  };

  private _handlePlayCards = (session : Session) => (payload: GameAction.PlayCards.Payload, callback: Function) => {
    if (this._sessions[this.turnIndex].id !== session.id) {
      callback && setTimeout(callback, 50, false);
    }
    else {
      const action = new GameAction.PlayCards(payload);
      console.log(action);
      this._history.push(action);
      session.broadcast(action);
      callback && setTimeout(callback, 50, true);
      this.turnIndex = (this.turnIndex + 1) % this._sessions.length;
    }
  }

  handleInput() {}

  beginTrick() {}
}
