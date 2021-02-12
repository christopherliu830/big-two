import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { NetworkMessage } from 'common';
import { PLAYER_ID } from '../config';

type Props = {
  owner?: NetworkMessage.PlayerData;
  started?: boolean;
  lenPlayers: number;
  currentActor: NetworkMessage.SetTurn.Payload;
  onStart?(): void;
  onPass?(): void;
};

export const CommandGroup: React.FC<Props> = (props) => {
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

const CommandGroupOwner: React.FC<Props> = ({
  started,
  lenPlayers,
  onStart,
}) => {
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

const CommandGroupMember: React.FC<Props> = ({ started, owner }) => {
  if (!started) {
    return (
      <StyledButtonGroup>
        <Button variant="secondary" bsPrefix="btn-styled" disabled>
          Waiting for {owner && owner.name}...
        </Button>
      </StyledButtonGroup>
    );
  }
};
