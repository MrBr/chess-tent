import React, { useState, useEffect, useMemo } from 'react';
import { ui, components, hooks, requests } from '@application';

import PublicInfo from './components/public-info';

const { Col } = ui;
const { LessonCard } = components;
const { useApi, useIsMobile } = hooks;
const { publicLessons } = requests;

const CARD_STEP = 1;

const Lessons = () => {
  const { fetch: fetchLessons, response: lessonsResponse } =
    useApi(publicLessons);

  const isMobile = useIsMobile();
  const cardCount = isMobile ? 1 : 3;

  const [cardIndex, setCardIndex] = useState(isMobile ? CARD_STEP : cardCount);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const lessons = useMemo(() => {
    if (lessonsResponse?.data) {
      return isMobile ? lessonsResponse.data.slice(0, 3) : lessonsResponse.data;
    }
    return [];
  }, [lessonsResponse, isMobile]);

  const pagedLessons = lessons
    .slice(cardIndex - (isMobile ? CARD_STEP : cardCount), cardIndex)
    .map(lesson => (
      <div key={lesson.id} className="px-2">
        <Col>
          <LessonCard lesson={lesson} />
        </Col>
      </div>
    ));

  return (
    <PublicInfo
      title="Pick a topic"
      description="Choose from a vast collection of lessons that can help you improve
  your gameplay"
      dataLength={lessons.length}
      setCardIndex={setCardIndex}
    >
      {pagedLessons.length > 0 &&
        pagedLessons.map(lessonElement => lessonElement)}
    </PublicInfo>
  );
};

export default Lessons;
