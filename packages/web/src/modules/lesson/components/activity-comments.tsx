import React, { useCallback } from 'react';
import { components, hooks, services, ui } from '@application';
import { ActivityComment } from '@types';

import Comment from './activity-comment';

const { Col, Input, Row } = ui;
const { useActiveUserRecord } = hooks;
const { createActivityComment } = services;
const { UserAvatar } = components;

const ActivityComments = ({
  comments,
  addComment,
}: {
  comments?: ActivityComment[];
  addComment: (comment: ActivityComment) => void;
}) => {
  const { value: activeUser } = useActiveUserRecord();
  const handleCommentSubmit = useCallback(
    event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addComment(createActivityComment(activeUser, event.target.value));
        event.target.value = '';
      }
    },
    [addComment, activeUser],
  );

  return (
    <>
      <Row className="mt-3">
        <Col className="col-auto">
          <UserAvatar user={activeUser} size="small" className="mt-1" />
        </Col>
        <Col>
          <Input
            as="textarea"
            rows={1}
            placeholder="Add comment"
            onKeyDown={handleCommentSubmit}
          />
        </Col>
      </Row>
      <Col className="overflow-anchor-none">
        {comments?.map(comment => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </Col>
    </>
  );
};

export default ActivityComments;
