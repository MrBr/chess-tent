import React, { useState, useEffect, useMemo } from 'react';
import { ui, components, hooks, requests } from '@application';

import ViewAllCard from './components/view-all-card';
import PublicInfo from './components/public-info';

import coachesImage from '../images/coaches.png';

const { Col } = ui;
const { CoachCard } = components;
const { useApi, useIsMobile, useHistory } = hooks;
const { publicCoaches } = requests;

const CARD_STEP = 1;

const Coaches = () => {
  const { fetch: fetchCoaches, response: coachResponse } =
    useApi(publicCoaches);

  const history = useHistory();
  const isMobile = useIsMobile();
  const cardCount = isMobile ? 1 : 3;

  const [cardIndex, setCardIndex] = useState(isMobile ? CARD_STEP : cardCount);

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

  const pagedCoaches = coaches
    .slice(cardIndex - (isMobile ? CARD_STEP : cardCount), cardIndex)
    .map(coach => (
      <div key={coach.id} className="px-2">
        <Col>
          <CoachCard coach={coach} hideOptions />
        </Col>
      </div>
    ));

  return (
    <PublicInfo
      title="Learn from our top coaches"
      description="Match with the coach based on your needs and specific skillset"
      dataLength={coaches.length}
      setCardIndex={setCardIndex}
      hasExtraCard
    >
      {pagedCoaches.length > 0 &&
        pagedCoaches.map(coachElement => coachElement)}
      {pagedCoaches.length < cardCount && (
        <div key={coaches.length} className="px-2">
          <Col>
            <ViewAllCard
              caption={`${
                coachResponse?.data.coachCount || 0
              }+ Coaches, 0-2006 ELO, 30+ languages`}
              buttonText="View all coaches"
              backgroundImage={coachesImage}
              onClick={() => history.push(`/coaches`)}
            />
          </Col>
        </div>
      )}
    </PublicInfo>
  );
};

export default Coaches;
