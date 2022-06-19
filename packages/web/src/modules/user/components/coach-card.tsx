import React from 'react';
import { hooks, ui, utils } from '@application';
import { Components } from '@types';
import { css } from '@chess-tent/styled-props';

const { Card, Text, Row, Col, Line } = ui;
const { getCountryByCode } = utils;

const { useHistory } = hooks;

const { className } = css`
  width: 300px;
  height: 310px;

  .profile-image {
    height: 167px;
    justify-content: center;
    align-items: center;
    background: var(--tertiary-color);
    display: flex;

    img {
      width: auto;
    }

    .piece {
      width: 70px;
      height: 70px;
      margin-top: 45px;
    }
  }
`;

const CoachCard: Components['CoachCard'] = ({ coach }) => {
  const history = useHistory();

  return (
    <Card
      className={className}
      onClick={() => history.push(`/user/${coach.id}`)}
    >
      <div className="profile-image">
        <object data={coach.state.imageUrl} height={167} type="image/png">
          <div className="piece white knight" />
        </object>
      </div>
      <Card.Body>
        <Text className="mt-1 mb-0 cursor-pointer" weight={400}>
          {coach.name}{' '}
          <Text className="m-0" fontSize="extra-small" inline>
            ({coach.state.elo ? coach.state.elo : 'unrated'})
          </Text>{' '}
          {coach.state.country && getCountryByCode(coach.state.country).flag}
        </Text>
        <Text fontSize="extra-small" className="text-truncate" weight={400}>
          {coach.state.punchline || ' '}
        </Text>
        <Line />
        <Row className="mt-3">
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
          {coach.state.languages && (
            <Col className="col-auto">
              <Text fontSize="extra-small">
                {coach.state.languages.join(', ')}
              </Text>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CoachCard;
