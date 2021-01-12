import React, { useCallback } from 'react';
import { Components, Steps } from '@types';
import { components, hooks, services, ui, utils } from '@application';
import styled from '@emotion/styled';
import {
  addStepToLeft,
  getParentStep,
  isChapter,
  isStep,
  replaceStep,
} from '@chess-tent/models';
import { over } from 'lodash';

const { Container, Button, Icon, Modal, ModalBody, Headline4 } = ui;
const { LessonToolboxText } = components;
const { useCopyStep, usePromptModal } = hooks;
const {
  getStepPosition,
  addStepNextToTheComments,
  getStepBoardOrientation,
} = services;

function pickFunction(...funcs: any[]) {
  return funcs.find(f => typeof f === 'function');
}

const ToolboxActions = styled.div({
  '> button': {
    marginBottom: 8,
  },
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
});

const StepToolbox: Components['StepToolbox'] = ({
  textChangeHandler,
  active,
  text,
  showInput = true,
  updateStep,
  removeStep,
  step,
  setActiveStep,
  comment,
  remove,
  add,
  exercise,
  className,
  actionsClassName,
  paste,
  stepRoot,
  updateChapter,
}) => {
  const [hasStepCopy, copy, getCopiedStep] = useCopyStep();
  const promptModal = usePromptModal();
  const addDescriptionStep = useCallback(() => {
    const position = getStepPosition(step as Steps);
    const orientation = getStepBoardOrientation(step as Steps);
    const descriptionStep = services.createStep('description', {
      position,
      orientation,
    });
    updateStep(addStepToLeft(step, descriptionStep));
    setActiveStep(descriptionStep);
  }, [step, updateStep, setActiveStep]);
  const addVariationStep = useCallback(() => {
    const position = getStepPosition(step as Steps);
    const orientation = getStepBoardOrientation(step as Steps);
    const variationStep = services.createStep('variation', {
      position,
      editing: true,
      orientation,
    });
    updateStep(addStepNextToTheComments(step as Steps, variationStep));
    setActiveStep(variationStep);
  }, [step, updateStep, setActiveStep]);
  const pasteStep = useCallback(() => {
    const copiedStep = getCopiedStep();
    if (!copiedStep) {
      return;
    }
    const replace = () => {
      const parent = getParentStep(stepRoot, step);
      const updatedParent = replaceStep(parent, step, copiedStep);
      if (isChapter(updatedParent)) {
        updateChapter(updatedParent);
      } else if (isStep(updatedParent)) {
        updateStep(updatedParent);
      }
      setActiveStep(copiedStep);
    };
    const add = () => {
      updateStep(addStepNextToTheComments(step as Steps, copiedStep as Steps));
      setActiveStep(copiedStep);
    };

    promptModal(close => (
      <Modal close={close} show>
        <ModalBody>
          <Headline4>
            Replace current step with copied step or add as child?
          </Headline4>
          <Button
            size="extra-small"
            className="mr-3"
            onClick={over(replace, close)}
          >
            Replace
          </Button>
          <Button size="extra-small" onClick={over(add, close)}>
            Add
          </Button>
        </ModalBody>
      </Modal>
    ));
  }, [
    getCopiedStep,
    promptModal,
    stepRoot,
    step,
    setActiveStep,
    updateChapter,
    updateStep,
  ]);
  const addExerciseStep = useCallback(() => {
    const position = getStepPosition(step as Steps);
    const orientation = getStepBoardOrientation(step as Steps);
    const exerciseStep = services.createStep('exercise', {
      position,
      orientation,
    });
    updateStep(addStepNextToTheComments(step as Steps, exerciseStep));
    setActiveStep(exerciseStep);
  }, [setActiveStep, step, updateStep]);
  const removeStepCB = useCallback(() => {
    removeStep(step);
  }, [removeStep, step]);

  return (
    <Container
      className={`d-flex align-items-center h-100 pr-0 ${className}`}
      onClick={utils.stopPropagation}
    >
      {(text || active) && showInput && (
        <LessonToolboxText
          onChange={textChangeHandler}
          defaultText={text}
          placeholder="Add comment"
        />
      )}
      {active && (
        <ToolboxActions className={actionsClassName}>
          {exercise && (
            <Button
              variant="regular"
              size="extra-small"
              onClick={pickFunction(exercise, addExerciseStep)}
            >
              Q
            </Button>
          )}
          {add && (
            <Button
              size="extra-small"
              variant="regular"
              onClick={pickFunction(add, addVariationStep)}
            >
              +
            </Button>
          )}
          {comment && (
            <Button
              size="extra-small"
              variant="regular"
              onClick={pickFunction(comment, addDescriptionStep)}
            >
              <Icon type="comment" textual />
            </Button>
          )}
          {remove && (
            <Button
              size="extra-small"
              variant="regular"
              onClick={pickFunction(remove, removeStepCB)}
            >
              x
            </Button>
          )}
          {paste && (
            <Button
              size="extra-small"
              variant="regular"
              onClick={() => copy(step)}
            >
              C
            </Button>
          )}
          {paste && (
            <Button
              size="extra-small"
              variant="regular"
              onClick={pickFunction(paste, pasteStep)}
              disabled={!hasStepCopy}
            >
              P
            </Button>
          )}
        </ToolboxActions>
      )}
    </Container>
  );
};

StepToolbox.defaultProps = {
  add: true,
  remove: true,
  exercise: true,
  comment: true,
  paste: true,
};

export default StepToolbox;
