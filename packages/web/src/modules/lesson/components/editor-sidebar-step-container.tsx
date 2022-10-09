import React, { ReactEventHandler } from 'react';
import { Components } from '@types';
import { components, ui, utils } from '@application';

const { Row, Col, Container } = ui;
const { stopPropagation } = utils;
const { LessonToolboxText } = components;

const EditorSidebarStepContainer: Components['EditorSidebarStepContainer'] =
  props => {
    const {
      children,
      showInput,
      active,
      setActiveStep,
      step,
      textChangeHandler,
      text,
    } = props;

    const handleClick: ReactEventHandler = event => {
      stopPropagation(event);
      !active && setActiveStep(step);
    };

    if (showInput) {
      return (
        <Row onClick={handleClick} className="g-0">
          <Col className="col-auto me-2">{children}</Col>
          <Col>
            <Container
              className="d-flex align-items-center h-100 pr-0"
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
          </Col>
        </Row>
      );
    }
    return <span onClick={handleClick}>{children}</span>;
  };

export default EditorSidebarStepContainer;
