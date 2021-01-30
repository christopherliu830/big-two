import { Button, Dialog, DialogActions, DialogContent, TextField } from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ColorPicker } from '../components/ColorPicker';

interface GameStartupPrompt {
  onClose?: () => void;
  open: boolean;
}


export const GameStartupPrompt: React.FunctionComponent<GameStartupPrompt> = (
  props
) => {
  const { open, onClose } = props;
  const [text, setText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleClose();
  };

  const handleClose = () => {
    if (text.length === 0) return; // Don't close without a name
    window.localStorage.setItem('name', text);
    onClose && onClose();
  }

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            onChange={handleChange}
            value={text}
          />
          <ColorPicker />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary" >Join</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
