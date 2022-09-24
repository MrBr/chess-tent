import React, { ReactNode } from 'react';
import { components, hooks, ui, utils } from '@application';
import { User } from '@chess-tent/models';
import { Icons } from '@types';
import AlertPublicProfile from '../components/AlertPublicProfile';

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
  Icon,
} = ui;

const Info = ({
  label,
  info,
  icon,
}: {
  label: string;
  info: ReactNode;
  icon: Icons;
}) => (
  <Container className="mt-2">
    <Text
      weight={400}
      color="grey"
      inline
      fontSize="extra-small"
      className="me-2"
    >
      <Icon type={icon} size="extra-small" className="me-1" />
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
              <Breadcrumbs.Item>User profile</Breadcrumbs.Item>
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
      <Page.Body className="py-4">
        <AlertPublicProfile />
        <Headline4 className="mb-0">
          <Text inherit color="secondary">
            {user.state.fideTitle}
          </Text>{' '}
          {user.name}{' '}
          {user.state.elo && (
            <Text color="grey" inline>
              ({user.state.elo})
            </Text>
          )}
        </Headline4>
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
            <Info
              icon="profile"
              label="Country:"
              info={`${country?.name || ''} ${country?.flag || ''}`}
            />
            <Info
              icon="published"
              label="Languages: "
              info={user.state.languages?.join(', ')}
            />
          </Col>
          <Col>
            {user.coach && (
              <>
                <Info
                  icon="barChart"
                  label="Student elo:"
                  info={`${user.state.studentEloMin || 0} - ${
                    user.state.studentEloMax || 3000
                  }`}
                />
                <Info
                  icon="time"
                  label="Availability:"
                  info={user.state.availability}
                />
                <Info
                  icon="team"
                  label="Speciality:"
                  info={user.state.speciality}
                />
              </>
            )}
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <Headline6>About me</Headline6>
            <Text fontSize="extra-small" className="mb-4">
              {user.state.about}
            </Text>
            <Headline6>Playing experience</Headline6>
            <Text fontSize="extra-small">{user.state.playingExperience}</Text>
          </Col>
          {user.coach && (
            <Col>
              <Headline6>Teaching methodology</Headline6>
              <Text fontSize="extra-small" className="mb-4">
                {user.state.teachingMethodology}
              </Text>
              <Headline6>Teaching experience</Headline6>
              <Text fontSize="extra-small">
                {user.state.teachingExperience}
              </Text>
            </Col>
          )}
        </Row>
      </Page.Body>
    </Page>
  );
};

export default PageProfile;
