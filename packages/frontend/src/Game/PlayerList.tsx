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
    setSessions((current) => {
      const found = current.find((s) => s.player.id === payload.player.id);
      if (!found) {
        return [...current, payload];
      } else {
        const index = current.indexOf(found);
        const copy = [...current];
        copy[index] = payload;
        return copy;
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
            {sessions.map((session) => {
              const { id, name, color } = session.player;
              const { score } = session;
              return (
                <tr key={id}>
                  <td className="px-1" style={{ color }}>
                    {name}
                  </td>
                  <td>{score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
