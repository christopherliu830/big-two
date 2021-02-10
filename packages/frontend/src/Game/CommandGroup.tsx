import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

type Props = {
  owner?: boolean;
  started?: boolean;
  lenPlayers: number;
  onStart?(): void;
  onPass?(): void;
};

export const CommandGroup: React.FC<Props> = (props) => {
  if (props.owner) return <CommandGroupOwner {...props} />;
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

const CommandGroupMember: React.FC<Props> = ({ started, lenPlayers }) => {
  if (!started) {
    return (
      <StyledButtonGroup>
        <Button variant="secondary" bsPrefix="btn-styled" disabled>
          Waiting...
        </Button>
      </StyledButtonGroup>
    );
  }
};
