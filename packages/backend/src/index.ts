import { Socket } from 'socket.io';
import { NetworkMessage as Message } from 'common';
import { Request, Response } from 'express';
import * as cors from 'cors';
import * as express from 'express';
import * as HTTP from 'http';
import { Server } from 'socket.io';
import { BigTwo } from './BigTwo/BigTwo';
import Rooms from './rooms';
import { Table } from './manager';

const app = express();
const http = HTTP.createServer(app);

const io = new Server(http, {
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

app.post('/create-room', (req: Request, res: Response) => {
  // TODO: add support for these haha
  const { rounds, owner } = req.body;
  const tableId = (Math.random().toString(36) + '00000000').slice(2, 10);
  const b2 = new BigTwo({ maxRounds: rounds });
  Rooms.create(tableId, new Table(io, tableId, owner, b2));
  res.status(200).send({ table: tableId });
});
http.listen(3000, () => console.log('listening on', 3000));

io.on(Message.Type.Connect, (socket: Socket) => {
  // Disable socket.send
  socket.send = () => {
    throw new Error("Don't use socket.send()!");
  };

  socket.on(Message.Type.Join, (payload: Message.Join.Payload) => {
    const id = payload.table;
    const table = Rooms.get(id);
    table && table.join(socket, payload);
  });
});
