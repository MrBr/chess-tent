import React, {
  ReactEventHandler,
  useCallback,
  KeyboardEventHandler,
} from 'react';
import { Components } from '@types';
import { components, ui, utils } from '@application';
import debounce from 'lodash/debounce';

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
      onDeleteComment,
    } = props;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedUpdate = useCallback(
      debounce((newValue: string) => {
        textChangeHandler && textChangeHandler(newValue);
      }, 350),
      [textChangeHandler],
    );

    const deleteListener: KeyboardEventHandler<HTMLTextAreaElement> =
      useCallback(
        e => {
          if (!text && e.code === 'Backspace' && onDeleteComment) {
            onDeleteComment();
          }
        },
        [text, onDeleteComment],
      );

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
                  onChange={debouncedUpdate}
                  text={text}
                  placeholder="Add comment"
                  onKeyDown={deleteListener}
                  active={active}
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
