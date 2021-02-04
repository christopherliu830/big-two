import { Socket } from 'socket.io';
import { Table } from './manager';
import { NetworkMessage as Message } from 'common';
import { Request, Response } from 'express';

const cors = require('cors');
const express = require('express');
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: true,
    preflightContinue: true,
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const tables: Record<string, Table> = {};
app.post('/create-room', (req: Request, res: Response) => {
  const { winCondition, rounds, hidden } = req.body;
  console.log(winCondition, rounds, hidden );
  const tableId = (Math.random().toString(36) + '00000000').slice(2, 10);
  tables[tableId] = new Table(io, tableId);
  res.status(200).send({table: tableId});
})
http.listen(3000, () => console.log('listening on', 3000));

io.on(Message.Type.Connect, (socket: Socket) => {
  // Disable socket.send
  socket.send = () => {
    throw new Error("Don't use socket.send()!");
  };

  socket.on(Message.Type.Join, (payload: Message.Join.Payload) => {
    const id = payload.table;
    tables[id]?.join(socket, payload);
  });
});

