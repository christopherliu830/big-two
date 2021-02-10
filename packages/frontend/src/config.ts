import { v4 as uuid } from 'uuid';

export const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.largetwo.io';
export const SOCKET_URL = process.env.NODE_ENV === 'development' ? 'ws://localhost:3000' : 'wss://api.largetwo.io';

let id = window.localStorage.getItem('playerid');  
if (!id) { 
  window.localStorage.setItem('playerid', uuid());
}
export const PLAYER_ID = id;