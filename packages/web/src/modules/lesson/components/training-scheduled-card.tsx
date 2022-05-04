import React from 'react';
import { hooks, ui } from '@application';
import { LessonActivity, LessonActivityRole } from '@chess-tent/models';
import { css } from '@chess-tent/styled-props';

import UserAvatar from '../../user/components/user-avatar';

const { Row, Col, Headline6, Container, Text } = ui;
const { useHistory } = hooks;

const { className } = css`
  min-width: 300px;
  padding: 16px;
  position: relative;
  border: 1px solid var(--grey-400-color);
  border-radius: 14px;

  :hover {
    border-color: var(--black-color);
  }

  .training-date {
    height: 92px;
    width: 92px;
    flex-wrap: nowrap;
    flex-direction: column;
    padding: 0;
    align-items: center;
    justify-content: center;
    background: var(--purple-opaque-color);
    border-radius: 8px;
    display: flex;
    color: var(--purple-color);
  }
`;

const TrainingScheduledCard = (props: { training: LessonActivity }) => {
  const {
    training: { title, roles },
  } = props;
  const history = useHistory();
  const date = new Date(props.training.date as unknown as string);
  const coach = roles.find(
    ({ user, role }) =>
      role === LessonActivityRole.COACH || LessonActivityRole.OWNER,
  );

  const openTraining = () => history.push(`/activity/${props.training.id}`);

  return (
    <Container className={className}>
      <Row>
        {date && (
          <Col onClick={openTraining} className="col-auto">
            <div className="training-date">
              <Text
                className="m-0"
                fontSize="large"
                weight={500}
                color="inherit"
              >
                {date.getDate()}
              </Text>
              <Text fontSize="small" className="m-0" color="inherit">
                {date
                  .toLocaleDateString('default', { month: 'long' })
                  .substring(0, 3)}
              </Text>
            </div>
          </Col>
        )}
        <Col className="thumbnail-container" onClick={openTraining}>
          <Row className="g-0 flex-column">
            <Col>
              <Headline6 className="m-0 mb-2">{title || 'Untitled'}</Headline6>
            </Col>
            <Col className="m-0 mb-2">
              Starts at{' '}
              {date.toLocaleTimeString('default', {
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Col>
            <Col>
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
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default TrainingScheduledCard;
