import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/patrick-hand/400.css';
import './scss/override.scss';
import './style.scss';

ReactDOM.render(<App />, document.getElementById('root'));
