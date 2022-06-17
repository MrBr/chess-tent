import React from 'react';
import { hooks, ui } from '@application';
import { Components } from '@types';
import { css } from '@chess-tent/styled-props';

const { Card, Text, Row, Col, Line } = ui;

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
        <Text
          className="mt-1 mb-0 cursor-pointer"
          onClick={() => history.push(`/user/${coach.id}`)}
          weight={400}
        >
          {coach.name}{' '}
          <Text className="m-0" fontSize="extra-small" inline>
            ({coach.state.elo ? coach.state.elo : 'unrated'})
          </Text>
        </Text>
        <Text fontSize="extra-small" className="text-truncate" weight={400}>
          {coach.state.punchline}
        </Text>
        <Line />
        <Row>
          <Col className="col-auto">
            {coach.state.studentElo ? (
              <Text className="m-0" fontSize="extra-small" inline>
                {coach.state.studentElo &&
                  `Up to ${coach.state.studentElo} elo`}
              </Text>
            ) : (
              'Unrated'
            )}
          </Col>
          {coach.state.languages && <Col className="col-auto"></Col>}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CoachCard;
