import React, { ComponentType } from 'react';
import { hooks, ui, utils } from '@application';
import { Lesson } from '@chess-tent/models';
import EditorAction from './editor-action';
import TrainingModal from './training-assign';
import EditorSettings from './editor-settings';

const { Dropdown } = ui;
const { downloadAs } = utils;
const { usePromptModal, usePromptOffcanvas } = hooks;
const EditorPageSettings: ComponentType<{ lesson: Lesson }> = ({ lesson }) => {
  // New lesson can't be configured until the lesson has actually been created.
  // The new lesson it basically an empty skeleton.
  const promptModal = usePromptModal();
  const promptOffcanvas = usePromptOffcanvas();

  return (
    <Dropdown>
      <Dropdown.Toggle>Settings</Dropdown.Toggle>
      <Dropdown.Menu>
        <EditorAction
          id="settings"
          tooltip="Edit lesson settings"
          onClick={() =>
            promptOffcanvas(close => (
              <EditorSettings close={close} lesson={lesson} />
            ))
          }
        >
          Settings
        </EditorAction>
        <EditorAction
          id="assign"
          tooltip="Assign lesson to student"
          onClick={() => promptModal(close => <TrainingModal close={close} />)}
        >
          Assign
        </EditorAction>
        <EditorAction
          id="download"
          tooltip="Make lesson safe copy"
          onClick={() =>
            downloadAs(
              new Blob([JSON.stringify(lesson)], {
                type: 'text/plain;charset=utf-8',
              }),
              lesson.state.title + '.json',
            )
          }
        >
          Download
        </EditorAction>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default EditorPageSettings;
