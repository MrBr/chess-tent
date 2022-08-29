import React, { useState, useCallback } from 'react';
import { hooks, ui, components } from '@application';
import { Chapter } from '@chess-tent/models';
import { VariationStep } from '@types';

import { createLessonActivity } from '../service';

const { Container, Col, Text, Button, Row, Headline4, Breadcrumbs, Icon } = ui;

const { Page, Chessboard, UserAvatar, DifficultyLabel, Header, Tags, Share } =
  components;

const {
  useParams,
  useLesson,
  useUserTrainings,
  useActiveUserRecord,
  useOpenTraining,
  usePrompt,
} = hooks;

const PreviewLesson = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { value: lesson } = useLesson(lessonId as string);
  const [chapter, setActiveChapter] = useState<Chapter>();
  const { value: user } = useActiveUserRecord();
  const { new: newTraining, value: activities } = useUserTrainings(user);
  const openLesson = useOpenTraining();
  const [shareOffcanvas, promptShare] = usePrompt(close => (
    <Share
      close={close}
      title="Share lesson"
      link={window.location.href}
      description="Copy the link and share it with your friends."
    />
  ));

  const ownedLessonActivity = activities?.find(
    ({ subject }) => subject.id === lessonId,
  );

  const assignLesson = useCallback(async () => {
    if (!lesson) {
      return;
    }
    const activity = createLessonActivity(lesson, user, {});
    await newTraining(activity);
    openLesson(activity);
  }, [newTraining, lesson, user, openLesson]);

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
      <Row className="border-bottom align-items-center px-3 py-4">
        <Col>
          <Text fontSize="extra-small" className="mb-0">
            Price
          </Text>
          <Text weight={500} className="mb-0">
            Free
          </Text>
        </Col>
        <Col className="col-auto">
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
      <Row className="border-bottom px-3 py-4">
        <Col>
          <Text fontSize="small" weight={500} className="mb-1">
            Description
          </Text>
          <Text fontSize="small">{lesson.state.description}</Text>
        </Col>
      </Row>
      <Row className="px-3 py-4">
        <Col>
          <Text fontSize="small" weight={500}>
            Chapters
          </Text>
          {lesson.state.chapters.map((chapter, index) => (
            <Text
              onClick={() => setActiveChapter(chapter)}
              className="cursor-pointer"
            >
              <Icon
                type="play"
                className="me-2"
                variant={activeChapter === chapter ? 'secondary' : 'tertiary'}
              />
              <span className="me-2">
                {index < 9 ? '0' + (index + 1) : index + 1}
              </span>
              {chapter.state.title}
            </Text>
          ))}
        </Col>
      </Row>
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
        <Button variant="tertiary" size="extra-small" onClick={promptShare}>
          Share
        </Button>
      </Col>
    </Header>
  );

  return (
    <Page header={pageHeader}>
      {shareOffcanvas}
      <Container fluid className="h-100">
        <Row className="h-100">
          <Col xs={12} sm={7} className="h-75 h-sm-auto">
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
