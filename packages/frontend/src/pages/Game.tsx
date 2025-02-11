import * as React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import { v4 as uuid } from 'uuid';
import { useParams } from 'react-router-dom';
import { NetworkMessage as Message } from 'common';
import { Chat } from '../components/Chat';
import { PlayerList } from '../components/PlayerList';
import { GameStartupPrompt } from '../components/GameStartup';
import { Environment } from '../game-core/Environment';
import { Connection } from '../Network';
import { setCookie, getCookie } from '../util';
import './style.css';

export const Game: React.FC = () => {
  const [inSetup, setSetup] = useState(false);
  const [environment, setEnvironment] = useState(null);
  const [connection, setConnection] = useState(null);
  const ref = React.useRef<HTMLDivElement>();
  const params = useParams<{ table: string }>();

  useEffect(() => {
    if (ref.current) setSetup(true);
  }, [ref]);

  useEffect(() => {
    return () => environment && environment.close();
  }, [environment]);

  const initialize = (c: Connection, config: Message.Join.Payload) => {
    const env = new Environment(c);
    ref.current.appendChild(env.renderer.domElement);
    env.addLocalPlayer(config.id, config.name, config.color);
    env.onResize();
    setEnvironment(env);
  };

  const handleSetupClose = (name: string) => {
    setSetup(false);
    if (!getCookie('playerid')) setCookie('playerid', uuid(), 1);
    const payload: Message.Join.Payload = {
      name,
      color: 'black',
      id: getCookie('playerid'),
      table: params.table,
    };
    const config = new Message.Join(payload);
    const c = new Connection('ws://localhost:3000', config);
    c.once(Message.Type.Connect, () => initialize(c, payload));
    setConnection(c);
  };

  return (
    <>
      <Navbar className="header navbar-dark">
        <Navbar.Brand>Big Two Online</Navbar.Brand>
      </Navbar>
      <div id="app">
        <Container fluid className="my-auto">
          <Row className="h-100 align-items-stretch justify-content-center">

            <Col xl={2}>
              <PlayerList />
            </Col>

            <Col id="game" xl={6} className="h-100" ref={ref} />

            <Col xl={2} className="h-100">
              <Chat connection={connection} />
            </Col>
          </Row>
        </Container>
      </div>
      {!environment && (
        <div className="connecting-box">
          <h1>Connecting...</h1>
        </div>
      )}
      <GameStartupPrompt open={inSetup} onClose={handleSetupClose} />
    </>
  );
};
