import React, { useMemo } from 'react';
import { components, hooks, ui } from '@application';
import { User } from '@chess-tent/models';
import { groupBy } from 'lodash';

const { useActiveUserRecord, useStudents } = hooks;
const { Container, Row, Col, Headline3, Text, Headline2, Card, CardBody } = ui;
const { Link, MentorshipAction, Page, UserAvatar, MessageButton } = components;

const Students = () => {
  const [user] = useActiveUserRecord() as [User, never, never, never];
  const [students] = useStudents(user);
  const result = useMemo(() => groupBy(students, student => student.approved), [
    students,
  ]);

  return (
    <Page>
      <Headline2>My students</Headline2>
      <Container>
        <Headline3>Pending approval</Headline3>
        <Row>
          {result['undefined']?.map(mentorship => (
            <Card key={`${mentorship.student.id}`}>
              <CardBody>
                <Row noGutters className="mb-3">
                  <Col className="col-auto mr-3">
                    <UserAvatar user={mentorship.student} />
                  </Col>
                  <Col>
                    <Link to={`/user/${mentorship.student.id}`}>
                      <Text>{mentorship.student.name}</Text>
                    </Link>
                  </Col>
                </Row>
                <Row noGutters>
                  <MessageButton
                    user={mentorship.student}
                    className="mr-4"
                    size="extra-small"
                    variant="regular"
                  />
                  <MentorshipAction
                    mentorship={mentorship}
                    text="Accept"
                    className="mr-4"
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
