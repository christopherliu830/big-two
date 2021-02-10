import * as React from 'react';
import { useState, useEffect } from 'react';
import { NetworkMessage } from 'common';
import { Connection } from '../Network';
import './PlayerList.css';

type Props = {
  connection: Connection;
  onChange?(sessions: Array<NetworkMessage.SessionData.Payload>): void;
};

export const PlayerList: React.FC<Props> = ({ connection, onChange }) => {
  const [sessions, setSessions] = useState<
    Array<NetworkMessage.SessionData.Payload>
  >([]);

  const handleSessionsData = (payload: NetworkMessage.SessionData.Payload) => {
    setSessions((sess) => {
      if (!sess.find((s) => s.id === payload.id)) {
        const arr = [...sess, payload];
        return arr;
      } else {
        return sess;
      }
    });
  };

  useEffect(() => {
    onChange && onChange(sessions);
  }, [sessions]);

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
    <div className="paper player-list">
      {/* Todo change chat-button*/}
      <div className="flat-dark chat-button">players</div>
      <div className="body">
        <table>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td className="px-1" style={{ color: session.color }}>
                  {session.name}
                </td>
                <td>{session.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
