import React from 'react';
import { hooks, ui, components } from '@application';
// import ChaptersDropdown from '../components/chapters-dropdown';
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
  Icon,
} = ui;

const { Layout, Header, Chessboard } = components;

const { useParams, useLesson } = hooks;

const PreviewLesson = () => {
  const { lessonId } = useParams();

  const { value: lesson } = useLesson(lessonId);

  if (!lesson) {
    return null;
  }

  return (
    <Page fluid className="px-0 h-100">
      <Layout
        header={<Header />}
        sidebar={
          <Container className="w-75">
            <Card className="mb-4 mt-5 ">
              {lesson && (
                <LessonThumbnail size="large" difficulty={lesson.difficulty} />
              )}
              <CardBody className="px-5">
                {lesson && (
                  <>
                    <Headline5 className="mt-2 mb-2">
                      {lesson.state.title}
                    </Headline5>
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
                  <Col className="col-6 d-flex">
                    <Icon type="like" textual />
                    {/* jedna heart druga empty heart */}
                    <div>
                      <Headline3 weight={700}>Free</Headline3>
                      <Text color="inherit">Lifetime access</Text>
                    </div>
                  </Col>
                  <Col className="col-6 d-flex justify-content-end align-items-center">
                    <Button className="mt-4" size="small">
                      Buy lesson
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            {/* <ChaptersDropdown
              chapter={lesson?.state?.chapters}
              // @ts-ignore
              activeChapter={lesson?.state?.chapters?.[0]}
            /> */}
          </Container>
        }
        className="extended-sidebar"
      >
        <Chessboard
          fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          footer={null}
        />
      </Layout>
    </Page>
  );
};

export default PreviewLesson;
