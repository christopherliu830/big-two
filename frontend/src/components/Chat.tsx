import * as React from 'react';
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { ChatMessage } from '../types';
import './Chat.css';

export const Chat:React.FunctionComponent = (props) => {

  const [ messages, setMessages] = useState([]);
  const [ text, setText ] = useState('');

  useEffect(() => {

    const addMessage = (chat:ChatMessage) => { 
      setMessages([...messages, chat]);
    }

    socket.on('chat', addMessage);
    return () => socket.off('chat', addMessage);

  }, [])


  const messageList = (messages:any[]) => {

    return messages.map(m => {
      return (
        <div className="message-block" key={m.key}>
          <div className="message-header" style={{color:m.color}}>
            <b>{m.sender}</b>
          </div>
          <div className="message">
            {m.message}
          </div>
        </div>
      )
    })

  }

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    if (text !== '') {
      socket.emit('chat', text);
      setText('');
    }
  }

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }

  return (
    <div className="chat">

      <div className="chat-button">
        <span>chat</span>
      </div>

      <div className="chat-window-wrapper">
        <div className="chat-window">
          <div className="message-block">
            <div className="message-header">
              System
            </div>
            <div className="message">
              Connecting...
            </div>
          </div>
          { messageList(messages) }
        </div>
      </div>

      <div className="chat-input">
        <form onSubmit={handleSubmit}>
          <input type="text" value={text} placeholder="Send a message..." onChange={handleInputChange}></input>
        </form>
      </div>

    </div>
  )
}


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