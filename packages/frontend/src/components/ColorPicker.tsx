import React from 'react';
import { ToggleButton, ToggleButtonGroup, ToggleButtonProps } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';

const colors = [
  '#2d5b6b',
  '#c47a53',
  '#8f4731',
  '#52494c',
  '#7b7d2a',
]

const useStyles = makeStyles({
  group: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '0.5em',
    marginBottom: '0.5em',
  },
  button: {
    flexGrow: 1,
    '&:hover': {
      boxShadow: '0 0 1px 2px black',
      zIndex: 10,
    },
  },
  selected: {
    boxShadow: '0 0 1px 2px black',
    zIndex: 10,
  },
})

interface StylizedButtonProps extends ToggleButtonProps {
  color: string;
}

export const ColorPicker = () => {
  const classes = useStyles();
  const [ color, setColor ] = React.useState(colors[0]);

  const handleChange = (event: React.MouseEvent<HTMLElement>, value: string | null) => {
    console.log(value);
    setColor(value);
  }

  const createButton = (color:string) => {
    return (
      <ToggleButton 
        value={color}
        style={{ 
          backgroundColor: color, 
        }}
        classes={{
          root: classes.button,
          selected: classes.selected
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
        }} />
      </ToggleButton>
    )
  };

  return (
    <ToggleButtonGroup 
      className={classes.group} 
      value={color} 
      exclusive
      onChange={handleChange}
      size="large"
    >
      { createButton(colors[0]) }
      { createButton(colors[1]) }
      { createButton(colors[2]) }
      { createButton(colors[3]) }
      { createButton(colors[4]) }
    </ToggleButtonGroup>
  )

}