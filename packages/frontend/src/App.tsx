import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { Game } from './Game/Game';
import { Home } from './Home/Home';
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
