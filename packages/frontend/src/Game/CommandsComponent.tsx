
import * as React from 'react';
import { useState, useEffect } from 'react';
import { PlayerInfo } from '../types';
import { NetworkMessage } from 'common';
import { Connection } from '../Network';
import { Button } from 'react-bootstrap';
import './CommandsComponent.css';

type Props = {
  connection: Connection;
};

export const CommandsComponent: React.FC<Props> = ({ connection }) => {

  const handleButton = (text: string) => {
    const message = new NetworkMessage.FromClientChat({message: text});
    connection.send(message);
  }

  return (
    <div className="commands-component">
      <Button onClick={() => handleButton('/start')}>Start</Button>
      <Button onClick={() => handleButton('/pass')}>Pass</Button>
    </div>
  );
};
