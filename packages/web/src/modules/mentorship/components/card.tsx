import React, { ReactNode } from 'react';
import styled from '@chess-tent/styled-props';
import { components, ui } from '@application';
import { User } from '@chess-tent/models';

const { Row, Col, Text, Card } = ui;
const { UserAvatar, Link } = components;

interface MentorshipCardProps {
  user: User;
  className?: string;
  children?: ReactNode;
}

const MentorshipCard = styled<MentorshipCardProps>(
  ({ className, user, children }) => (
    <Card className={className}>
      <Card.Body>
        <Row>
          <Col className="col-auto">
            <UserAvatar user={user} />
          </Col>
          <Col>
            <Link to={`/user/${user.id}`}>
              <Text>{user.name}</Text>
            </Link>
          </Col>
        </Row>
        <Row>{children}</Row>
      </Card.Body>
    </Card>
  ),
).css`
width: 300px;
`;

export default MentorshipCard;
