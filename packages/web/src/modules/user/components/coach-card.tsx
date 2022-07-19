import React from 'react';
import { components, hooks, ui, utils } from '@application';
import { Components } from '@types';
import { css } from '@chess-tent/styled-props';

const { Card, Text, Row, Col, Line, Icon, Dropdown } = ui;
const { MentorshipButton } = components;
const { getCountryByCode } = utils;
const { useHistory, useOpenConversations } = hooks;

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
  const [conversationOffcanvas, openConversation] = useOpenConversations();

  // TODO - transform to more human friendly text
  const studentElo = `${coach.state.studentEloMin || 0} - ${
    coach.state.studentEloMax || 3000
  }`;
  return (
    <>
      {conversationOffcanvas}
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
          <Row className="align-items-center">
            <Col>
              <Text className="mt-1 mb-0" weight={400}>
                <Text inherit color="secondary">
                  {coach.state.fideTitle}
                </Text>{' '}
                {coach.name}{' '}
                <Text className="m-0" fontSize="extra-small" inline>
                  {coach.state.elo && `(${coach.state.elo})`}
                </Text>{' '}
                {coach.state.country &&
                  getCountryByCode(coach.state.country).flag}
              </Text>
            </Col>
            <Col className="col-auto">
              <Dropdown onClick={utils.stopPropagation}>
                <Dropdown.Toggle collapse className="p-0">
                  <Icon type="more" size="small" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => openConversation(coach)}>
                    <Text fontSize="extra-small" className="mb-0">
                      <Icon type="comment" size="extra-small" /> Message
                    </Text>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Text fontSize="extra-small" className="mb-0">
                      <Icon
                        type="lightbulb"
                        size="extra-small"
                        className="mt-1 me-1"
                      />
                      <MentorshipButton user={coach} textual className="p-0" />
                    </Text>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          <Text fontSize="extra-small" className="text-truncate" weight={400}>
            {coach.state.punchline || ' '}
          </Text>
          <Line />
          <Row className="mt-3">
            <Col className="col-auto">
              <Text className="m-0" fontSize="extra-small" inline>
                Elo {studentElo}
              </Text>
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
    </>
  );
};

export default CoachCard;
