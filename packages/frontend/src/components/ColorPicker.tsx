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
    width: '50%',
    // height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '0.5em',
    marginBottom: '0.5em',
  },
  button: {
    '&:hover': {
      boxShadow: '0 0 1px 2px black',
      zIndex: 10,
    },
    borderRadius: '50% !important'
  },
  selected: {
    boxShadow: '0 0 1px 2px black',
    zIndex: 10,
  },
})

export const ColorPicker = () => {
  const classes = useStyles();
  const [ color, setColor ] = React.useState('');

  const handleChange = (event: React.MouseEvent<HTMLElement>, value: string | null) => {
    window.localStorage.setItem('color', value);
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
        // style={{
        // }}
        size="large"
      >
        <div />
        {/* <div style={{
          borderRadius: '50% !important'
        }} /> */}
      </ToggleButton>
    )
  };

  return (
    <ToggleButtonGroup 
      className={classes.group} 
      value={color} 
      exclusive
      onChange={handleChange}
    >
      { createButton(colors[0]) }
      { createButton(colors[1]) }
      { createButton(colors[2]) }
      { createButton(colors[3]) }
      { createButton(colors[4]) }
    </ToggleButtonGroup>
  )

}