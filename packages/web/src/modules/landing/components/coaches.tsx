import React, { useState, useEffect, ReactNode } from 'react';
import { ui, components, hooks, requests } from '@application';
import { css } from '@chess-tent/styled-props';
import { User } from '@chess-tent/models';

import ViewAllCoachesCard from './components/view-all-coaches-card';

const { Row, Col, Button, Icon, Text } = ui;
const { CoachCard } = components;
const { useApi, useIsMobile } = hooks;
const { publicCoaches } = requests;

const { className: arrowClassName } = css`
  margin-right: 5px;
`;

const Coaches = () => {
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
          <ViewAllCoachesCard count={coachResponse.data.coachCount} />
        </Col>,
      ]);
    }
  }, [coaches, coachResponse?.data]);

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
