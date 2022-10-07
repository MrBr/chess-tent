import React, {
  useCallback,
  ReactEventHandler,
  useEffect,
  useState,
} from 'react';
import { Components, Steps } from '@types';
import { components, hooks, services, ui, utils } from '@application';
import styled, { css } from '@chess-tent/styled-props';
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

const {
  Container,
  Button,
  Icon,
  Modal,
  ModalBody,
  Headline4,
  Tooltip,
  OverlayTrigger,
  Overlay,
} = ui;
const { LessonToolboxText } = components;
const { useCopyStep, usePrompt, useShowOnActive } = hooks;
const { stopPropagation } = utils;
const { getStepPosition, getStepBoardOrientation } = services;

function pickFunction(...funcs: any[]) {
  return funcs.find(f => typeof f === 'function');
}

const { className: toolboxContainerClassName } = css`
  position: absolute;
  left: 0;
`;

const { className: toolboxClassName } = css`
  z-index: 100;
`;

const ToolboxActions = styled.div.css`
  > ${Icon as any}:not(:last-child) {
    margin-bottom: 15px;
    cursor: pointer;
  }

  padding: 15px 8px;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
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
  const [visible, setVisible] = useState<boolean>(false);
  const [hasStepCopy, copy, getCopiedStep] = useCopyStep();

  const toolboxRef = useShowOnActive<HTMLDivElement>(active);

  useEffect(() => {
    if (!active || !toolboxRef.current) {
      return;
    }
    const observer = new IntersectionObserver(
      entries => setVisible(!!entries[0]?.isIntersecting),
      {
        root: null, // default is the viewport
        threshold: 0.5, // percentage of taregt's visible area. Triggers "onIntersection"
      },
    );

    observer.observe(toolboxRef.current);
    return () => {
      observer.disconnect();
      // TODO - is observer deleted for sure?
    };
  }, [active, toolboxRef, setVisible]);

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

  const handleClick: ReactEventHandler = event => {
    stopPropagation(event);
    !active && setActiveStep(step);
  };

  // Used to prevent scrollbar flickering
  // TODO - make it configurable
  /** @see Editor */
  const getToolboxContainer = () =>
    (toolboxRef.current?.closest('.editor') as HTMLElement) || null;

  return (
    <>
      {active && visible && (
        <Overlay
          target={toolboxRef.current}
          placement="left"
          show
          container={getToolboxContainer}
        >
          {/* Excluding props to remove react warning... */}
          {({ arrowProps, popper, show, className, ...props }) => (
            // Stopping propagation to execute only clicked action
            // and not triggers bellow the toolbox
            <div
              {...props}
              onClick={stopPropagation}
              className={`${className} ${toolboxClassName}`}
            >
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
                      onClick={pickFunction(add, addNewVariationStep)}
                    />
                  </OverlayTrigger>
                )}
                {comment && (
                  <OverlayTrigger
                    placement="left"
                    overlay={
                      <Tooltip id="comment-tooltip">Add step comment</Tooltip>
                    }
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
                      <Tooltip id="copy-tooltip">
                        Copy step and child steps
                      </Tooltip>
                    }
                  >
                    <Icon
                      size="extra-small"
                      type="copy"
                      onClick={() => copy(step)}
                    />
                  </OverlayTrigger>
                )}
                {paste && (
                  <OverlayTrigger
                    placement="left"
                    overlay={
                      <Tooltip id="copy-tooltip">Paste copied steps</Tooltip>
                    }
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
            </div>
          )}
        </Overlay>
      )}
      {pasteModal}
      <div ref={toolboxRef} className={toolboxContainerClassName} />
      <Container
        className={`d-flex align-items-center h-100 pr-0 ${className}`}
        onClick={handleClick}
      >
        {(text || active) && showInput && (
          <LessonToolboxText
            onChange={textChangeHandler}
            text={text}
            placeholder="Add comment"
          />
        )}
      </Container>
    </>
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
