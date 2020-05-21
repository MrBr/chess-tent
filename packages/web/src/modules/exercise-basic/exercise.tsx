import React, { useCallback, useEffect, useMemo } from 'react';
import uuid from 'uuid/v1';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
  Exercise,
  Section,
  Step,
  createExercise,
  createSection,
  getActiveStepSection,
  getExercisePreviousStep,
  getSectionLastStep,
} from '@chess-tent/models';
import { addSectionChildAction } from '../section';
import { updateEntitiesAction } from '../state';
import { exerciseSelector } from '../exercise/state/selectors';
import { setExerciseActiveStepAction } from '../exercise/state/actions';
import { Stepper } from './step';
import { useDispatchBatched, AppState } from '../state';
import { START_FEN } from '../chessboard';
import {
  createStepModuleStep,
  getStepModuleStepEndSetup,
  StepComponentRenderer,
} from '../step';

const ExerciseComponent = () => {
  const dispatch = useDispatchBatched();

  useEffect(() => {
    const defaultStep: Step = createStepModuleStep(
      'description',
      uuid(),
      START_FEN,
    );
    const defaultSection = createSection(uuid(), [defaultStep]);
    const defaultExercise: Exercise = createExercise(
      '1',
      defaultSection,
      defaultStep,
    );
    dispatch(updateEntitiesAction(defaultExercise));
  }, [dispatch]);
  const exercise = useSelector<AppState, Exercise>(exerciseSelector('1'));
  const { section, activeStep } = exercise || {};

  const prevStep = exercise && getExercisePreviousStep(exercise, activeStep);

  const prevPosition = useMemo(
    () => (prevStep ? getStepModuleStepEndSetup(prevStep).position : START_FEN),
    [prevStep],
  );

  const addSection = useCallback(
    (children: Section['children'] = []) => {
      const activeSection = getActiveStepSection(exercise);
      const activeStepPosition = getStepModuleStepEndSetup(activeStep).position;
      const newSection: Section = {
        id: uuid(),
        children: children,
        schema: 'sections',
      };
      let newActiveStep: Step | undefined = getSectionLastStep(newSection);
      if (!newActiveStep) {
        newActiveStep = createStepModuleStep(
          'description',
          uuid(),
          activeStepPosition,
        );
        newSection.children.push(newActiveStep);
      }
      dispatch(
        updateEntitiesAction(newSection),
        addSectionChildAction(activeSection, newSection),
        setExerciseActiveStepAction(exercise, newActiveStep),
      );
    },
    [dispatch, exercise, activeStep],
  );

  const addStep = useCallback(() => {
    const activeSection = getActiveStepSection(exercise);
    const activeStepPosition = getStepModuleStepEndSetup(activeStep).position;
    const newStep: Step = createStepModuleStep(
      'description',
      uuid(),
      activeStepPosition,
    );
    dispatch(
      updateEntitiesAction(newStep),
      addSectionChildAction(activeSection, newStep),
      setExerciseActiveStepAction(exercise, newStep),
    );
  }, [dispatch, exercise, activeStep]);

  const updateActiveStep = useCallback(
    (step: Step) => {
      dispatch(setExerciseActiveStepAction(exercise, step));
    },
    [dispatch, exercise],
  );

  return (
    <>
      <Container style={{ height: '100%' }}>
        <Row noGutters style={{ height: '100%' }}>
          <Col sm={3} style={{ background: '#CCC', height: '100%' }}>
            <h1>Exercise</h1>
            <Stepper
              section={section}
              addSection={addSection}
              addStep={addStep}
              prevPosition={prevPosition}
              current={activeStep}
              onStepClick={updateActiveStep}
            />
          </Col>
          <Col>
            {activeStep && (
              <StepComponentRenderer
                step={activeStep}
                component="Editor"
                addSection={addSection}
                addStep={addStep}
                prevPosition={prevPosition}
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ExerciseComponent;
