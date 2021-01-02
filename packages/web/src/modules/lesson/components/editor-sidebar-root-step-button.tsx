import React, { useCallback } from 'react';
import { constants, services, ui } from '@application';
import { addStep, Chapter } from '@chess-tent/models';

const { Dropdown } = ui;
const { START_FEN } = constants;

export interface RootStepButtonProps {
  updateChapter: (chapter: Chapter) => void;
  chapter: Chapter;
  className?: string;
}

export default ({ updateChapter, chapter, className }: RootStepButtonProps) => {
  const addNewRootStep = useCallback(
    (stepType: string | null) => {
      if (!stepType) {
        return;
      }
      const newStep = services.createStep(
        stepType as 'exercise' | 'variation',
        {
          position: START_FEN,
        },
      );
      updateChapter(addStep(chapter, newStep));
    },
    [updateChapter, chapter],
  );
  return (
    <Dropdown onSelect={addNewRootStep} className={`${className} w-25`}>
      <Dropdown.Toggle size="small">Add root</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item eventKey="variation">Variation</Dropdown.Item>
        <Dropdown.Item eventKey="exercise">Exercise</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};