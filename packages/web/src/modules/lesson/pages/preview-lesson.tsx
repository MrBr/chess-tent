import React, { useState, useCallback } from 'react';
import { hooks, ui, components } from '@application';
import { Chapter } from '@chess-tent/models';
import { VariationStep } from '@types';

import ChaptersDropdown from '../components/chapters-dropdown';
import LessonThumbnail from '../components/thumbnail';

const {
  Container,
  Page,
  Col,
  Card,
  Text,
  Button,
  CardBody,
  Row,
  Headline5,
  Tag,
  Headline3,
  Absolute,
} = ui;

const { Layout, Header, Chessboard, UserAvatar } = components;

const {
  useParams,
  useLesson,
  useUserTrainings,
  useActiveUserRecord,
  useHistory,
} = hooks;

const PreviewLesson = () => {
  const { lessonId } = useParams();
  const history = useHistory();
  const { value: lesson } = useLesson(lessonId);
  const [chapter, setActiveChapter] = useState<Chapter>();
  const { value: user } = useActiveUserRecord();
  const { new: newTraining, value: activities } = useUserTrainings(user);

  const ownedLessonActivity = activities?.find(
    ({ subject }) => subject.id === lessonId,
  );

  const assignLesson = useCallback(() => {
    if (!lesson) {
      return;
    }
    newTraining(lesson, user, { training: false });
  }, [newTraining, lesson, user]);

  const goToLesson = useCallback(() => {
    if (!ownedLessonActivity) {
      return;
    }
    history.push(`/activity/${ownedLessonActivity.id}`);
  }, [history, ownedLessonActivity]);

  if (!lesson) {
    return null;
  }

  const activeChapter = chapter || lesson.state.chapters[0];
  const firstStep = activeChapter.state.steps[0] as VariationStep;

  const sidebar = (
    <Container className="w-75">
      <Card className="mb-4 mt-5 ">
        {ownedLessonActivity && (
          <Absolute left={10} top={10}>
            <Tag variant="light" className="p-2">
              <Text inline>Owned</Text>
            </Tag>
          </Absolute>
        )}
        <LessonThumbnail size="large" difficulty={lesson.difficulty} />
        <CardBody className="px-4">
          <Headline5 className="mt-2 mb-3">{lesson.state.title}</Headline5>
          <Row noGutters>
            <Col className="col-auto mr-1">
              <UserAvatar user={lesson.owner} size="extra-small" />
            </Col>
            <Col>
              <Text fontSize="small">{lesson.owner.name}</Text>
            </Col>
          </Row>
          <Container className="pl-0 mb-2 mt-2">
            <Tag pill variant="primary" className="mr-1">
              <Text fontSize="extra-small" inline weight={700} color="inherit">
                {lesson.difficulty}
              </Text>
            </Tag>
            {lesson.tags?.map(({ text, id }) => (
              <Tag pill key={id} variant="success" className="mr-1">
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
        </CardBody>
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
    <Page fluid className="px-0 h-100">
      <Layout
        className="extended-sidebar"
        header={<Header />}
        sidebar={sidebar}
      >
        <Chessboard
          fen={firstStep.state.position as string}
          shapes={firstStep.state.shapes}
          footer={null}
          viewOnly
          header={boardHeader}
        />
      </Layout>
    </Page>
  );
};

export default PreviewLesson;
