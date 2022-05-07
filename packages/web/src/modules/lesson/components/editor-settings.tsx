import React, { ComponentType, UIEvent } from 'react';
import { components, hooks, ui } from '@application';
import {
  Difficulty,
  Lesson,
  Tag,
  updateLesson,
  updateSubjectState,
} from '@chess-tent/models';
import DifficultyDropdown from './difficulty-dropdown';
import EditorSidebarAdjustableText from './editor-sidebar-adjustable-text';
import EditorSettingsCollaborators from './editor-settings-collaborators';

const { Tabs, Tab, Offcanvas, Container, Row, Col, Headline5 } = ui;
const { TagsSelect } = components;
const { useDispatchService } = hooks;

const formatTitleElementText = (e: UIEvent<HTMLDivElement>) => {
  const elem = e.target as HTMLHeadingElement;
  // @ts-ignore
  if (e.nativeEvent.inputType === 'insertParagraph') {
    elem.innerText = elem.innerText.trim();
    elem.blur();
    return;
  }
};

const EditorSettings: ComponentType<{
  lesson: Lesson;
  close: () => void;
}> = ({ lesson, close }) => {
  const dispatchService = useDispatchService();

  const createUpdateLessonDetails =
    (field: 'title' | 'description') => (text: string) => {
      dispatchService(updateSubjectState)(lesson, {
        [field]: text,
      });
    };

  const updateLessonDifficulty = (difficulty?: Difficulty) => {
    if (difficulty === undefined) {
      return;
    }

    dispatchService(updateLesson)(lesson, { difficulty });
  };

  const updateTags = (tags: Tag[]) => {
    dispatchService(updateLesson)(lesson, { tags });
  };

  return (
    <Offcanvas show onHide={close}>
      <Offcanvas.Header>
        <Headline5 className="m-0">Lesson settings</Headline5>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Tabs defaultActiveKey="Details">
          <Tab eventKey="Details" title="Details">
            <Container>
              <Row>
                <Col>
                  <Headline5
                    contentEditable
                    html={lesson.state.title}
                    onInput={createUpdateLessonDetails('title')}
                    className="mt-4"
                    formatInput={formatTitleElementText}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <EditorSidebarAdjustableText
                    html={lesson.state.description}
                    onInput={createUpdateLessonDetails('description')}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <DifficultyDropdown
                    size="small"
                    id="editor-difficulty"
                    includeNullOption={false}
                    initial={lesson.difficulty}
                    onChange={updateLessonDifficulty}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <TagsSelect selected={lesson.tags} onChange={updateTags} />
                </Col>
              </Row>
            </Container>
          </Tab>
          <Tab eventKey="Collaborator" title="Collaborators">
            <Container>
              <Row>
                <Col>
                  <EditorSettingsCollaborators lesson={lesson} />
                </Col>
              </Row>
            </Container>
          </Tab>
        </Tabs>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default EditorSettings;
