import React from 'react';
import { hooks, ui } from '@application';
import { Components } from '@types';
import lessonCardImg from '../images/lesson-card.svg';

const { useHistory } = hooks;
const { Container, Img, Headline5, Text, Row, Col, Card } = ui;

const Lessons: Components['Lessons'] = ({ lessons }) => {
  const history = useHistory();
  return (
    <Container fluid>
      <Row>
        {lessons?.map(lesson => (
          <Col key={lesson.id} xs={3}>
            <Card
              onClick={() => history.push(`/lesson/${lesson.id}`)}
              className="cursor-pointer mb-4"
            >
              <Img src={lessonCardImg} />
              <Headline5 className="mt-2 mb-2">{lesson.state.title}</Headline5>
              <Text fontSize="extra-small" weight={700} className="mb-1">
                {lesson.difficulty}
              </Text>
              <div>
                {lesson.tags?.map(({ text }) => (
                  <Text
                    fontSize="extra-small"
                    inline
                    className="mr-1"
                    weight={700}
                  >
                    {text}
                  </Text>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Lessons;
