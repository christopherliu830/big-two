import * as React from 'react';
import { useState, useEffect } from 'react';
import { PlayerInfo } from '../types';
import './PlayerList.css';


export const PlayerList: React.FC = () => {

  return (
    <div className="player-list">
      <header>Players</header>
      <div className="body">
        <table>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  );
};
