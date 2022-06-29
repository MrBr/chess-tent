import React from 'react';
import { ActivityRendererModuleProps, Steps } from '@types';
import { components, ui } from '@application';
import { getLessonChapterIndex } from '@chess-tent/models';

import { updateActivityActiveChapter } from '../service';

const { LessonPlaygroundCard } = components;
const { Button, Icon, Row, Col } = ui;

export class ActivityRendererNavigationCard<
  T extends Steps | undefined,
> extends React.Component<ActivityRendererModuleProps<T>> {
  nextChapter = () => {
    const { chapter, activity, updateActivity, boardState } = this.props;

    if (!chapter) {
      return;
    }

    const nextChapterIndex =
      getLessonChapterIndex(activity.subject, chapter.id) + 1;
    const nextChapter = activity.subject.state.chapters[nextChapterIndex];

    if (!nextChapter) {
      return;
    }

    updateActivity(updateActivityActiveChapter)(
      activity,
      boardState,
      nextChapter,
    );
  };

  nextStep = () => {
    const { nextStep } = this.props;
    nextStep();
  };

  prevStep = () => {
    const { prevStep } = this.props;
    prevStep();
  };

  render() {
    return (
      <LessonPlaygroundCard stretch bottom>
        <Row>
          <Col>
            <Button
              variant="ghost"
              stretch
              size="small"
              onClick={this.prevStep}
            >
              <Icon type="left" />
            </Button>
          </Col>
          <Col>
            <Button
              variant="ghost"
              stretch
              size="small"
              onClick={this.nextStep}
            >
              <Icon type="right" />
            </Button>
          </Col>
          <Col>
            <Button
              variant="ghost"
              stretch
              size="small"
              onClick={this.nextChapter}
            >
              Chapter <Icon type="right" textual />
            </Button>
          </Col>
        </Row>
      </LessonPlaygroundCard>
    );
  }
}
