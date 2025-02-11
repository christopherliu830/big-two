import {
  Box,
  Button,
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  makeStyles,
  MenuItem,
  Select,
  Theme,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import React from 'react';

type Props = {
  className: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    primary: {
      width: '100%',
      background: theme.palette.primary.main,
    },
    form: {
      '& > *': {
        marginTop: 5,
        marginBottom: 5,
      },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    formRow: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      width: '100%',
      justifyContent: 'space-between',
    },
    roundSelect: {
      minWidth: '30%',
    },
    formControl: {
      marginLeft: 0,
    },
    normalText: {
      fontSize: '1rem',
    },
  })
);

export const GameOptionsForm: React.FC<Props> = ({ className }) => {
  const [winCondition, setWinCondition] = React.useState('rounds');
  const [rounds, setRounds] = React.useState(1);
  const [hidden, setHidden] = React.useState(true);
  const history = useHistory();
  const classes = useStyles();

  const selectChoices = () =>
    [...Array(10).keys()].map((num) => (
      <MenuItem key={num} value={num + 1}>
        {num + 1}
      </MenuItem>
    ));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    setRounds(event.target.value as number);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCheck = () => {
    setHidden(!hidden);
  };

  const handleFormSubmit = () => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rounds,
        winCondition,
        hidden,
      }),
    };
    fetch('http://localhost:3000/create-room', options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        history.push(`/${data.table}`);
      });
  };

  return (
    <Box
      textAlign="center"
      p="1em"
      display="flex"
      flexDirection="column"
      className={className}
    >
      <h1>Room Options</h1>
      <form className={classes.form}>
        <div className={classes.formRow}>
          <ToggleButtonGroup value={winCondition} exclusive>
            <ToggleButton
              value="rounds"
              classes={{ label: classes.normalText }}
              onClick={() => setWinCondition('rounds')}
            >
              Rounds
            </ToggleButton>
            <ToggleButton
              value="wins"
              classes={{ label: classes.normalText }}
              onClick={() => setWinCondition('wins')}
            >
              Wins
            </ToggleButton>
          </ToggleButtonGroup>
          <Box
            display="flex"
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
          >
            <FormControl style={{ marginLeft: 'auto', width: '50%' }}>
              <Select displayEmpty value={rounds} onChange={handleChange}>
                {selectChoices()}
              </Select>
            </FormControl>
          </Box>
        </div>
        <FormControlLabel
          className={classes.formControl}
          control={<Checkbox checked={!hidden} onChange={handleCheck} />}
          label="Public?"
        />
        <Button className={classes.primary} onClick={handleFormSubmit}>
          Create
        </Button>
      </form>
    </Box>
  );
};
