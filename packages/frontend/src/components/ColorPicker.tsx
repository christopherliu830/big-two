import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';

const colors = [
  '#363e18',
  '#422a10',
  '#381c2f',
  '#181931',
  '#163331',
]

const useStyles = makeStyles({
  group: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '0.5em',
    marginBottom: '0.5em',
  }
})

export const ColorPicker = () => {
  const classes = useStyles();

  return (
    <ToggleButtonGroup className={classes.group}>
      <ToggleButton value="0" style={{ backgroundColor: colors[0] }}>
        <div style={{
          backgroundColor: colors[0],
          width: '100%',
          height: '100%',
        }} />
      </ToggleButton>
      <ToggleButton value="1" style={{ backgroundColor: colors[1] }}>
        <div style={{
          backgroundColor: colors[0],
          width: '100%',
          height: '100%',
        }} />
      </ToggleButton>
      <ToggleButton value="2" style={{ backgroundColor: colors[2] }}>
        <div style={{
          backgroundColor: colors[0],
          width: '100%',
          height: '100%',
        }} />
      </ToggleButton>
      <ToggleButton value="3" style={{ backgroundColor: colors[3] }}>
        <div style={{
          backgroundColor: colors[0],
          width: '100%',
          height: '100%',
        }} />
      </ToggleButton>
      <ToggleButton value="4" style={{ backgroundColor: colors[4] }}>
        <div style={{
          backgroundColor: colors[0],
          width: '100%',
          height: '100%',
        }} />
      </ToggleButton>
    </ToggleButtonGroup>
  )

}