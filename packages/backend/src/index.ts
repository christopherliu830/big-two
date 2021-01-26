import { Socket } from "socket.io";
import { Table } from './manager';
import { Message } from 'common';

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

io.on(Message.Type.Connect, (socket:Socket) => {
  socket.on(Message.Type.Join, (payload: Message.Join.Payload) => {
    m1.join(socket, payload);
  });
});

server.listen(3000, () => console.log('listening on', 3000));