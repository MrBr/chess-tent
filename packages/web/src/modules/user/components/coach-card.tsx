import React from 'react';
import { hooks, ui } from '@application';
import { Components } from '@types';
import { css } from '@chess-tent/styled-props';

const { Card, Headline6, Text, Row, Col, Line } = ui;

const { useHistory } = hooks;

const { className } = css`
  width: 300px;
  height: 310px;
`;

const CoachCard: Components['CoachCard'] = ({ coach }) => {
  const history = useHistory();

  return (
    <Card className={className}>
      <Card.Img src={coach.state.imageUrl} height={167} />
      <Card.Body>
        <Headline6
          className="mt-1 mb-0 cursor-pointer"
          onClick={() => history.push(`/user/${coach.id}`)}
        >
          {coach.name}
        </Headline6>
        <Text fontSize="extra-small" className="text-truncate" weight={700}>
          {coach.state.punchline}
        </Text>
        <Line />
        <Row>
          <Col>
            <Text className="m-0" fontSize="extra-small">
              FIDE
            </Text>
          </Col>
          <Col>
            <Text className="m-0" fontSize="extra-small">
              {coach.state.elo && `Up to ${coach.state.studentElo} elo`}
            </Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CoachCard;
