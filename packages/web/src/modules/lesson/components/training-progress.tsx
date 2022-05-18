import React from 'react';
import { ui } from '@application';
import { getLessonChapterIndex, LessonActivity } from '@chess-tent/models';

import { isInitialLessonActivity } from '../service';

const { Row, Col, Container, Text, ProgressBar } = ui;

const TrainingProgress = (props: { training: LessonActivity }) => {
  const {
    training: {
      subject: lesson,
      state: { boards, mainBoardId },
    },
  } = props;
  const { activeChapterId } = boards[mainBoardId];
  const initialTraining = isInitialLessonActivity(props.training);
  const max = lesson.state.chapters.length || 1;
  const activeChapterIndex = activeChapterId
    ? getLessonChapterIndex(lesson, activeChapterId)
    : 0;
  return (
    <Container>
      <Row className="g-0 mb-1 justify-content-between">
        <Col className="col-auto">
          <Text fontSize="extra-small" className="m-0">
            {initialTraining ? '' : lesson.state.chapters.length}{' '}
            {initialTraining ? 'Analysis' : 'Chapters'}
          </Text>
        </Col>
        <Col className="col-auto">
          <Text fontSize="extra-small" className="m-0">
            {initialTraining
              ? ''
              : `${((activeChapterIndex / max) * 100).toFixed(0)}%`}
          </Text>
        </Col>
      </Row>
      <Row className="g-0">
        <ProgressBar
          min={0}
          max={max}
          now={initialTraining ? 1 : activeChapterIndex}
        />
      </Row>
    </Container>
  );
};

export default TrainingProgress;
