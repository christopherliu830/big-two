import React from 'react';
import { Carousel } from 'bootstrap';
import { useHistory } from 'react-router';
import { Container, Row, Col } from 'react-bootstrap';
import { MainPanel, OptionsPanel } from './Panels';
import { API_URL, PLAYER_ID } from '../config';
import './Home.scss';

export const Home: React.FC = () => {
  const [index, setIndex] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>();
  const history = useHistory();

  React.useEffect(() => {
    const unlisten = history.listen((location, action) => {
      const carousel = Carousel.getInstance(ref.current);
      if (ref.current) {
        (carousel as any).to(location.hash.slice(1)); // Types dont have to yet
        setIndex(index - 1);
      }
    });
    return () => unlisten();
  }, [history]);

  React.useEffect(() => {
    if (ref.current) {
      const carousel = new Carousel(ref.current, {
        interval: 0,
        touch: false,
        wrap: false,
      });
      (carousel as any).to(location.hash.slice(1)); // Types dont have to yet

      // Workaround for event being called on buttons
      ref.current.querySelectorAll('.btn').forEach((button) => {
        button.addEventListener('transitionend', (e) => e.stopPropagation());
      });
    }
  }, [ref.current]);

  const handleClick = (index: number) => {
    if (index === 1) {
      history.push(``);
    } else if (ref.current) {
      history.push(`#${index + 1}`);
    }
  };

  const handleSubmit = ({
    winCondition,
    rounds,
    privateLobby,
  }: {
    winCondition: string;
    rounds: number;
    privateLobby: boolean;
  }) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        rounds: rounds.toString(),
        winCondition: winCondition,
        hidden: privateLobby.toString(),
        owner: PLAYER_ID,
      }),
    };
    fetch(API_URL + '/create-room', options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        history.push(`/${data.table}`);
      });
  };

  return (
    <Container className="h-100" fluid="sm">
      <Row className="h-100">
        <Col className="home-col" xl={6} lg={8} md={10} sm={12}>
          <div
            ref={ref}
            className="home-paper home-carousel paper carousel slide"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <MainPanel index={0} onClick={handleClick} />
              </div>
              <div className="carousel-item">
                <OptionsPanel onSubmit={handleSubmit} />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
