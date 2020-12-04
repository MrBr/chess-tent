import React, { ComponentProps, useCallback } from 'react';
import { ActivityComment, Components } from '@types';
import { components, hooks, services, ui } from '@application';
import { User } from '@chess-tent/models';

const { Tabs, Tab, Container, Col, Row, Input, Text } = ui;
const { UserAvatar } = components;
const { useUser, useActiveUserRecord } = hooks;
const { createActivityComment } = services;

const Comment = ({ comment }: { comment: ActivityComment }) => {
  const user = useUser(comment.userId);
  return (
    <Row className="mt-2">
      <Col className="col-auto pr-0">
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

export default ({
  header,
  tabs,
  activeTab,
  setActiveTab,
  updateActivityStepState,
  activeStepActivityState,
}: ComponentProps<Components['LessonPlayground']>) => {
  const tab = tabs[activeTab];
  const [activeUser] = useActiveUserRecord() as [User, never, never];
  const handleCommentSubmit = useCallback(
    event => {
      if (event.key === 'Enter') {
        updateActivityStepState({
          comments: [
            ...(activeStepActivityState.comments || []),
            createActivityComment(activeUser, event.target.value),
          ],
        });
      }
    },
    [activeStepActivityState.comments, activeUser, updateActivityStepState],
  );
  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        <Col className="pt-5">{tab.board}</Col>
        <Col xs={5} xl={4} className="h-100 pr-5">
          <Row className="h-100 d-flex flex-column">
            <Col className="col-auto mt-5">{header}</Col>
            <Col xs={4} className="mt-5 mw-100 overflow-y-auto">
              <Tabs
                id="activity-tabs"
                activeKey={activeTab}
                onSelect={eventKey =>
                  setActiveTab(parseInt(eventKey as string))
                }
              >
                {tabs.map((tab, index) => (
                  <Tab
                    eventKey={index + ''}
                    key={index}
                    title={tab.title}
                    className="mt-4"
                  >
                    {tab.sidebar}
                  </Tab>
                ))}
              </Tabs>
            </Col>
            <Col className="overflow-y-auto pt-1">
              <Input
                as="textarea"
                placeholder="Add comment"
                onKeyDown={handleCommentSubmit}
              />
              <Container className="mt-3 p-0">
                {activeStepActivityState.comments?.map(comment => (
                  <Comment comment={comment} key={comment.id} />
                ))}
              </Container>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
