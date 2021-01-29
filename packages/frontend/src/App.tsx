import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { Game } from './pages/Game';
import { Home } from './pages/Home';
import { theme } from './theme';

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/:table">
            <Game />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};
