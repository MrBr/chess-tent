import React from 'react';
import { components, hooks, ui, utils } from '@application';
import { Components } from '@types';
import { css } from '@chess-tent/styled-props';

const {
  Card,
  Text,
  Row,
  Col,
  Badge,
  Icon,
  Dropdown,
  Absolute,
  Container,
  Dot,
  Line,
} = ui;
const { MentorshipButton } = components;
const { getCountryByCode } = utils;
const { useHistory, useOpenConversations } = hooks;

const { className } = css`
  width: 300px;
  height: 410px;

  .profile-image {
    height: 298px;
    justify-content: center;
    align-items: center;
    background: var(--tertiary-color);
    display: flex;

    .hug {
      background: rgba(var(--tertiary-color-rgb), 0.7);
    }

    object {
      width: 100%;
      object-fit: cover;
    }

    .piece {
      width: 70px;
      height: 70px;
      margin-top: 105px;
      margin-left: 105px;
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
        <div className="profile-image position-relative">
          <object data={coach.state.imageUrl} height={298} type="image/png">
            <div className="piece white knight" />
          </object>
          <Absolute left={15} top={15}>
            <Badge bg="success">${coach.state.pricing}/h</Badge>
          </Absolute>
          <Absolute bottom={0} className="w-100 hug py-2">
            <Container fluid>
              <Row className="align-items-center">
                <Col className="text-truncate">
                  <Text
                    className="mt-1 mb-0 text-truncate"
                    weight={500}
                    color="light"
                  >
                    <Text inherit color="light">
                      {coach.state.fideTitle}
                    </Text>{' '}
                    {coach.name}
                  </Text>
                </Col>
                <Col className="col-auto">
                  <Dropdown onClick={utils.stopPropagation}>
                    <Dropdown.Toggle collapse className="p-0">
                      <Icon type="more" size="small" variant="light" />
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
                          <MentorshipButton
                            user={coach}
                            textual
                            className="p-0"
                          />
                        </Text>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
              <Row className="g-2 align-items-center mb-2">
                {coach.state.country && (
                  <>
                    <Col className="col-auto">
                      {getCountryByCode(coach.state.country).flag}
                    </Col>
                    <Col className="col-auto d-flex align-items-center">
                      <Dot variant="neutral" size="small" />
                    </Col>
                  </>
                )}
                {coach.state.languages && (
                  <Col className="col-auto">
                    <Text className="mb-0" fontSize="extra-small" color="light">
                      {coach.state.languages.join(', ')}
                    </Text>
                  </Col>
                )}
              </Row>
            </Container>
          </Absolute>
        </div>
        <Card.Body>
          <Text
            fontSize="extra-small"
            className="text-truncate mb-2 pb-1"
            weight={400}
          >
            {coach.state.punchline || ' '}
          </Text>
          <Line />
          <Row className="justify-content-between mt-2 pt-1">
            <Col className="col-auto">
              <Text className="m-0" fontSize="extra-small" inline>
                FIDE {coach.state.elo}
              </Text>
            </Col>
            <Col className="col-auto">
              <Text className="m-0" fontSize="extra-small" inline>
                Student {studentElo}
              </Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default CoachCard;
