import React, { useCallback, useEffect, useMemo } from 'react';
import uuid from 'uuid/v1';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
  Lesson,
  Section,
  Step,
  createLesson,
  createSection,
  getActiveStepSection,
  getLessonPreviousStep,
  getSectionLastStep,
  User,
} from '@chess-tent/models';
import { AppState } from '@types';
import { state, hooks, constants, components, stepModules } from '@application';

const { Stepper, StepRenderer } = components;
const { createStep, getStepEndSetup } = stepModules;
const {
  selectors: { lessonSelector },
  actions: { setLessonActiveStep, updateEntities, addSectionChild },
} = state;
const { useDispatchBatched } = hooks;
const { START_FEN } = constants;

const LessonComponent = () => {
  const dispatch = useDispatchBatched();

  useEffect(() => {
    const defaultStep: Step = createStep('description', uuid(), START_FEN);
    const defaultSection = createSection(uuid(), [defaultStep]);
    const defaultLesson: Lesson = createLesson(
      '1',
      defaultSection,
      defaultStep,
      { id: '1' } as User,
    );
    dispatch(updateEntities(defaultLesson));
  }, [dispatch]);
  const lesson = useSelector<AppState, Lesson>(lessonSelector('1'));
  const { section, activeStep } = lesson?.state || {};

  const prevStep = lesson && getLessonPreviousStep(lesson, activeStep);

  const prevPosition = useMemo(
    () => (prevStep ? getStepEndSetup(prevStep).position : START_FEN),
    [prevStep],
  );

  const addSection = useCallback(
    (children: Section['children'] = []) => {
      const activeSection = getActiveStepSection(lesson);
      const activeStepPosition = getStepEndSetup(activeStep).position;
      const newSection: Section = createSection(uuid(), children);
      let newActiveStep: Step | undefined = getSectionLastStep(newSection);
      if (!newActiveStep) {
        newActiveStep = createStep('description', uuid(), activeStepPosition);
        newSection.children.push(newActiveStep);
      }
      dispatch(
        updateEntities(newSection),
        addSectionChild(activeSection, newSection),
        setLessonActiveStep(lesson, newActiveStep),
      );
    },
    [dispatch, lesson, activeStep],
  );

  const addStep = useCallback(() => {
    const activeSection = getActiveStepSection(lesson);
    const activeStepPosition = getStepEndSetup(activeStep).position;
    const newStep: Step = createStep('description', uuid(), activeStepPosition);
    dispatch(
      updateEntities(newStep),
      addSectionChild(activeSection, newStep),
      setLessonActiveStep(lesson, newStep),
    );
  }, [dispatch, lesson, activeStep]);

  const updateActiveStep = useCallback(
    (step: Step) => {
      dispatch(setLessonActiveStep(lesson, step));
    },
    [dispatch, lesson],
  );

  return (
    <>
      <Container style={{ height: '100%' }}>
        <Row noGutters style={{ height: '100%' }}>
          <Col sm={3} style={{ background: '#CCC', height: '100%' }}>
            <h1>Lesson</h1>
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
              <StepRenderer
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

export default LessonComponent;
