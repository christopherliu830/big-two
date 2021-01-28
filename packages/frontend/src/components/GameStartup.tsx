import * as React from 'react';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';

interface GameStartupPrompt {
  onClose?: (arg0: string) => void;
  open: boolean;
}

export const GameStartupPrompt: React.FunctionComponent<GameStartupPrompt> = (
  props
) => {
  const { open, onClose } = props;
  const [show, setShow] = useState(true);
  const [text, setText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose && onClose(text);
    setShow(false);
  };

  return (
    <>
      <Modal show={open} centered>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Enter your name</label>
            <input
              type="text"
              name="username"
              value={text}
              onChange={handleChange}
            />
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
