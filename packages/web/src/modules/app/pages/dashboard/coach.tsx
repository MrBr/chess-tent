import React from 'react';
import { components, hooks, ui } from '@application';
import { User } from '@chess-tent/models';
import Welcome from './welcome';

const { Page, ScheduledTrainings, Trainings, LessonTemplates } = components;
const { Button, Row, Col, Headline5, CardEmpty } = ui;
const {
  useMyLessons,
  usePromptNewTrainingModal,
  useUserScheduledTrainings,
  useUserTrainings,
  useStudents,
  useOpenTraining,
  useOpenTemplate,
  useHistory,
} = hooks;

const DashboardCoach = ({ user }: { user: User }) => {
  const trainings = useUserTrainings(user);
  const scheduledTrainings = useUserScheduledTrainings(user);
  const students = useStudents(user);
  const [trainingModal, promptNewTrainingModal] = usePromptNewTrainingModal();
  const lessons = useMyLessons();
  const history = useHistory();

  const handleTemplateClick = useOpenTemplate();
  const handleTrainingClick = useOpenTraining();

  const hasStudents = students.value && students.value.length > 0;
  const didLoad =
    trainings.meta.loaded &&
    scheduledTrainings.meta.loaded &&
    students.meta.loaded;

  if (!didLoad) {
    return null;
  }

  return (
    <Page>
      {trainingModal}
      <Page.Body>
        <Welcome name={user.name} />
        <Row className="mt-5 mb-3">
          <Col>
            <Headline5>Upcoming trainings</Headline5>
          </Col>
          <Col className="col-auto">
            <Button
              onClick={promptNewTrainingModal}
              size="small"
              variant="ghost"
            >
              New training
            </Button>
          </Col>
        </Row>

        {hasStudents && (
          <>
            {!scheduledTrainings.value ||
            scheduledTrainings.value.length === 0 ? (
              <CardEmpty
                title="No upcoming trainings."
                subtitle="Best way to teach is live training."
                cta="Schedule a training"
                onClick={promptNewTrainingModal}
                icon="board"
              />
            ) : (
              <ScheduledTrainings trainings={scheduledTrainings.value} />
            )}
            <Row className="mt-5 mb-3">
              <Col>
                <Headline5>Studies</Headline5>
              </Col>
            </Row>
            {!trainings.value || trainings.value.length === 0 ? null : (
              <Trainings
                trainings={trainings.value}
                onTrainingClick={handleTrainingClick}
              />
            )}
          </>
        )}
        {!hasStudents && (
          <Row>
            <Col>
              <CardEmpty
                title="Want to start coaching?"
                subtitle="You need students to start coaching."
                cta="Invite a student"
                icon="invite"
              />
            </Col>
          </Row>
        )}
        <Row className="mt-5 mb-3">
          <Col>
            <Headline5>Templates</Headline5>
          </Col>
          <Col className="col-auto">
            <Button size="small" variant="ghost">
              Publish lesson
            </Button>
          </Col>
        </Row>
        <LessonTemplates
          lessons={lessons.value}
          onLessonClick={handleTemplateClick}
        />
        {(!lessons.value || lessons.value.length === 0) && (
          <Row>
            <Col>
              <CardEmpty
                title="Want to make a public lesson?"
                subtitle="Start by creating a reusable template."
                cta="Create a template"
                icon="template"
                onClick={() => history.push('/lesson/new')}
              />
            </Col>
          </Row>
        )}
      </Page.Body>
    </Page>
  );
};

export default DashboardCoach;
