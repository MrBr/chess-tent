import React, { ComponentType, useState } from 'react';
import { hooks, ui } from '@application';
import { Lesson } from '@chess-tent/models';
import EditorAction from './editor-action';
import TrainingModal from './training-assign';
import EditorSettings, { EditorSettingsProps } from './editor-settings';

const { Dropdown } = ui;
const { usePrompt } = hooks;

const EditorPageSettings: ComponentType<{ lesson: Lesson }> = ({ lesson }) => {
  // New lesson can't be configured until the lesson has actually been created.
  // The new lesson it basically an empty skeleton.
  const [modal, promptModal] = usePrompt(close => (
    <TrainingModal close={close} lesson={lesson} />
  ));
  const [settingsTab, setSettingsTab] =
    useState<EditorSettingsProps['defaultTab']>();

  return (
    <>
      {modal}
      {settingsTab && (
        <EditorSettings
          close={() => setSettingsTab(undefined)}
          defaultTab={settingsTab}
          lesson={lesson}
        />
      )}
      <Dropdown>
        <Dropdown.Toggle>Settings</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>
            <EditorAction
              id="settings"
              tooltip="Edit lesson details"
              onClick={() => setSettingsTab('Details')}
            >
              Settings
            </EditorAction>
          </Dropdown.Item>
          <Dropdown.Item>
            <EditorAction
              id="collaborators"
              tooltip="Edit lesson collaborators"
              onClick={() => setSettingsTab('Collaborators')}
            >
              Collaborators
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
