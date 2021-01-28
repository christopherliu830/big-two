import * as React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import { v4 as uuid } from 'uuid';
import { useParams } from 'react-router-dom';
import { Message } from 'common';
import { Chat } from '../components/Chat';
import { PlayerList } from '../components/PlayerList';
import { GameStartupPrompt } from '../components/GameStartup';
import { Network } from '../Network';
import { setCookie, getCookie } from '../util';
import './style.css';

import { GameManager } from '../game-core/GameManager';

export const Game: React.FunctionComponent = (props) => {
  const [connecting, setConnecting] = useState(false);
  const [inSetup, setSetup] = useState(true);
  const ref = React.useRef<HTMLDivElement>();
  const canvasRef = React.useRef<HTMLCanvasElement>();
  const params = useParams<{ table: string }>();

  useEffect(() => {
    const { clientWidth: w, clientHeight: h } = ref.current;
    if (ref.current && canvasRef.current) {
      canvasRef.current.width = w;
      canvasRef.current.height = h;
      GameManager.initialize(canvasRef.current);
    }
    return () => { GameManager.close(); }
  }, []);

  const handleSetupClose = (name: string) => {
    setConnecting(true);

    if (!getCookie('playerid')) setCookie('playerid', uuid(), 1);

    const config = new Message.Join({
      id: getCookie('playerid'),
      name,
      color: 'black',
      table: params.table,
    });

    const onConnect = () => setConnecting(false);
    Network.connect('ws://localhost:3000', config, onConnect);
    setSetup(false);
  };

  useEffect(() => {
    return () => Network.close();
  }, []);

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
            <Col id="game" xl={6} className="h-100" ref={ref}>
              <canvas ref={canvasRef} />
            </Col>
            <Col xl={2} className="h-100">
              <Chat />
            </Col>
          </Row>
        </Container>
      </div>
      {connecting && (
        <div className="connecting-box">
          <h1>Connecting...</h1>
        </div>
      )}
      <GameStartupPrompt open={inSetup} onClose={handleSetupClose} />
    </>
  );
};
