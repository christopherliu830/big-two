import * as React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { NetworkMessage } from 'common';
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
  const [owner, setOwner] = useState(null);
  const [currentActing, setCurrentActing] = useState(null);
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

  useEffect(() => {
    if (connection) {
      connection.once(NetworkMessage.SetOwner.Type, (p: any) => setOwner(p));
      connection.on(NetworkMessage.SetTurn.Type, setCurrentActing);
      return () => {
        connection.off(NetworkMessage.SetTurn.Type, setCurrentActing);
      };
    }
  }, [connection]);

  const initialize = (c: Connection, config: NetworkMessage.Join.Payload) => {
    const { id, name, color } = config.player;
    const env = new Environment(c);
    ref.current.appendChild(env.renderer.domElement);
    env.addLocalPlayer(id, name, color);
    env.onResize();
    setEnvironment(env);
  };

  const handleSetupClose = () => {
    let id = PLAYER_ID;
    let name = window.localStorage.getItem('name');
    let color = window.localStorage.getItem('color');

    if (!name || !color) return;
    setSetup(false);

    const payload: NetworkMessage.Join.Payload = {
      player: { name, color, id },
      table: params.table,
    };
    const config = new NetworkMessage.Join(payload);
    const c = new Connection(SOCKET_URL, config);

    // We're in an open lobby if we receive session data
    c.once(NetworkMessage.SessionData.Type, () => initialize(c, payload));

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
      <Container fluid="xl" className="game-container">
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
              current={currentActing}
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
