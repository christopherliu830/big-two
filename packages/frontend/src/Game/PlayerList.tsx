import * as React from 'react';
import { useState, useEffect } from 'react';
import { PlayerInfo } from '../types';
import { NetworkMessage } from 'common';
import { Connection } from '../Network';
import './PlayerList.css';

type Props = {
  connection: Connection;
};

export const PlayerList: React.FC<Props> = ({ connection }) => {
  const [ sessions, setSessions ] = useState<Array<NetworkMessage.SessionData.Payload>>([]);

  const handleSessionsData = (payload: NetworkMessage.SessionData.Payload) => {
    setSessions(sess => {
      if (!sess.find(s => s.id === payload.id)) {
        return [...sess, payload];
      }
      else return sess;
    })
  }

  useEffect(() => {
    if (connection) {
      connection.on(NetworkMessage.Type.SessionsData, handleSessionsData);
      return () => {
        connection.off(NetworkMessage.Type.SessionsData, handleSessionsData);
      };
    }
    return null;
  }, [connection]);

  return (
    <div className="player-list">
      <header>Players</header>
      <div className="body">
        <table>
          <tbody>
            {sessions.map(session => (
              <tr key={session.id}>
                <td style={{color: session.color}}>{session.name}</td>
                <td>{session.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
