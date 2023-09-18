import React, { useState, useEffect, ReactNode } from 'react';
import { ui, components, hooks, requests } from '@application';
import { History } from '@types';
import { css } from '@chess-tent/styled-props';
import { User } from '@chess-tent/models';

import coachesImage from '../images/coaches.png';

const { Row, Col, Button, Icon, Text, Card } = ui;
const { CoachCard } = components;
const { useApi, useIsMobile, useHistory } = hooks;
const { publicCoaches } = requests;

const { className: cardClassName } = css`
  width: 300px;
  height: 410px;
  display: flex;
  align-items: center;
  background-image: url(${coachesImage});
  background-size: cover;

  .coaches-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--neutrals-90050, rgba(24, 34, 53, 0.5));
    width: inherit;

    .coaches-info-text {
      text-align: center;
      font-weight: 800;

      color: white;
    }

    .view-coaches-button {
      font-weight: 700;
      font-size: 14px;
      width: fit-content;
    }
  }
`;

const { className: arrowClassName } = css`
  margin-right: 5px;
`;

const LearnMoreCard = ({
  count,
  history,
}: {
  count: number;
  history: History;
}) => (
  <Card className={cardClassName}>
    <Card.Body className="coaches-card-body">
      <Text weight={500} className="coaches-info-text">{`${
        count - 1
      }+ Coaches, 0-2006 ELO, 30+ languages`}</Text>
      <Button
        variant="primary"
        size="small"
        className="view-coaches-button"
        onClick={() => history.push(`/coaches`)}
      >
        View all coaches
      </Button>
    </Card.Body>
  </Card>
);

const Coaches = () => {
  const history = useHistory();

  const { fetch: fetchCoaches, response: coachResponse } =
    useApi(publicCoaches);

  const isMobile = useIsMobile();
  const cardStep = isMobile ? 1 : 3;

  const [cardIndex, setCardIndex] = useState(cardStep);
  const [cards, setCards] = useState<ReactNode[]>([]);
  const [coaches, setCoaches] = useState<User[]>([]);

  const onLeftArrowClick = () => {
    setCardIndex(prevIndex =>
      prevIndex > cardStep ? prevIndex - cardStep : cards.length,
    );
  };

  const onRightArrowClick = () => {
    console.log({ cardIndex });
    setCardIndex(prevIndex =>
      prevIndex <= coaches.length ? prevIndex + cardStep : cardStep,
    );
  };

  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);

  useEffect(() => {
    if (coaches.length > 0 && coachResponse?.data) {
      setCards([
        ...coaches.map(coach => (
          <Col>
            <CoachCard coach={coach} hideOptions />
          </Col>
        )),
        <Col>
          <LearnMoreCard
            count={coachResponse.data.coachCount}
            history={history}
          />
        </Col>,
      ]);
    }
  }, [coaches, coachResponse?.data, history]);

  useEffect(() => {
    if (coachResponse) {
      setCoaches(
        isMobile
          ? coachResponse.data.coaches.slice(0, 3)
          : coachResponse.data.coaches,
      );
    }
  }, [coachResponse, isMobile]);

  return (
    <Row className="pt-4 align-items-center" style={{ overflowX: 'visible' }}>
      <Col md={3} className="pb-5">
        <Text weight={500}>🚀 Learn from our top coaches</Text>
        <Text>
          Match with the coach based on your needs and specific skillset.
        </Text>
        <Button
          variant="regular"
          size="extra-small"
          className={arrowClassName}
          onClick={onLeftArrowClick}
        >
          <Icon type="left" />
        </Button>
        <Button
          variant="regular"
          size="extra-small"
          onClick={onRightArrowClick}
        >
          <Icon type="right" />
        </Button>
      </Col>
      <Col sm={12} md={9} className="d-flex flex-row justify-content-center">
        {cards?.length > 0 &&
          cards.slice(cardIndex - cardStep, cardIndex).map((card, index) => (
            <div key={index} className="px-2">
              {card}
            </div>
          ))}
      </Col>
    </Row>
  );
};

export default Coaches;
