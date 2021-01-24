import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GameManager } from './game-core/GameManager';
import { App } from './App';
import * as config from './config.json';


ReactDOM.render(<App/>, document.getElementById(config.entryPoint));
window.addEventListener('contextmenu', e => e.preventDefault());
