import { Message } from 'common';
import { Network } from './Network';
import { SimpleEventDispatcher, ISimpleEvent } from 'strongly-typed-events';

interface IChatClient {

  // onMessage: 
  onMessage: ISimpleEvent<Message.Chat.Payload>;
  _onMessage: SimpleEventDispatcher<Message.Chat.Payload>;

  initialize(): void;

  /** Send a message. The server will transform the string into a ChatMessage for other players. */
  send(message: string): void;
}

const ChatClient: IChatClient = {

  _onMessage: new SimpleEventDispatcher<Message.Chat.Payload>(),
  get onMessage() {
    return this._onMessage.asEvent();
  },

  initialize(this: IChatClient) {
  },

  send(this: IChatClient, message) {
    console.log('sending message', message);
    const m = new Message.FromClientChat({ message: message });
    Network.send(m);
  }

}

export { ChatClient };