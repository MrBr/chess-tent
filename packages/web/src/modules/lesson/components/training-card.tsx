import React from 'react';
import { hooks, ui } from '@application';
import {
  LessonActivity,
  LessonActivityRole,
  StepRoot,
} from '@chess-tent/models';
import { css } from '@chess-tent/styled-props';

import LessonThumbnail from './thumbnail';
import UserAvatar from '../../user/components/user-avatar';
import TrainingProgress from './training-progress';

const { Row, Col, Headline6, Container, Stack, Text } = ui;
const { useHistory } = hooks;

const { className } = css`
  width: 300px;
  height: 345px;
  padding: 16px;
  position: relative;
  border: 1px solid var(--grey-400-color);
  border-radius: 14px;

  .thumbnail-container {
    height: 165px;
    width: 100%;
    position: relative;
  }
`;

const TrainingCard = (props: { training: LessonActivity }) => {
  const {
    training: {
      title,
      subject: lesson,
      state: { boards, mainBoardId },
      roles,
    },
  } = props;
  const history = useHistory();
  const stepRoot = (lesson.state.chapters[0] ||
    boards[mainBoardId][boards[mainBoardId].activeStepId].analysis) as StepRoot;

  const coach = roles.find(
    ({ user, role }) =>
      role === LessonActivityRole.COACH || LessonActivityRole.OWNER,
  );
  const students = roles
    .map(({ user, role }) =>
      role === LessonActivityRole.STUDENT ? (
        <UserAvatar user={user} size="extra-small" />
      ) : null,
    )
    .filter(Boolean);
  const openTraining = () => history.push(`/activity/${props.training.id}`);

  return (
    <Container className={className}>
      <Row className="g-0 mb-3">
        <Col className="thumbnail-container" onClick={openTraining}>
          <LessonThumbnail stepRoot={stepRoot} />
        </Col>
      </Row>
      <Row>
        <Col onClick={openTraining}>
          <Text className="m-0 mb-1" fontSize="extra-small">
            {lesson.difficulty || 'TRAINING'}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col onClick={openTraining}>
          <Headline6 className="m-0 mb-3">{title || 'Untitled'}</Headline6>
        </Col>
      </Row>
      <Row className="mb-2">
        <TrainingProgress training={props.training} />
      </Row>
      <Row className="g-0">
        <Col xs={8}>
          {coach && (
            <>
              <UserAvatar
                user={coach.user}
                size="extra-small"
                className="me-2"
              />
              {coach.user.name}
            </>
          )}
        </Col>
        <Col xs={4} className="text-right">
          <Stack>{students}</Stack>
        </Col>
      </Row>
    </Container>
  );
};

export default TrainingCard;
