import React from 'react';
import {
  Button,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap';
import './Home.scss';

type Props = {
  index: number;
  onClick(index: number): void;
};

export const MainPanel: React.FC<Props> = ({ index, onClick }) => {
  return (
    <div className="home-panel">
      <div className="flex-grow-1 w-100 d-flex flex-column align-items-center justify-content-center">
        <span className="logo">Large Two</span>
        <span className="logo-caption">
          <a href="https://en.wikipedia.org/wiki/Big_two">
            An online Big Two clone
          </a>
        </span>
      </div>
      <Button
        bsPrefix="btn-styled"
        variant="primary"
        onClick={() => onClick(index)}
      >
        CREATE ROOM
      </Button>
    </div>
  );
};

type OptionsFormProps = {
  onSubmit(arg: {
    winCondition: string;
    privateLobby: boolean;
    rounds: number;
  }): void;
};

export const OptionsPanel: React.FC<OptionsFormProps> = ({ onSubmit }) => {
  const [winCondition, setWinCondition] = React.useState('rounds');
  const [privateLobby, setPrivate] = React.useState(true);
  const [rounds, setRounds] = React.useState(1);

  const handleOptionSelect = (option: string) => {
    setWinCondition(option);
  };

  const handleRange = (event: any) => {
    setRounds(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit({ winCondition, privateLobby, rounds });
  };

  const togglePrivate = () => {
    setPrivate(!privateLobby);
  };

  return (
    <div className="home-panel">
      <h1>Options</h1>
      <div className="btn-group home-button-group" role="group">
        <input
          value="rounds"
          type="radio"
          className="btn-check"
          id="rounds-button"
          checked={winCondition === 'rounds'}
          readOnly
        />
        <label
          className="btn-styled btn-secondary"
          htmlFor="rounds-button"
          onClick={() => handleOptionSelect('rounds')}
        >
          Rounds
        </label>
        <input
          value="wins"
          type="radio"
          className="btn-check"
          id="wins-button"
          checked={winCondition === 'wins'}
          readOnly
        />
        <label
          className="btn-styled btn-styled-secondary"
          htmlFor="wins-button"
          onClick={() => handleOptionSelect('wins')}
        >
          Wins
        </label>
      </div>
      <div className="home-range-control">
        <input
          min="1"
          max="10"
          id="win-count"
          type="range"
          onChange={handleRange}
          className="form-range form-range-2"
          value={rounds}
        />
        <h1 className="range-label">{rounds}</h1>
      </div>
      <Button bsPrefix="btn-styled" variant="secondary" onClick={togglePrivate}>
        {privateLobby ? 'Private' : 'Public'}
      </Button>
      <Button bsPrefix="btn-styled" variant="primary" onClick={handleSubmit}>
        OK
      </Button>
    </div>
  );
};
