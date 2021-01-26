import { Table } from '../manager';
import { Session } from '../session';
import { Card } from 'common';

export class BigTwo {

  start(sessions: Session[]) {
    sessions.forEach(session => session.sendSessionsData(sessions));
    console.log(Card.deck());
  }

  handleInput() {

  }

  beginTrick() {

  }

}
