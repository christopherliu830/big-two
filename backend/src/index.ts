import { Socket } from "socket.io";
import { Table } from './manager';
import { v4 as uuid } from 'uuid';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: true,
    preflightContinue: true,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

const m1 = new Table(io, 'room 1');

const connectionIds = new Set();

io.on('connection', (socket:Socket) => {

  socket.on('playerInfo', (pinfo:any) => {

    if (connectionIds.has(pinfo.id)) {
      socket.playerid = pinfo.id;
      socket.player = {...socket.player, ...pinfo} ;
      m1.connect(socket);
    }
    else {
      connectionIds.add(pinfo.id);
      socket.emit('register');
    }

  });

});

server.listen(3000, () => console.log('listening on', 3000));