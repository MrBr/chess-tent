import React, { useEffect } from 'react';
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
  useInviteUser,
  useQuery,
} = hooks;

const DashboardCoach = ({ user }: { user: User }) => {
  const trainings = useUserTrainings(user);
  const scheduledTrainings = useUserScheduledTrainings(user);
  const students = useStudents();
  const [trainingModal, promptNewTrainingModal] = usePromptNewTrainingModal();
  const lessons = useMyLessons();
  const history = useHistory();
  const { training } = useQuery<{ training?: 'true' }>();
  const [inviteUserOffcanvas, promptInvite] = useInviteUser();

  const handleTemplateClick = useOpenTemplate();
  const handleTrainingClick = useOpenTraining();

  const hasStudents = students.value && students.value.length > 0;
  const didLoad =
    trainings.meta.loaded &&
    scheduledTrainings.meta.loaded &&
    students.meta.loaded;

  // This is a temp solution to open the training modal through a link
  useEffect(() => {
    if (training) {
      promptNewTrainingModal();
    }
    // Only valid on mount
    // eslint-disable-next-line
  }, []);

  if (!didLoad) {
    return null;
  }

  return (
    <Page>
      {trainingModal}
      {inviteUserOffcanvas}
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

        {hasStudents &&
          (scheduledTrainings.value?.length ? (
            <ScheduledTrainings trainings={scheduledTrainings.value} />
          ) : (
            <CardEmpty
              title="No upcoming trainings."
              subtitle="Best way to teach is live training."
              cta="Schedule a training"
              onClick={promptNewTrainingModal}
              icon="board"
            />
          ))}
        {!hasStudents && (
          <Row>
            <Col>
              <CardEmpty
                title="Want to start coaching?"
                subtitle="You need students to start coaching."
                cta="Invite a student"
                icon="invite"
                onClick={promptInvite}
              />
            </Col>
          </Row>
        )}

        {hasStudents || trainings.value?.length ? (
          <>
            <Row className="mt-5 mb-3">
              <Col>
                <Headline5>Studies</Headline5>
              </Col>
            </Row>
            {trainings.value?.length ? (
              <Trainings
                trainings={trainings.value}
                onTrainingClick={handleTrainingClick}
              />
            ) : (
              <CardEmpty
                title="No active studies"
                subtitle="Teach your students virtually"
                cta="Create a training"
                icon="board"
                onClick={promptNewTrainingModal}
              />
            )}
          </>
        ) : null}
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
