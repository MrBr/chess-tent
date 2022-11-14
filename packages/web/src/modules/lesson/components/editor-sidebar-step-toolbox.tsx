import React, { useCallback, ReactEventHandler } from 'react';
import { Components, Steps } from '@types';
import { components, hooks, services, ui } from '@application';
import {
  addStepToLeft,
  getParentStep,
  isChapter,
  isStep,
  replaceStep,
  StepRoot,
  addVariationStep,
} from '@chess-tent/models';
import { over } from 'lodash';

const { Button, Icon, Modal, Headline4, Tooltip, OverlayTrigger } = ui;
const { useCopyStep, usePrompt } = hooks;
const { StepToolbox } = components;
const { getStepPosition, getStepBoardOrientation } = services;

function pickFunction(...funcs: any[]) {
  return funcs.find(f => typeof f === 'function');
}

const EditorStepToolbox: Components['EditorStepToolbox'] = ({
  active,
  updateStep,
  removeStep,
  step,
  setActiveStep,
  comment,
  remove,
  add,
  exercise,
  actionsClassName,
  paste,
  stepRoot,
  updateChapter,
}) => {
  const [hasStepCopy, copy, getCopiedStep] = useCopyStep();

  const pasteAdd: ReactEventHandler = event => {
    // Same as pasteReplace
    event.stopPropagation();
    const copiedStep = getCopiedStep() as Steps;
    updateStep(addVariationStep(step as Steps, copiedStep as Steps));
    setActiveStep(copiedStep);
  };

  const pasteReplace: ReactEventHandler = event => {
    // The modal is placed inside the step container hence clicking on the modal triggers events on the step that are unwanted
    event.stopPropagation();
    const copiedStep = getCopiedStep() as Steps;
    const parent = getParentStep(stepRoot, step) as StepRoot;
    const updatedParent = replaceStep(parent, step, copiedStep);
    if (isChapter(updatedParent)) {
      updateChapter(updatedParent);
    } else if (isStep(updatedParent)) {
      updateStep(updatedParent);
    }
    setActiveStep(copiedStep);
  };

  const [pasteModal, promptPasteModal] = usePrompt(close => (
    <Modal close={close} show>
      <Modal.Body>
        <Headline4>
          Replace current step with copied step or add as child?
        </Headline4>
        <Button
          size="extra-small"
          className="me-3"
          onClick={over(pasteReplace, close)}
        >
          Replace
        </Button>
        <Button size="extra-small" onClick={over(pasteAdd, close)}>
          Add
        </Button>
      </Modal.Body>
    </Modal>
  ));

  const addDescriptionStep = useCallback(() => {
    const position = getStepPosition(step as Steps);
    const orientation = getStepBoardOrientation(step as Steps);
    const descriptionStep = services.createStep('description', {
      position,
      orientation,
    });
    updateStep(addStepToLeft(step, descriptionStep, 0));
    setActiveStep(descriptionStep);
  }, [step, updateStep, setActiveStep]);

  const addNewVariationStep = useCallback(() => {
    const position = getStepPosition(step as Steps);
    const orientation = getStepBoardOrientation(step as Steps);
    const variationStep = services.createStep('variation', {
      position,
      editing: true,
      orientation,
    });
    updateStep(addVariationStep(step as Steps, variationStep));
    setActiveStep(variationStep);
  }, [step, updateStep, setActiveStep]);

  const pasteStep = useCallback(() => {
    const copiedStep = getCopiedStep();
    if (!copiedStep) {
      return;
    }
    promptPasteModal();
  }, [getCopiedStep, promptPasteModal]);

  const addExerciseStep = useCallback(() => {
    const position = getStepPosition(step as Steps);
    const orientation = getStepBoardOrientation(step as Steps);
    const exerciseStep = services.createStep('exercise', {
      position,
      orientation,
    });
    updateStep(addVariationStep(step as Steps, exerciseStep));
    setActiveStep(exerciseStep);
  }, [setActiveStep, step, updateStep]);

  const removeStepCB = useCallback(() => {
    removeStep(step);
  }, [removeStep, step]);

  return (
    <StepToolbox
      active={active}
      actionsClassName={actionsClassName}
      containerSelector=".editor"
    >
      {pasteModal}

      {exercise && (
        <OverlayTrigger
          placement="left"
          overlay={<Tooltip id="exercise-tooltip">Add exercise step</Tooltip>}
        >
          <Icon
            size="extra-small"
            type="exercise"
            onClick={pickFunction(exercise, addExerciseStep)}
          />
        </OverlayTrigger>
      )}
      {add && (
        <OverlayTrigger
          placement="left"
          overlay={<Tooltip id="add-tooltip">Add new step</Tooltip>}
        >
          <Icon
            size="extra-small"
            type="add"
            onClick={pickFunction(add, addNewVariationStep)}
          />
        </OverlayTrigger>
      )}
      {comment && (
        <OverlayTrigger
          placement="left"
          overlay={<Tooltip id="comment-tooltip">Add step comment</Tooltip>}
        >
          <Icon
            size="extra-small"
            type="comment"
            onClick={pickFunction(comment, addDescriptionStep)}
          />
        </OverlayTrigger>
      )}
      {remove && (
        <Icon
          size="extra-small"
          type="remove"
          onClick={pickFunction(remove, removeStepCB)}
        />
      )}
      {paste && (
        <OverlayTrigger
          placement="left"
          overlay={
            <Tooltip id="copy-tooltip">Copy step and child steps</Tooltip>
          }
        >
          <Icon size="extra-small" type="copy" onClick={() => copy(step)} />
        </OverlayTrigger>
      )}
      {paste && (
        <OverlayTrigger
          placement="left"
          overlay={<Tooltip id="copy-tooltip">Paste copied steps</Tooltip>}
        >
          <Icon
            size="extra-small"
            type="move"
            onClick={hasStepCopy ? pickFunction(paste, pasteStep) : undefined}
          />
        </OverlayTrigger>
      )}
    </StepToolbox>
  );
};

EditorStepToolbox.defaultProps = {
  add: true,
  remove: true,
  exercise: true,
  comment: true,
  paste: true,
};

export default EditorStepToolbox;
