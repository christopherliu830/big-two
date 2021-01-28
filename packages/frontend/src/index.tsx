import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import * as config from './config.json';
import './style.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';

ReactDOM.render(<App />, document.getElementById(config.entryPoint));
window.addEventListener('contextmenu', (e) => e.preventDefault());
