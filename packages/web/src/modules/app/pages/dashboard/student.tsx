import React from 'react';
import { components, hooks, ui } from '@application';
import { User } from '@chess-tent/models';
import Welcome from './welcome';

const { Page, Trainings, ScheduledTrainings, Coaches } = components;
const {
  useUserTrainings,
  useOpenTraining,
  useUserScheduledTrainings,
  useCoaches,
  useHistory,
  useOpenConversations,
} = hooks;
const { Row, Col, Headline5, CardEmpty } = ui;

const DashboardStudent = ({ user }: { user: User }) => {
  const { value: trainings } = useUserTrainings(user);
  const scheduledTrainings = useUserScheduledTrainings(user);
  const history = useHistory();
  const coaches = useCoaches();

  const handleTrainingClick = useOpenTraining();
  const [offcanvas, openConversation] = useOpenConversations();

  const hasStudy = !!scheduledTrainings.value?.length || !!trainings?.length;
  return (
    <Page>
      {offcanvas}
      <Page.Body>
        <Welcome name={user.name} className="mb-4" />
        {coaches.value && coaches.value.length === 0 && <Coaches preview />}

        {!!scheduledTrainings.value?.length && (
          <>
            <Headline5 className="mt-5 mb-3">Upcoming trainings</Headline5>
            <ScheduledTrainings trainings={scheduledTrainings.value} />
          </>
        )}
        <Row className="mt-5 mb-3">
          <Col>
            <Headline5>Studies</Headline5>
          </Col>
        </Row>
        {!!trainings?.length && (
          <Trainings
            trainings={trainings}
            onTrainingClick={handleTrainingClick}
          />
        )}
        {!hasStudy && (
          <Row>
            {!!coaches.value?.length && (
              <Col className="col-auto">
                <CardEmpty
                  title="Get a custom lesson"
                  subtitle="Learn with lessons made specifically for you"
                  cta="Message a coach"
                  onClick={() => openConversation(coaches.value?.[0].coach)}
                  icon="profile"
                />
              </Col>
            )}
            <Col className="col-auto">
              <CardEmpty
                title="Learn with public lesson"
                subtitle="Lessons are "
                cta="Find a lesson"
                onClick={() => history.push('/lessons')}
                icon="profile"
              />
            </Col>
          </Row>
        )}
      </Page.Body>
    </Page>
  );
};

export default DashboardStudent;
