import React, { useCallback } from 'react';
import { hooks, services, ui } from '@application';
import { ActivityComment } from '@types';

import Comment from './activity-comment';

const { Col, Input } = ui;
const { useActiveUserRecord } = hooks;
const { createActivityComment } = services;

export default ({
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
      <Col className="overflow-anchor-none">
        {comments?.map(comment => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </Col>
      <Col className="pt-1 col-auto">
        <Input
          as="textarea"
          rows={1}
          placeholder="Add comment"
          onKeyDown={handleCommentSubmit}
        />
      </Col>
    </>
  );
};
