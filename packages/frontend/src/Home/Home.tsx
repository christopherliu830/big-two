import React from 'react';
import { Box, Button, Grid, Paper, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { GameOptionsForm } from './GameOptionsForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      margin: '5px',
    },
    primary: {
      margin: '5px',
      background: theme.palette.primary.main,
    },
    secondary: {
      background: theme.palette.secondary.main,
      margin: '5px',
    },
    wrapper: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      scrollbarWidth: 'none',
    },
    panel: {
      position: 'relative',
      left: 0,
      width: '300%',
      height: '100%',
      display: 'flex',
      flexFlow: 'row nowrap',
      transition: 'left 0.33s',
      transitionTimingFunction: 'ease-in-out',
    },
    panelItem: {
      display: 'flex',
      p: '1em',
      flex: '0 0 33.333333%',
    },
  })
);

export const Home: React.FC = () => {
  const classes = useStyles();
  const ref = React.useRef<HTMLDivElement>();

  const handleClick = () => {
    if (ref.current) {
      ref.current.style.left = `-100%`;
    }
  };

  return (
    <Grid container className={classes.container}>
      <Grid item xs={4}>
        <Paper elevation={4} className={classes.wrapper}>
          <div ref={ref} className={classes.panel}>
            <Box
              textAlign="center"
              p="1em"
              display="flex"
              flexDirection="column"
              justifyContent="end"
              className={classes.panelItem}
            >
              <h1 style={{ marginBottom: 'auto' }}>Large Two</h1>
              <Button className={classes.primary} onClick={handleClick}>
                Create a room
              </Button>
              {/* <Button className={classes.secondary}>Browse</Button> */}
            </Box>

            <GameOptionsForm className={classes.panelItem} />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};
