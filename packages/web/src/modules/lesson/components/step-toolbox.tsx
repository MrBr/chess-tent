import React, { useCallback, ReactEventHandler } from 'react';
import { Components, Steps } from '@types';
import { components, hooks, services, ui, utils } from '@application';
import styled from '@chess-tent/styled-props';
import {
  addStepToLeft,
  getParentStep,
  isChapter,
  isStep,
  replaceStep,
  StepRoot,
} from '@chess-tent/models';
import { over } from 'lodash';

const {
  Container,
  Button,
  Icon,
  Modal,
  ModalBody,
  Headline4,
  Tooltip,
  OverlayTrigger,
} = ui;
const { LessonToolboxText } = components;
const { useCopyStep, usePrompt } = hooks;
const { getStepPosition, addStepNextToTheComments, getStepBoardOrientation } =
  services;

function pickFunction(...funcs: any[]) {
  return funcs.find(f => typeof f === 'function');
}

const ToolboxActions = styled.div.css`
  > ${Icon as any}:not(:last-child) {
    margin-bottom: 20px;
    cursor: pointer;
  }

  padding: 15px 10px;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  transform: translateX(-50%);
  z-index: 10;
  background: var(--light-color);
  border: 1px solid var(--grey-400-color);
  border-radius: 10px;
`;

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

  const pasteAdd = () => {
    const copiedStep = getCopiedStep() as Steps;
    updateStep(addStepNextToTheComments(step as Steps, copiedStep as Steps));
    setActiveStep(copiedStep);
  };

  const pasteReplace = () => {
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
      <ModalBody>
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
      </ModalBody>
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
    promptPasteModal();
  }, [getCopiedStep, promptPasteModal]);

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

  const handleClick: ReactEventHandler = event => {
    utils.stopPropagation(event);
    !active && setActiveStep(step);
  };

  return (
    <Container
      className={`d-flex align-items-center h-100 pr-0 ${className}`}
      onClick={handleClick}
    >
      {pasteModal}
      {(text || active) && showInput && (
        <LessonToolboxText
          onChange={textChangeHandler}
          text={text}
          placeholder="Add comment"
        />
      )}
      {active && (
        <ToolboxActions className={actionsClassName}>
          {exercise && (
            <OverlayTrigger
              placement="left"
              overlay={
                <Tooltip id="exercise-tooltip">Add exercise step</Tooltip>
              }
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
                onClick={pickFunction(add, addVariationStep)}
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
                onClick={
                  hasStepCopy ? pickFunction(paste, pasteStep) : undefined
                }
              />
            </OverlayTrigger>
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
