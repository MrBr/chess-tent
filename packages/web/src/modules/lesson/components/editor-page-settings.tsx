import React, { ComponentType } from 'react';
import { hooks, ui } from '@application';
import { Lesson } from '@chess-tent/models';
import EditorAction from './editor-action';
import TrainingModal from './training-assign';
import EditorSettings from './editor-settings';

const { Dropdown } = ui;
const { usePrompt } = hooks;

const EditorPageSettings: ComponentType<{ lesson: Lesson }> = ({ lesson }) => {
  // New lesson can't be configured until the lesson has actually been created.
  // The new lesson it basically an empty skeleton.
  const [modal, promptModal] = usePrompt(close => (
    <TrainingModal close={close} lesson={lesson} />
  ));
  const [settingsOffcanvas, promptOffcanvas] = usePrompt(close => (
    <EditorSettings close={close} lesson={lesson} />
  ));

  return (
    <>
      {modal}
      {settingsOffcanvas}
      <Dropdown>
        <Dropdown.Toggle>Settings</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>
            <EditorAction
              id="settings"
              tooltip="Edit lesson settings"
              onClick={promptOffcanvas}
            >
              Settings
            </EditorAction>
          </Dropdown.Item>
          <Dropdown.Item>
            <EditorAction
              id="assign"
              tooltip="Assign lesson to student"
              onClick={promptModal}
            >
              Assign
            </EditorAction>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default EditorPageSettings;
