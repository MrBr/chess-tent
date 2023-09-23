import React, { useState, useEffect, useMemo } from 'react';
import { ui, components, hooks, requests } from '@application';
import { css } from '@chess-tent/styled-props';

import ViewAllCoachesCard from './components/view-all-coaches-card';

const { Row, Col, Button, Icon, Text } = ui;
const { CoachCard } = components;
const { useApi, useIsMobile } = hooks;
const { publicCoaches } = requests;

const { className: arrowClassName } = css`
  margin-right: 5px;
`;

const CARD_STEP = 1;

const Coaches = () => {
  const { fetch: fetchCoaches, response: coachResponse } =
    useApi(publicCoaches);

  const isMobile = useIsMobile();
  const cardCount = isMobile ? 1 : 3;

  const [cardIndex, setCardIndex] = useState(isMobile ? CARD_STEP : cardCount);

  const onLeftArrowClick = () => {
    setCardIndex(prevIndex =>
      prevIndex > cardCount ? prevIndex - CARD_STEP : coaches.length + 1,
    );
  };

  const onRightArrowClick = () => {
    setCardIndex(prevIndex =>
      prevIndex <= coaches.length ? prevIndex + CARD_STEP : cardCount,
    );
  };

  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);

  const coaches = useMemo(() => {
    if (coachResponse) {
      return isMobile
        ? coachResponse.data.coaches.slice(0, 3)
        : coachResponse.data.coaches;
    }
    return [];
  }, [coachResponse, isMobile]);

  return (
    <Row className="d-flex flex-row pt-4 align-items-center">
      <Col lg={3} className="pb-5">
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
      <Col
        md={12}
        lg={9}
        className="d-flex flex-row overflow-hidden justify-content-center justify-content-md-end"
      >
        {coaches.length > 0 &&
          [
            ...coaches.map((coach, index) => (
              <div key={index} className="px-2">
                <Col>
                  <CoachCard coach={coach} hideOptions />
                </Col>
              </div>
            )),
            <div key={coaches.length} className="px-2">
              <Col>
                <ViewAllCoachesCard
                  count={coachResponse?.data.coachCount || 0}
                />
              </Col>
            </div>,
          ].slice(cardIndex - (isMobile ? CARD_STEP : cardCount), cardIndex)}
      </Col>
    </Row>
  );
};

export default Coaches;
