import * as React from 'react';
import { useEffect, useState } from 'react';
import { Message } from 'common';
import { ChatClient } from '../ChatClient';
import './Chat.css';
import { Network } from '../Network';

export const Chat: React.FunctionComponent = (props) => {
  const [messages, setMessages] = useState<Message.Chat.Payload[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    Network.on(Message.Type.ServerChat, (data: Message.Chat.Payload) =>
      handleMessage(data)
    );
  }, []);

  const handleMessage = (message: Message.Chat.Payload) => {
    setMessages((messages) => {
      if (messages.length > 20) {
        return [...messages.slice(1), message];
      }
      return [...messages, message];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text !== '') {
      Network.send(new Message.FromClientChat({ message: text }));
      setText('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="chat">
      <div className="chat-button">
        <span>chat</span>
      </div>

      <div className="chat-window-wrapper">
        <div className="chat-window">
          <div className="message-block">
            <div className="message-header">System</div>
            <div className="message">Connecting...</div>
          </div>
          {messages.map((m) => {
            const { key, sender, message, color } = m;

            return (
              <div className="message-block" key={key}>
                <div className="message-header" style={{ color }}>
                  <b>{sender}</b>
                </div>
                <div className="message">{message}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chat-input">
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
