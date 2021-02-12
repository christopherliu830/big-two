import * as React from 'react';
import { useEffect, useState } from 'react';
import { NetworkMessage as Message } from 'common';
import './Chat.scss';
import { Connection } from '../Network';

type Props = {
  connection: Connection;
};

export const Chat: React.FunctionComponent<Props> = ({ connection }) => {
  const [messages, setMessages] = useState<Message.Chat.Payload[]>([]);
  const [text, setText] = useState('');

  const handleMessage = (message: Message.Chat.Payload) => {
    setMessages((old) => {
      if (old.length > 10) {
        return [...old.slice(1), message];
      }
      return [...old, message];
    });
  };

  useEffect(() => {
    if (connection) {
      connection.on(Message.Type.ServerChat, handleMessage);
      return () => {
        connection.off(Message.Type.ServerChat, handleMessage);
      };
    }
    return null;
  }, [connection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (connection && text !== '') {
      connection.send(new Message.FromClientChat({ message: text }));
    }

    setText('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="paper chat">
      <div className="flat-dark chat-button">
        <span>chat</span>
      </div>

      <div className="chat-window-wrapper">
        <div className="chat-window">
          <div className="message-block">
            <div className="message-header">System</div>
            <div className="message">Connecting...</div>
          </div>
          {messages.map((m) => {
            const { key, message } = m;
            const { name, color } = m.player;

            return (
              <div className="message-block" key={key}>
                <div className="message-header" style={{ color }}>
                  <b>{name}</b>
                </div>
                <div className="message">{message}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flat-dark chat-input">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={text}
            placeholder="Send a message..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
};

/*
  <div class="chat">
    <div class="chat-button">
      chat
    </div>
    <div class="chat-window">
      <li>
        <ul>test message</ul>
        <ul>test message</ul>
        <ul>test message</ul>
        <ul>test message</ul>
        <ul>test message</ul>
      </li>
    </div>
  </div>
*/
