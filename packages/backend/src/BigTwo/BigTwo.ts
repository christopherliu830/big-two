import { Session } from '../session';
import { Card, Message, GameAction, NetworkMessage } from 'common';

const roundRestartDelay = 2000;
const placementMsgs = ['1st', '2nd', '3rd', '4th'];

export class BigTwo {
  /**
   * This array does not change for the duration of the game.
   * i.e. the players should not change during a Big Two game
   * unlike in Table, where the number changes as people join.
   */
  private _sessions: Session[] = [];
  private _history: GameAction.GameAction[] = [];
  private _hands: Record<string, Card.Card[]> = {};
  private _top: Card.Card[] = [];
  private _turnIndex = 0;
  private _currentWinScore = 0;
  private _passInRow = 0;
  private _round = 0;
  private _restarting = false;
  private _maxRounds = 1;

  constructor({ maxRounds }: { maxRounds?: number }) {
    this._maxRounds = maxRounds || 1;
  }

  start(sessions: Session[]): void {
    if (this._round > 0) return;
    this._sessions = sessions;

    sessions.forEach((session) => {
      session.sendSessionsList(this._sessions);
      session.on(Message.Type.PlayCards, this._handlePlayCards(session));
      session.on(Message.Type.Connect, () => this.resendHistory(session));
      session.on(Message.Type.ClientChat, this._handlePass(session));
    });

    this.restart();
  }

  restart(): void {
    this._round++;

    // Clear all hands from the last round
    this._sessions.forEach((session) => {
      this._sessions.forEach((s) => {
        session.send(new GameAction.ClearHand({ id: s.id }));
      });
    });
    this._hands = {};
    this._top = [];
    this._passInRow = 0;
    this._currentWinScore = this._sessions.length - 1;
    this._history = [];

    const deck = Card.deck();
    Card.shuffle(deck);

    this._sessions.forEach((session) => {
      this._hands[session.id] = [];
      const cards = deck.splice(0, 13);
      cards.sort(Card.compare);
      this._drawCards(session, cards);
    });

    // TODO: change this
    this._turnIndex = -1;
    this._incrementTurn();
  }

  /**
   * When a session reconnects, catch them up on the game's history and current session data.
   * @param session
   */
  resendHistory(session: Session): void {
    session.sendSessionsList(this._sessions);
    const current = this._sessions[this._turnIndex];
    session.send(
      new NetworkMessage.SetTurn({
        id: current.id,
        name: current.name,
        color: current.color,
      })
    );
    this._history.forEach((action) => this._sendFiltered(session, action));
  }

  private _sendFiltered = (session: Session, action: GameAction.GameAction) => {
    if (session.id === action.payload.id) {
      session.send(action);
    } else {
      session.send(action.filter());
    }
  };

  private _beginTrick() {
    const message = new NetworkMessage.BeginTrick();
    this._round = 0;
    this._sessions.forEach((s) => s.send(message));
    this._top.length = 0;
    this._passInRow = 0;
  }

  /**
   * Handle a session trying to play cards. This function expects a callback to be
   * called with true meaning the cards were played successfully.
   * @param session The session trying to play cards.
   */
  private _handlePlayCards = (session: Session) => (
    payload: GameAction.PlayCards.Payload,
    callback: (arg: boolean) => void
  ) => {
    if (this._restarting) {
      callback && callback(false);
      return;
    }

    // Is this our turn?
    if (this._sessions[this._turnIndex].id !== session.id) {
      session.sendSystemChat(`It's not your turn.`);
      callback && callback(false);
      return;
    }

    const cards = payload.cards;
    cards.sort(Card.compare);
    const hand = this._hands[session.id];

    // Build a record to check if hand has cards
    const has: Record<string, number> = {};
    for (let i = 0; i < hand.length; i++) {
      has[hand[i].netId] = i;
    }

    // Are all these cards in our hand?
    for (let i = 0; i < cards.length; i++) {
      if (has[cards[i].netId] === undefined) {
        session.sendSystemChat(`You don't have that card!`);
        callback && callback(false);
        return;
      }
    }

    // Cards are valid, play them
    if (this._isValid(this._top, cards, session)) {
      this._top = cards;

      for (let i = cards.length - 1; i >= 0; i--) {
        const index = has[cards[i].netId];
        hand.splice(index, 1);
      }

      const action = new GameAction.PlayCards({ id: session.id, cards });
      this._history.push(action);
      session.broadcast(action);
      callback && callback(true);
      this._passInRow = 0;
      if (this._endActionChecker(session)) this._incrementTurn();
      return;
    }

    callback && callback(false);
  };

  private _handlePass = (session: Session) => (
    payload: NetworkMessage.FromClientChat.Payload
  ) => {
    if (payload.message === '/pass') {
      if (this._sessions[this._turnIndex].id !== session.id) {
        session.sendSystemChat(`It's not your turn.`);
      } else {
        session.sendSystemChat('You passed.');
        this._passInRow += 1;
        if (this._passInRow === this._sessions.length - 1) {
          this._beginTrick();
        }
        this._incrementTurn();
      }
    }
  };

  private _incrementTurn() {
    this._turnIndex = (this._turnIndex + 1) % this._sessions.length;
    while (this._hands[this._sessions[this._turnIndex].id].length === 0) {
      this._turnIndex += 1;
    }
    this._sessions.forEach((s) => {
      const player = this._sessions[this._turnIndex];
      s.send(
        new NetworkMessage.SetTurn({
          id: player.id,
          name: player.name,
          color: player.color,
        })
      );
    });
  }

  /**
   * Award points, check if game has ended, etc.
   * @param session who just acted
   * @returns whether the round should continue.
   */
  private _endActionChecker(session: Session): boolean {
    if (this._checkWon(session)) {
      session.score += this._currentWinScore;
      this._broadcastChat(
        `${session.name} has won ${this._currentWinScore} points!`
      );

      this._currentWinScore--;
      if (this._currentWinScore === 0) {
        if (this._round >= this._maxRounds) {
          this._endGame();
        } else {
          this._restarting = true;
          this._broadcastChat(`Round over! Restarting...`);
          setTimeout(() => {
            this._restarting = false;
            this.restart();
          }, roundRestartDelay);
        }
        return false;
      }
    }
    return true;
  }

  private _endGame() {
    let msg = '';
    msg += `Game Over!\n`;
    this._sessions.sort((a, b) => b.score - a.score);
    this._sessions.forEach((s, index) => {
      msg += `${s.name}: ${placementMsgs[index]}\n`;
    });
    this._broadcastChat(msg);
    this._sessions.forEach((s) => s.close());
  }

  private _broadcastChat(message: string) {
    this._sessions.forEach((s) => s.sendSystemChat(message));
  }

  /**
   * Check the cards with the top of the stack. return true if cards are valid.
   * These rules are specific to Big Two.
   * @param cards The cards trying to be played
   */
  private _isValid(top: Card.Card[], cards: Card.Card[], session: Session) {
    cards.sort(Card.compare);
    if (cards.length === 0) throw Error('Tried to play 0 cards');

    if (top.length > 0 && top.length !== cards.length) {
      session.sendSystemChat(
        'You must play a hand of the same length as the last.'
      );
      return false;
    }

    // Non-poker hands
    if (cards.length < 5) {
      // Cards being played must be all the same value
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].value != cards[0].value) {
          session.sendSystemChat(
            'You must play cards that are of the same value.'
          );
          return false;
        }
      }

      // If this is the first play
      if (top.length === 0) return true;

      // Cards must be higher value than last play
      const len = top.length;
      if (Card.compare(top[len - 1], cards[len - 1]) > 0) {
        session.sendSystemChat(
          'You must play cards of higher value than those of the last.'
        );
        return false;
      }

      return true;
    }
    // TODO: Support 5-length hands
    else return false;
  }

  private _drawCards(session: Session, cards: Card.Card[]) {
    const hand = this._hands[session.id];
    hand.push(...cards);
    const action = new GameAction.DrawCards({
      id: session.id,
      cards: cards,
    });
    this._history.push(action);
    this._sessions.forEach((s) => {
      this._sendFiltered(s, action);
    });
  }

  /**
   * Check if a session has won (has no cards left).
   */
  private _checkWon(session: Session): boolean {
    if (this._hands[session.id].length === 0) return true;
    return false;
  }
}
