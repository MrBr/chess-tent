import React, { useState } from 'react';
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
} = ui;

const { Layout, Header, Chessboard } = components;

const { useParams, useLesson } = hooks;

const PreviewLesson = () => {
  const { lessonId } = useParams();
  const { value: lesson } = useLesson(lessonId);
  const [chapter, setActiveChapter] = useState<Chapter>();

  if (!lesson) {
    return null;
  }

  const activeChapter = chapter || lesson.state.chapters[0];
  const firstStep = activeChapter.state.steps[0] as VariationStep;

  const sidebar = (
    <Container className="w-75">
      <Card className="mb-4 mt-5 ">
        {lesson && (
          <LessonThumbnail size="large" difficulty={lesson.difficulty} />
        )}
        <CardBody className="px-4">
          {lesson && (
            <>
              <Headline5 className="mt-2 mb-2">{lesson.state.title}</Headline5>
              <Text fontSize="extra-small" weight={700} className="mb-1">
                {lesson.difficulty}
              </Text>
              <Container className="pl-0 mb-3">
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
            </>
          )}
          <Text>{lesson?.state.description}</Text>
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
              <Button size="small">Start</Button>
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
        />
      </Layout>
    </Page>
  );
};

export default PreviewLesson;
