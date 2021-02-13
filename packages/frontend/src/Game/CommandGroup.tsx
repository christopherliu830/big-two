import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { NetworkMessage } from 'common';
import { PLAYER_ID } from '../config';

type Props = {
  owner?: NetworkMessage.PlayerData;
  lenPlayers: number;
  current: NetworkMessage.SetTurn.Payload;
  onStart?(): void;
  onPass?(): void;
};

export const CommandGroup: React.FC<Props> = (props) => {
  // If we are in a round
  if (props.current) return <CommandGroupPlaying {...props} />;

  // else
  if (props.owner && props.owner.id === PLAYER_ID)
    return <CommandGroupOwner {...props} />;
  else return <CommandGroupMember {...props} />;
};

const StyledButtonGroup: React.FC = (props) => (
  <ButtonGroup
    style={{
      marginLeft: '-2px',
      marginTop: '-2px',
      borderRadius: 0,
    }}
    {...props}
  />
);

const CommandGroupOwner: React.FC<Props> = ({ lenPlayers, onStart }) => {
  return (
    <StyledButtonGroup>
      <Button
        variant="secondary"
        bsPrefix="btn-styled"
        disabled={lenPlayers < 2}
        onClick={() => onStart && onStart()}
      >
        {lenPlayers < 2 ? 'Waiting...' : 'Start'}
      </Button>
    </StyledButtonGroup>
  );
};

const CommandGroupMember: React.FC<Props> = (props) => {
  const { owner } = props;
  return (
    <StyledButtonGroup>
      <Button variant="secondary" bsPrefix="btn-styled" disabled>
        Waiting for {owner && owner.name}...
      </Button>
    </StyledButtonGroup>
  );
};

const CommandGroupPlaying: React.FC<Props> = ({ current, onPass }) => {
  return (
    <StyledButtonGroup>
      {current.id !== PLAYER_ID ? (
        <Button variant="secondary" bsPrefix="btn-styled" disabled>
          {current.name}'s turn...
        </Button>
      ) : (
        <Button variant="primary" bsPrefix="btn-styled" onClick={onPass}>
          Pass
        </Button>
      )}
    </StyledButtonGroup>
  );
};
