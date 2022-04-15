import React from 'react';
import { ActivityComment } from '@types';
import { components, hooks, ui } from '@application';

const { Col, Row, Text } = ui;
const { UserAvatar } = components;
const { useUser } = hooks;

const Comment = ({ comment }: { comment: ActivityComment }) => {
  const user = useUser(comment.userId);
  return (
    <Row className="mt-2" g-0>
      <Col className="col-auto pr-0 me-2">
        <UserAvatar user={user} />
      </Col>
      <Col className="justify-content-center d-flex flex-column">
        <Text className="mb-0" fontSize="extra-small" weight={700}>
          {user.name}
        </Text>
        <Text className="mb-0" weight={400} fontSize="small">
          {comment.text}
        </Text>
      </Col>
    </Row>
  );
};

export default Comment;
