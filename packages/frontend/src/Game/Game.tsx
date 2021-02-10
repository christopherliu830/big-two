import * as React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { NetworkMessage as Message, NetworkMessage } from 'common';
import { PLAYER_ID } from '../config';
import { Chat } from './Chat';
import { PlayerList } from './PlayerList';
import { GameStartupPrompt } from './GameStartup';
import { Environment } from '../lib/Environment';
import { Connection } from '../Network';
import { SOCKET_URL } from '../config';
import { CommandGroup } from './CommandGroup';
import './Game.scss';

export const Game: React.FC = () => {
  const [inSetup, setSetup] = useState(false);
  const [environment, setEnvironment] = useState(null);
  const [connection, setConnection] = useState(null);
  const [owner, setOwner] = useState(false);
  const [lenPlayers, setLenPlayers] = useState(1);
  const ref = React.useRef<HTMLDivElement>();
  const params = useParams<{ table: string }>();

  useEffect(() => {
    if (ref.current) {
      let name = window.localStorage.getItem('name');
      let color = window.localStorage.getItem('color');
      if (!name || !color) setSetup(true);
      else handleSetupClose();
    }
  }, [ref]);

  useEffect(() => {
    return () => environment && environment.close();
  }, [environment]);

  useEffect(() => {
    environment && environment.onResize();
  });

  const initialize = (c: Connection, config: Message.Join.Payload) => {
    const env = new Environment(c);
    ref.current.appendChild(env.renderer.domElement);
    env.addLocalPlayer(config.id, config.name, config.color);
    env.onResize();
    setEnvironment(env);
  };

  const handleSetupClose = () => {
    let id = PLAYER_ID;
    let name = window.localStorage.getItem('name');
    let color = window.localStorage.getItem('color');

    if (!name || !color) return;
    setSetup(false);

    const payload: Message.Join.Payload = {
      name,
      color,
      id,
      table: params.table,
    };
    const config = new Message.Join(payload);
    const c = new Connection(SOCKET_URL, config);
    c.once(Message.Type.Connect, () => initialize(c, payload));
    c.once(Message.Type.SetOwner, () => setOwner(true));
    setConnection(c);
  };

  const handleSessionsChange = (
    sessions: NetworkMessage.SessionData.Payload[]
  ) => {
    setLenPlayers(sessions.length);
  };

  const handleStart = () => {
    const message = new NetworkMessage.FromClientChat({ message: '/start' });
    connection.send(message);
  };

  const handlePass = () => {
    const message = new NetworkMessage.FromClientChat({ message: '/pass' });
    connection.send(message);
  };

  return (
    <>
      <Container fluid className="container">
        <Row className="h-75 w-100 my-auto align-items-stretch">
          <Col className="d-flex flex-column h-100" xl={2}>
            <PlayerList
              connection={connection}
              onChange={handleSessionsChange}
            />
          </Col>

          <Col className="paper px-0 main-window h-100">
            <div className="game" ref={ref}></div>
            <CommandGroup
              owner={owner}
              started={false}
              lenPlayers={lenPlayers}
              onStart={handleStart}
              onPass={handlePass}
            />
          </Col>

          <Col xl={2} className="h-100">
            <Chat connection={connection} />
          </Col>
        </Row>
      </Container>
      {!environment && (
        <div className="connecting-box">
          <h1>Connecting...</h1>
        </div>
      )}
      <GameStartupPrompt open={inSetup} onClose={handleSetupClose} />
    </>
  );
};
