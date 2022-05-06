import React, { ComponentType } from 'react';
import { hooks } from '@application';
import { Lesson } from '@chess-tent/models';
import EditorAction from './editor-action';
import { PreviewModal } from './activity-preview';
import { useLessonParams } from '../hooks/lesson';

const { usePrompt } = hooks;
const EditorPageSettings: ComponentType<{ lesson: Lesson }> = ({ lesson }) => {
  // New lesson can't be configured until the lesson has actually been created.
  // The new lesson it basically an empty skeleton.
  const { activeChapter, activeStep } = useLessonParams(lesson);
  const [previewModal, promptModal] = usePrompt(close => (
    <PreviewModal
      close={close}
      lesson={lesson}
      step={activeStep}
      chapter={activeChapter}
    />
  ));

  return (
    <>
      {previewModal}
      <EditorAction
        id="preview"
        tooltip="View lesson as student"
        onClick={promptModal}
      >
        Preview
      </EditorAction>
    </>
  );
};

export default EditorPageSettings;
