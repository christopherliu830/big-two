import { Table } from './manager';
import { Message } from 'common';
import { Session } from './session';
import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';
import { SimpleEventDispatcher } from 'strongly-typed-events';

/** The chat room for a table.
 */
export class ChatRoom {
  sessions: Session[] = [];

  get onOutgoingChat() {
    return this._onOutgoingChat.asEvent();
  }
  private _onOutgoingChat: SimpleEventDispatcher<Message.Chat> = new SimpleEventDispatcher();
  

  /** Forward a received chat to all members of the session. */
  handleIncomingChat(session: Session, payload: Message.FromClientChat.Payload) {
    const peers:Socket[] = this.sessions.map(s => s.socket);

    const message = new Message.Chat({
      key: uuid(),
      message: payload.message,
      sender: session.name,
      color: session.color,
    });
    this._onOutgoingChat.dispatch(message);
  }


}