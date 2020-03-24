import React, {FunctionComponent, useEffect, useState} from 'react';
import Button from "react-bootstrap/Button";
import uuid from 'uuid/v1';
import arrayMove from 'array-move';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import styled from "@emotion/styled";

import {Steps, getStep, getStepComponent} from '../app';
import {ExerciseActionTypes, StepInstance, StepModule, StepModuleComponentKey} from "../app/types";
import {exerciseSelector} from "./redux";

const Sections = styled.ul({
  listStyle: 'none',
  margin: '20px 0',
  padding: 0,
});
const SortableSections = SortableContainer(Sections);
const SectionDragHandle = SortableHandle(() => <span>||</span>);
const Section = styled(({ children, onClick, className }) => (
  <li className={className} onClick={onClick}><SectionDragHandle/>{children}</li>
))(({ active }) => active && {
  backgroundColor: 'rgba(0, 0, 0, 0.5)'
});
const SortableSection = SortableElement(Section);

interface StepPickerProps {
  steps: StepModule[];
  show: boolean;
  close: () => void;
  onSelect: (Step: StepModule) => void;
}

interface Exercise {
  steps: StepInstance[];
  activeStepId: StepInstance['id'] | null;
}

const StepPicker: FunctionComponent<StepPickerProps> = ({ show, close, steps, onSelect }) => (
  <Modal size="lg" show={show} onHide={close}>
    <Modal.Header closeButton>
      <Modal.Title>Select a step</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Container>
        {
          _.chunk(steps, 3).map((rowItems, index) => (
            <Row key={`step-row-${index}`}>
              {rowItems.map((Step, stepIndex) => (
                <Col sm={4} key={`step-${stepIndex}-${Step.type}`} onClick={() => onSelect(Step)}>
                  <Step.Picker />
                </Col>
              ))}
            </Row>
          ))
        }
      </Container>
    </Modal.Body>
  </Modal>
);

interface StepProps {
  step: StepInstance;
  component: StepModuleComponentKey;
}

const Step: FunctionComponent<StepProps> = ({ component, step }) => {
  const dispatch = useDispatch();
  const Step = getStep(step.type);
  if (!Step) {
    return null;
  }
  const { id, state } = step;
  const Component = getStepComponent(Step, component);
  return <Component setState={(state: any) => dispatch({
    payload: state,
    meta: { id },
    type: ExerciseActionTypes.SET_STEP_STATE,
  })} state={state}/>;
};

const Exercise = () => {
  useEffect(() => {
    const defaultExercise = {
      "steps": [{
        "id": 1,
        "type": "attack",
        "state": { "position": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR" }
      }], "activeStepId": 1
    };
    dispatch({
      type: ExerciseActionTypes.SET_EXERCISE_STATE,
      payload: defaultExercise
    });
  }, []);
  const exercise = useSelector<any, Exercise>(exerciseSelector);
  const dispatch = useDispatch();
  const { steps, activeStepId } = exercise;
  const activeStep = steps.find(step => step.id === activeStepId);
  const [isSectionPickerVisible, setShowSectionPicker] = useState(false);
  const nextStep = () => {
    const activeStepIndex = steps.findIndex(step => step.id === activeStepId);
    const nextStep = steps[activeStepIndex + 1];
    if (nextStep) {
      dispatch({
        type: ExerciseActionTypes.SET_EXERCISE_STATE,
        payload: {
          activeStepId: nextStep.id
        }
      })
    }
  };
  const prevStep = () => {
    const activeStepIndex = steps.findIndex(step => step.id === activeStepId);
    const prevStep = steps[activeStepIndex - 1]
    if (prevStep) {
      dispatch({
        type: ExerciseActionTypes.SET_EXERCISE_STATE,
        payload: {
          activeStepId: prevStep.id
        }
      })
    }
  };
  const closeSectionPicker = () => setShowSectionPicker(false);
  const showSectionPicker = () => setShowSectionPicker(true);
  const addSection = (step: StepModule) => {
    const newStep = {
      id: uuid(),
      type: step.type,
      state: {},
    };
    dispatch({
      type: ExerciseActionTypes.SET_EXERCISE_STATE,
      payload: {
        steps: [...steps, newStep],
        activeStepId: newStep.id,
      }
    });
    closeSectionPicker();
  };
  const onSortEnd = ({oldIndex, newIndex}: {oldIndex:  number, newIndex: number}) => {
    const newSteps = arrayMove(steps, oldIndex, newIndex);
    dispatch({
      type: ExerciseActionTypes.SET_EXERCISE_STATE,
      payload: {
        steps: newSteps
      }
    })
  };

  return (
    <>
      <Container style={{ height: '100%' }}>
        <Row noGutters style={{ height: '100%' }}>
          <Col sm={2} style={{ background: '#CCC', height: '100%' }}>
            <h1>Exercise</h1>
            <div>
              <Button size="sm" onClick={prevStep}>Prev</Button>
              <Button size="sm" onClick={nextStep}>Next</Button>
            </div>
            <SortableSections
              onSortEnd={onSortEnd}
              useDragHandle
            >
              {steps.map((step, index) => (
                <SortableSection
                  active={step.id === activeStepId}
                  key={step.id}
                  index={index}
                  onClick={() => dispatch({
                    type: ExerciseActionTypes.SET_EXERCISE_STATE,
                    payload: {
                      activeStepId: step.id,
                    }
                  })}>
                  <Step step={step} component="Picker"/>
                </SortableSection>
              ))}
            </SortableSections>
            <Button onClick={showSectionPicker}>Add step</Button>
          </Col>
          <Col>
            {activeStep && <Step step={activeStep} component="Exercise"/>}
          </Col>
        </Row>
      </Container>
      <StepPicker
        show={isSectionPickerVisible}
        close={closeSectionPicker}
        onSelect={addSection}
        steps={Steps}
      />
    </>
  );
};

export default Exercise;
