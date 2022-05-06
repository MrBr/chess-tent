import React, { useState, useCallback } from 'react';
import { hooks, ui, components } from '@application';
import { Chapter } from '@chess-tent/models';
import { VariationStep } from '@types';

import ChaptersDropdown from '../components/chapters-dropdown';
import { createLessonActivity } from '../service';

const { Container, Col, Text, Button, Row, Headline4 } = ui;

const { Page, Chessboard, UserAvatar, DifficultyLabel, Header, Tags } =
  components;
const { Breadcrumbs } = ui;

const {
  useParams,
  useLesson,
  useUserTrainings,
  useActiveUserRecord,
  useOpenTraining,
} = hooks;

const PreviewLesson = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
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
  }, [ownedLessonActivity, openLesson]);

  if (!lesson) {
    return null;
  }

  const activeChapter = chapter || lesson.state.chapters[0];
  const firstStep = activeChapter.state.steps[0] as VariationStep;

  const sidebar = (
    <>
      <Row className="border-bottom">
        <Col>
          <Text>Price</Text>
          <Text>Free</Text>
        </Col>
        <Col>
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
      <Row className="border-bottom">
        <Col>
          <Text>Description</Text>
          <Text>{lesson.state.description}</Text>
        </Col>
      </Row>
      <ChaptersDropdown
        chapters={lesson.state.chapters}
        activeChapter={activeChapter}
        onChange={chapter => setActiveChapter(chapter)}
      />
    </>
  );

  const boardHeader = (
    <div className="mt-5 mb-4">
      <Row className="mb-2">
        <Col>
          <DifficultyLabel difficulty={lesson.difficulty} />
          <Tags tags={lesson.tags} inline className="ms-2" />
        </Col>
      </Row>
      <Headline4>{lesson.state.title}</Headline4>
      <Row className="g-0 align-items-center">
        <Col className="col-auto me-2">
          <Text fontSize="extra-small" className="m-0">
            Created by
          </Text>
        </Col>
        <Col className="col-auto me-1">
          <UserAvatar user={lesson.owner} size="extra-small" />
        </Col>
        <Col className="col-auto">
          <Text fontSize="extra-small" className="m-0" weight={400}>
            <u>{lesson.owner.name}</u>
          </Text>
        </Col>
      </Row>
    </div>
  );

  const pageHeader = (
    <Header className="border-bottom">
      <Col>
        <Breadcrumbs>
          <Breadcrumbs.Item>Back</Breadcrumbs.Item>
          <Breadcrumbs.Item>{lesson.state.title}</Breadcrumbs.Item>
        </Breadcrumbs>
      </Col>
      <Col className="col-auto">
        <Button variant="tertiary" size="extra-small">
          Share
        </Button>
      </Col>
    </Header>
  );

  return (
    <Page header={pageHeader}>
      <Container fluid className="h-100">
        <Row className="h-100">
          <Col xs={12} sm={7}>
            <Chessboard
              fen={firstStep.state.position as string}
              shapes={firstStep.state.shapes}
              footer={null}
              viewOnly
              header={boardHeader}
            />
          </Col>
          <Col sm={5} className="border-start h-100">
            {sidebar}
          </Col>
        </Row>
      </Container>
    </Page>
  );
};

export default PreviewLesson;
