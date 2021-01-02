import React, { useCallback } from 'react';
import { Components, Steps } from '@types';
import { components, services, ui, utils } from '@application';
import styled from '@emotion/styled';
import { addStepToLeft } from '@chess-tent/models';
import { getStepPosition } from '../../step/service';

const { Container, Button, Icon } = ui;
const { LessonToolboxText } = components;

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
}) => {
  const addDescriptionStep = useCallback(() => {
    const position = getStepPosition(step as Steps);
    const descriptionStep = services.createStep('description', {
      position,
    });
    updateStep(addStepToLeft(step, descriptionStep));
    setActiveStep(descriptionStep);
  }, [step, updateStep, setActiveStep]);
  const addVariationStep = useCallback(() => {
    const position = getStepPosition(step as Steps);
    const variationStep = services.createStep('variation', {
      position,
      editing: true,
    });
    updateStep(addStepToLeft(step, variationStep));
    setActiveStep(variationStep);
  }, [step, updateStep, setActiveStep]);
  const addExerciseStep = useCallback(() => {
    const position = getStepPosition(step as Steps);
    const exerciseStep = services.createStep('exercise', {
      position,
    });
    updateStep(addStepToLeft(step, exerciseStep));
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
};

export default StepToolbox;
