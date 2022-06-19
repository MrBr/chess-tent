import React, { ReactNode } from 'react';
import { components, hooks, ui, utils } from '@application';
import { User } from '@chess-tent/models';

const { UserAvatar, Page, MentorshipButton, Header } = components;
const { useHistory, useOpenConversations } = hooks;
const { getCountryByCode } = utils;
const {
  Col,
  Row,
  Headline6,
  Headline4,
  Text,
  Button,
  Container,
  Breadcrumbs,
  Badge,
} = ui;

const Info = ({ label, info }: { label: string; info: ReactNode }) => (
  <Container className="mt-2">
    <Text
      weight={400}
      color="grey"
      inline
      fontSize="extra-small"
      className="me-2"
    >
      {label}
    </Text>
    <Text weight={400} color="black" inline fontSize="extra-small">
      {info}
    </Text>
  </Container>
);

const PageProfile = ({
  user,
  editable,
}: {
  user: User;
  editable?: boolean;
}) => {
  const history = useHistory();
  const [conversationOffset, openConversation] = useOpenConversations();
  const country = user.state.country
    ? getCountryByCode(user.state.country)
    : null;
  return (
    <Page
      header={
        <Header className="border-bottom">
          <Col className="col-auto">
            <Breadcrumbs>
              <Breadcrumbs.Item href="/">Coaches</Breadcrumbs.Item>
              <Breadcrumbs.Item>{user.name}</Breadcrumbs.Item>
            </Breadcrumbs>
          </Col>
          <Col />
          <Col className="col-auto">
            {editable ? (
              <Button
                size="extra-small"
                variant="secondary"
                onClick={() =>
                  history.push({
                    pathname: history.location.pathname,
                    search: '?edit=true',
                  })
                }
              >
                Edit
              </Button>
            ) : (
              <>
                <Button
                  size="extra-small"
                  variant="regular"
                  onClick={() => openConversation(user)}
                  className="me-3"
                >
                  Message
                </Button>
                <MentorshipButton user={user} />
              </>
            )}
          </Col>
        </Header>
      }
    >
      {conversationOffset}
      <Container fluid className="px-5 py-4">
        <Headline4 className="mb-0">{user.name}</Headline4>
        {user.state.punchline && <Text>{user.state.punchline}</Text>}
        <Row>
          <Col className="col-auto mt-4 text-center">
            <UserAvatar user={user} size="large" />
          </Col>
          <Col>
            {user.coach && (
              <Container>
                <Badge bg="success">{user.state.pricing} $/h</Badge>
              </Container>
            )}
            <Info label="Country:" info={`${country?.name} ${country?.flag}`} />
            <Info label="Languages: " info={user.state.languages?.join(', ')} />
          </Col>
          <Col>
            {user.coach && (
              <>
                <Info label="Student elo:" info={user.state.studentElo} />
                <Info label="Availability:" info={user.state.availability} />
                <Info label="Speciality:" info={user.state.speciality} />
              </>
            )}
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <Headline6>About me</Headline6>
            <Text fontSize="extra-small">{user.state.about}</Text>
            <Headline6>Playing experience</Headline6>
            <Text fontSize="extra-small">{user.state.playingExperience}</Text>
          </Col>
          {user.coach && (
            <Col>
              <Headline6>Teaching methodology</Headline6>
              <Text fontSize="extra-small">
                {user.state.teachingMethodology}
              </Text>
              <Headline6>Teaching experience</Headline6>
              <Text fontSize="extra-small">
                {user.state.teachingExperience}
              </Text>
            </Col>
          )}
        </Row>
      </Container>
    </Page>
  );
};

export default PageProfile;
