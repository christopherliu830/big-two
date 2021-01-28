import * as React from 'react';
import { useState, useEffect } from 'react';
import { PlayerInfo } from '../types';
import './PlayerList.css';

interface PlayerList {
  players: any[];
}
export const PlayerList: React.FunctionComponent = (props) => {
  const [playerInfos, setPlayerInfos] = useState([]);

  useEffect(() => {
    const updatePlayerInfos = (data: any) => {
      setPlayerInfos(data.players);
    };
  }, []);

  console.log(playerInfos);

  return (
    <div className="player-list">
      <header>Players</header>
      <div className="body">
        <table>
          <tbody>
            {playerInfos.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
