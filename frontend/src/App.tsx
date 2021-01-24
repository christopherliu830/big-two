import * as React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import { Chat } from './components/Chat';
import { PlayerList } from './components/PlayerList';
import { GameStartupPrompt } from './components/GameStartup';
import { socket } from './socket';
import { setCookie, getCookie } from './util';
import { v4 as uuid } from 'uuid';
import './style.css';

import { GameManager } from './game-core/GameManager';

export const App:React.FunctionComponent = (props) => {
  const [ connecting, setConnecting ] = useState(true); 
  const [ status, setStatus ] = useState('Connecting...');
  const [ inSetup, setSetup ] = useState(false);
  const ref = React.useRef<HTMLDivElement>();
  const canvasRef = React.useRef<HTMLCanvasElement>();

  useEffect(() => {
    const onStart = () => setConnecting(true);
    const onStatus = (status:string) => setStatus(status);
    socket.on('start', onStart);
    socket.on('status', onStatus)
    return () => {
      socket.off('start', onStart);
      socket.off('status', onStatus)
    }
  }, []);

  useEffect(() => {
    if (!getCookie('playerid')) setCookie('playerid', uuid(), 1);

    const onConnect = () => { 
      socket.emit('playerInfo', { id: getCookie('playerid') }); 
    }
    const onReconnect = () => { setSetup(false); }
    const onRegister = () => { 
      setSetup(true); 
    }

    socket.on('connect', onConnect);
    socket.on('reconnect', onReconnect);
    socket.on('register', onRegister);

    return () => {
      socket.off('connect', onConnect);
      socket.off('reconnect', onReconnect);
      socket.off('register', onRegister);
    }

  }, [])

  useEffect(() => {
    console.log(ref.current);
    const { clientWidth: w, clientHeight: h } = ref.current;
    if (ref.current && canvasRef.current) {
      canvasRef.current.width = w;
      canvasRef.current.height = h;
      GameManager.initialize(canvasRef.current);
    }
  }, [ref.current, canvasRef.current])

  const handleSetupClose = (name:string) => {
    setCookie('name', name, 1);
    if (!getCookie('playerid')) setCookie('playerid', uuid(), 1);
    const id = getCookie('playerid');
    socket.emit('playerInfo', {id, name});
    setSetup(false);
  }

  return (
    <>
    <Navbar className="header navbar-dark">
      <Navbar.Brand>Big Two Online</Navbar.Brand>
    </Navbar>
    <div id="app">
      <Container fluid className="my-auto">
        <Row className="h-100 align-items-stretch justify-content-center">
          <Col xl={2}>
            <PlayerList/>
          </Col>
          <Col xl={6} className="h-100" ref={ref}>
            {/* {connecting && <div className="connecting-box">
              <h1>{status}</h1>
            </div>} */}
            <canvas ref={canvasRef}></canvas>
          </Col>
          <Col xl={2} className="h-100">
            <Chat/>
          </Col>
        </Row>
      </Container>
    </div>
    <GameStartupPrompt open={inSetup} onClose={handleSetupClose}/>
    </>

  )
}