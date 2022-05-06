import React, { useState, useCallback } from 'react';
import { hooks, ui, components } from '@application';
import { Chapter } from '@chess-tent/models';
import { VariationStep } from '@types';

import ChaptersDropdown from '../components/chapters-dropdown';
import LessonThumbnail from '../components/thumbnail';
import { createLessonActivity } from '../service';

const {
  Container,
  Col,
  Card,
  Text,
  Button,
  Row,
  Headline5,
  Tag,
  Headline3,
  Absolute,
} = ui;

const { Page, Chessboard, UserAvatar } = components;

const {
  useParams,
  useLesson,
  useUserTrainings,
  useActiveUserRecord,
  useHistory,
  useOpenTraining,
} = hooks;

const PreviewLesson = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const history = useHistory();
  const { value: lesson } = useLesson(lessonId as string);
  const [chapter, setActiveChapter] = useState<Chapter>();
  const { value: user } = useActiveUserRecord();
  const { new: newTraining, value: activities } = useUserTrainings(user);
  const openLesson = useOpenTraining();

  const ownedLessonActivity = activities?.find(
    ({ subject }) => subject.id === lessonId,
  );

  const assignLesson = useCallback(() => {
    if (!lesson) {
      return;
    }
    const activity = createLessonActivity(lesson, user, {});
    newTraining(activity);
  }, [newTraining, lesson, user]);

  const goToLesson = useCallback(() => {
    if (!ownedLessonActivity) {
      return;
    }
    openLesson(ownedLessonActivity);
  }, [history, ownedLessonActivity, openLesson]);

  if (!lesson) {
    return null;
  }

  const activeChapter = chapter || lesson.state.chapters[0];
  const firstStep = activeChapter.state.steps[0] as VariationStep;

  const sidebar = (
    <Container>
      <Card className="mb-4 mt-5 ">
        {ownedLessonActivity && (
          <Absolute left={10} top={10}>
            <Tag bg="light" className="p-2">
              <Text inline>Owned</Text>
            </Tag>
          </Absolute>
        )}
        <LessonThumbnail stepRoot={lesson.state.chapters[0]} />
        <Card.Body className="px-4">
          <Headline5 className="mt-2 mb-3">{lesson.state.title}</Headline5>
          <Row className="g-0">
            <Col className="col-auto me-1">
              <UserAvatar user={lesson.owner} size="extra-small" />
            </Col>
            <Col>
              <Text fontSize="small">{lesson.owner.name}</Text>
            </Col>
          </Row>
          <Container className="pl-0 mb-2 mt-2">
            <Tag pill bg="primary" className="me-1">
              <Text
                fontSize="extra-small"
                as="span"
                weight={700}
                color="inherit"
              >
                {lesson.difficulty}
              </Text>
            </Tag>
            {lesson.tags?.map(({ text, id }) => (
              <Tag pill key={id} bg="success" className="me-1">
                <Text
                  fontSize="extra-small"
                  inline
                  weight={700}
                  color="inherit"
                >
                  {text}
                </Text>
              </Tag>
            ))}
          </Container>
          <Text fontSize="small" className="mb-3">
            {lesson?.state.description}
          </Text>
          <Row>
            <Col className="col-6">
              <Headline3 weight={700} className="mb-0 mt-0">
                Free
              </Headline3>
              <Text color="inherit" fontSize="small">
                Lifetime access
              </Text>
            </Col>
            <Col className="col-6 d-flex justify-content-end align-items-center">
              {ownedLessonActivity ? (
                <Button size="small" onClick={goToLesson} variant="secondary">
                  Continue
                </Button>
              ) : (
                <Button size="small" onClick={assignLesson}>
                  Start
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <ChaptersDropdown
        chapters={lesson.state.chapters}
        activeChapter={activeChapter}
        onChange={chapter => setActiveChapter(chapter)}
      />
    </Container>
  );

  const boardHeader = (
    <div className="mt-5">
      <Text onClick={history.goBack}>Back</Text>
    </div>
  );

  return (
    <Page>
      <Container fluid>
        <Row>
          <Col xs={12} sm={7}>
            <Chessboard
              fen={firstStep.state.position as string}
              shapes={firstStep.state.shapes}
              footer={null}
              viewOnly
              header={boardHeader}
            />
          </Col>
          <Col sm={5}>{sidebar}</Col>
        </Row>
      </Container>
    </Page>
  );
};

export default PreviewLesson;
