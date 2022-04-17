import React from 'react';
import { hooks, ui } from '@application';
import {
  LessonActivity,
  LessonActivityRole,
  StepRoot,
} from '@chess-tent/models';
import styled, { css } from '@chess-tent/styled-props';

import LessonThumbnail from './thumbnail';
import UserAvatar from '../../user/components/user-avatar';

const { Row, Col, Headline6, Text, Container } = ui;
const { useHistory } = hooks;

const { className } = css`
  width: 300px;
  padding: 16px;
  position: relative;
  cursor: pointer;
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
  return (
    <Container
      className={className}
      onClick={() => history.push(`/activity/${props.training.id}`)}
    >
      <Row className="g-0 cursor-pointer flex-column">
        <Col className="thumbnail-container">
          <LessonThumbnail stepRoot={stepRoot} />
        </Col>
        <Col>
          <Headline6 className="mt-2 ms-2 m-0">{title}</Headline6>
        </Col>
        <Col>
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
            <Col xs={4}>
              {roles.map(({ user, role }) =>
                role === LessonActivityRole.STUDENT ? (
                  <UserAvatar user={user} />
                ) : null,
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default TrainingCard;
