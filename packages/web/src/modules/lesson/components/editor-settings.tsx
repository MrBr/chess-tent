import React, { ComponentType, useEffect } from 'react';
import { components, hooks, requests, state, ui } from '@application';
import {
  Difficulty,
  Lesson,
  Tag,
  updateLesson,
  updateSubjectState,
} from '@chess-tent/models';
import DifficultyDropdown from './difficulty-dropdown';
import EditorSettingsCollaborators from './editor-settings-collaborators';

const {
  Tabs,
  Tab,
  Offcanvas,
  Container,
  Row,
  Col,
  Headline6,
  Label,
  Input,
  Button,
  Modal,
  Confirm,
} = ui;
const { TagsSelect } = components;
const { useDispatchService, usePrompt, useApi, useDispatch, useHistory } =
  hooks;
const {
  actions: { deleteEntity },
} = state;

const EditorSettings: ComponentType<{
  lesson: Lesson;
  close: () => void;
}> = ({ lesson, close }) => {
  const dispatchService = useDispatchService();
  const dispatch = useDispatch();
  const history = useHistory();
  const { fetch: lessonDelete, response: lessonDeleted } = useApi(
    requests.lessonDelete,
  );

  const [deleteConfirm, promptDeleteLesson] = usePrompt(close => (
    <Modal close={close}>
      <Confirm
        title="Delete template"
        message={`Are you sure you want to delete ${
          lesson.state.title || 'lesson'
        }?`}
        okText="Cancel"
        cancelText="Delete"
        onOk={close}
        onCancel={() => lessonDelete(lesson.id)}
      />
    </Modal>
  ));

  useEffect(() => {
    if (!lessonDeleted || lessonDeleted.error || !lesson) {
      return;
    }
    dispatch(deleteEntity(lesson));
    history.replace('/');
  }, [lesson, lessonDeleted, dispatch, history]);

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
    <>
      {deleteConfirm}
      <Offcanvas show onHide={close}>
        <Offcanvas.Header>
          <Headline6 className="m-0">Lesson settings</Headline6>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Tabs defaultActiveKey="Details">
            <Tab eventKey="Details" title="Details">
              <Container>
                <Headline6 className="mt-3">Details</Headline6>
                <Row className="mt-2">
                  <Col>
                    <Label>Title</Label>
                    <Input
                      value={lesson.state.title}
                      onChange={createUpdateLessonDetails('title')}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <Label>Description</Label>
                    <Input
                      type="textarea"
                      value={lesson.state.description}
                      onChange={createUpdateLessonDetails('description')}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <Label>Difficulty</Label>
                    <DifficultyDropdown
                      size="small"
                      id="editor-difficulty"
                      includeNullOption={false}
                      initial={lesson.difficulty}
                      onChange={updateLessonDifficulty}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <Label>Tags</Label>
                    <TagsSelect selected={lesson.tags} onChange={updateTags} />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col />
                  <Col className="col-auto">
                    <Button
                      size="small"
                      variant="tertiary"
                      onClick={promptDeleteLesson}
                    >
                      Delete
                    </Button>
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
    </>
  );
};

export default EditorSettings;
