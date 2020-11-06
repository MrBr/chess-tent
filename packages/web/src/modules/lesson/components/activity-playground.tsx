import React, { ComponentProps } from 'react';
import { Components } from '@types';
import { components, ui } from '@application';

const { Tabs, Tab, Container, Col, Row } = ui;
const { LessonPlaygroundSidebar } = components;

export default ({
  header,
  tabs,
  activeTab,
  setActiveTab,
}: ComponentProps<Components['LessonPlayground']>) => {
  const tab = tabs[activeTab];
  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        <Col className="pt-5">{tab.board}</Col>
        <Col xs={5} xl={4} className="h-100 overflow-y-auto pt-4">
          <LessonPlaygroundSidebar header={header}>
            <Tabs
              id="activity-tabs"
              activeKey={activeTab}
              onSelect={(eventKey: string) => setActiveTab(parseInt(eventKey))}
            >
              {tabs.map((tab, index) => (
                <Tab eventKey={index} title={tab.title} className="mt-4">
                  {tab.sidebar}
                </Tab>
              ))}
            </Tabs>
          </LessonPlaygroundSidebar>
        </Col>
      </Row>
    </Container>
  );
};
