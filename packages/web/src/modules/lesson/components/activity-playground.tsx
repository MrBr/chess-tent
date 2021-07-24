import React, { ComponentProps, useCallback } from 'react';
import {
  ActivityComment,
  ActivityStepMode,
  Components,
  LessonPlaygroundTab,
} from '@types';
import { components, hooks, services, ui } from '@application';

const { Tabs, Tab, Container, Col, Row, Input, Text } = ui;
const { UserAvatar } = components;
const { useUser, useActiveUserRecord } = hooks;
const { createActivityComment } = services;

const Comment = ({ comment }: { comment: ActivityComment }) => {
  const user = useUser(comment.userId);
  return (
    <Row className="mt-2" noGutters>
      <Col className="col-auto pr-0 mr-2">
        <UserAvatar user={user} />
      </Col>
      <Col className="justify-content-center d-flex flex-column">
        <Text
          className="mb-0"
          fontSize="extra-small"
          weight={700}
          color="subtitle"
        >
          {user.name}
        </Text>
        <Text className="mb-0" weight={400} fontSize="small">
          {comment.text}
        </Text>
      </Col>
    </Row>
  );
};

const DEFAULT_PLAYGROUND_MODE = ActivityStepMode.SOLVING;

export default ({
  header,
  tabs,
  updateStepMode,
  updateActivityStepState,
  activeStepActivityState,
}: ComponentProps<Components['LessonPlayground']>) => {
  const tab = tabs.find(
    ({ mode }) =>
      mode === (activeStepActivityState.mode || DEFAULT_PLAYGROUND_MODE),
  ) as LessonPlaygroundTab;
  const { value: activeUser } = useActiveUserRecord();
  const handleCommentSubmit = useCallback(
    event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        updateActivityStepState({
          comments: [
            ...(activeStepActivityState.comments || []),
            createActivityComment(activeUser, event.target.value),
          ],
        });
        event.target.value = '';
      }
    },
    [activeStepActivityState.comments, activeUser, updateActivityStepState],
  );
  return (
    <Container fluid className="h-100 overflow-y-auto">
      <Row className="h-100">
        <Col className="pt-5">{tab.board}</Col>
        <Col md={5} xl={4} className="h-100 pr-5 pl-5 ">
          <Row className="h-100 d-flex flex-column flex-nowrap" noGutters>
            <Col className="col-auto mt-5">{header}</Col>
            <Col xs={4} className="mt-5 mw-100 overflow-y-auto">
              <Tabs
                id="activity-tabs"
                activeKey={tab.mode || DEFAULT_PLAYGROUND_MODE}
                onSelect={status => updateStepMode(status as ActivityStepMode)}
              >
                {tabs.map(tab => (
                  <Tab
                    eventKey={tab.mode}
                    key={tab.mode}
                    title={tab.title}
                    className="mt-4"
                  >
                    {tab.sidebar}
                  </Tab>
                ))}
              </Tabs>
            </Col>
            <Col className="pt-1 col-auto">
              <Input
                as="textarea"
                rows={1}
                placeholder="Add comment"
                onKeyDown={handleCommentSubmit}
              />
            </Col>
            <Row className="flex-grow-1 mt-3 overflow-y-auto flex-column-reverse no-gutters">
              <Col className="overflow-anchor-none">
                {activeStepActivityState.comments?.map(comment => (
                  <Comment comment={comment} key={comment.id} />
                ))}
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
