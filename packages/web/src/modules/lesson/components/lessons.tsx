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
              className="cursor-pointer"
            >
              <Img src={lessonCardImg} />
              <Headline5 className="mt-2">Lesson Title</Headline5>
              <Text fontSize="extra-small" weight={700}>
                Category
              </Text>
              <Text fontSize="small">Description</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Lessons;
