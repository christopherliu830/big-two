import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import './style.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import { API_URL } from './config';

ReactDOM.render(<App />, document.getElementById('root'));
window.addEventListener('contextmenu', (e) => e.preventDefault());
