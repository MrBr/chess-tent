import React, { ComponentType, FormEvent, useCallback } from 'react';
import { debounce } from 'lodash';
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

const { Tabs, Tab, Offcanvas, Headline2, Container, Row, Col } = ui;
const { TagsSelect } = components;
const { useDispatchService } = hooks;

const EditorSettings: ComponentType<{
  lesson: Lesson;
  close: () => void;
}> = ({ lesson, close }) => {
  const dispatchService = useDispatchService();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateStateDebounced = useCallback(
    debounce(dispatchService(updateSubjectState), 500),
    [dispatchService],
  );

  const createUpdateLessonDetails =
    (field: 'title' | 'description') =>
    (event: FormEvent<HTMLHeadingElement>) => {
      const elem = event.target as HTMLHeadingElement;
      // @ts-ignore
      if (event.nativeEvent.inputType === 'insertParagraph') {
        elem.innerText = elem.innerText.trim();
        elem.blur();
        return;
      }
      updateStateDebounced(lesson, {
        [field]: elem.innerText,
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
      <Tabs defaultActiveKey="Details\">
        <Tab eventKey="Details" title="Details">
          <Container>
            <Row>
              <Col>
                <Headline2
                  contentEditable
                  html={lesson.state.title}
                  onInput={createUpdateLessonDetails('title')}
                  className="mt-4"
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
        <Tab eventKey="Collaborator" title="Collaborator">
          <Container>
            <Row>
              <Col>
                <EditorSettingsCollaborators lesson={lesson} />
              </Col>
            </Row>
          </Container>
        </Tab>
      </Tabs>
    </Offcanvas>
  );
};

export default EditorSettings;
