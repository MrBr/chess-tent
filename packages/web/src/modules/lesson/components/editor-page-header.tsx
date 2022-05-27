import React, { ComponentType } from 'react';
import { components, ui } from '@application';
import { Lesson } from '@chess-tent/models';
import { ApiStatus } from '@types';
import EditorPageSettings from './editor-page-settings';
import EditorPagePublish from './editor-page-publish';
import EditorPagePreview from './editor-page-preview';

const { Header, ApiStatusLabel } = components;
const { Breadcrumbs, Col } = ui;

interface EditorPageHeaderProps {
  lesson?: Lesson;
  lessonStatus?: ApiStatus;
}

const EditorPageHeader: ComponentType<EditorPageHeaderProps> = ({
  lesson,
  lessonStatus,
}) => {
  return (
    <Header className="border-bottom">
      <Col>
        <Breadcrumbs className="mb-0">
          <Breadcrumbs.Item href="/">Dashboard</Breadcrumbs.Item>
          <Breadcrumbs.Item>
            {lesson?.state.title || 'New template'}
          </Breadcrumbs.Item>
        </Breadcrumbs>
      </Col>
      {lessonStatus && (
        <Col>
          <ApiStatusLabel status={lessonStatus} />
        </Col>
      )}
      {lesson && (
        <>
          <Col className="col-auto">
            <EditorPagePublish lesson={lesson} />
          </Col>
          <Col className="col-auto">
            <EditorPageSettings lesson={lesson} />
          </Col>
          <Col className="col-auto">
            <EditorPagePreview lesson={lesson} />
          </Col>
        </>
      )}
    </Header>
  );
};

export default EditorPageHeader;
