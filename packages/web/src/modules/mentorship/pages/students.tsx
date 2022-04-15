import React, { useMemo } from 'react';
import { components, hooks, ui } from '@application';
import { groupBy } from 'lodash';

const { useActiveUserRecord, useStudents, useOpenConversations } = hooks;
const {
  Container,
  Row,
  Col,
  Headline3,
  Text,
  Headline2,
  Card,
  CardBody,
  Button,
} = ui;
const { Link, MentorshipAction, Page, UserAvatar } = components;

const Students = () => {
  const { value: user } = useActiveUserRecord();
  const { value: students } = useStudents(user);
  const openConversations = useOpenConversations();
  const result = useMemo(
    () => groupBy(students, student => student.approved),
    [students],
  );

  return (
    <Page>
      <Headline2>My students</Headline2>
      <Container>
        <Headline3>Pending approval</Headline3>
        <Row>
          {result['undefined']?.map(mentorship => (
            <Card key={`${mentorship.student.id}`}>
              <CardBody>
                <Row className="g-0 mb-3">
                  <Col className="col-auto me-3">
                    <UserAvatar user={mentorship.student} />
                  </Col>
                  <Col>
                    <Link to={`/user/${mentorship.student.id}`}>
                      <Text>{mentorship.student.name}</Text>
                    </Link>
                  </Col>
                </Row>
                <Row className="g-0">
                  <Button
                    onClick={() => openConversations(mentorship.student)}
                    className="me-4"
                    size="extra-small"
                    variant="regular"
                  >
                    Message
                  </Button>
                  <MentorshipAction
                    mentorship={mentorship}
                    text="Accept"
                    className="me-4"
                  />
                  <MentorshipAction
                    mentorship={mentorship}
                    approve={false}
                    text="Decline"
                  />
                </Row>
              </CardBody>
            </Card>
          ))}
        </Row>
        <Headline3>Active</Headline3>
        <Row>
          {result['true']?.map(mentorship => (
            <Card key={mentorship.student.id}>
              <CardBody>
                <Row>
                  <Col className="col-auto">
                    <UserAvatar user={mentorship.student} />
                  </Col>
                  <Col>
                    <Link to={`/user/${mentorship.student.id}`}>
                      <Text>{mentorship.student.name}</Text>
                    </Link>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ))}
        </Row>
        <Headline3>Declined</Headline3>
        <Row>
          {result['false']?.map(mentorship => (
            <Card key={mentorship.student.id}>
              <CardBody>
                <Row>
                  <Col className="col-auto">
                    <UserAvatar user={mentorship.student} />
                  </Col>
                  <Col>
                    <Link to={`/user/${mentorship.student.id}`}>
                      <Text>{mentorship.student.name}</Text>
                    </Link>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ))}
        </Row>
      </Container>
    </Page>
  );
};

export default Students;
