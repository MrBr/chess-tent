import React from 'react';
import { ActivityRendererModuleProps, Steps } from '@types';
import { components, ui } from '@application';
import { getLessonChapterIndex } from '@chess-tent/models';
import { updateActivityActiveChapter } from '../service';

const { LessonPlaygroundCard } = components;
const { Row, Col, Button, Icon } = ui;

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

  render() {
    const { nextStep, prevStep } = this.props;
    return (
      <LessonPlaygroundCard stretch>
        <Row>
          <Col>
            <Button variant="ghost" stretch size="small" onClick={prevStep}>
              <Icon type="left" />
            </Button>
          </Col>
          <Col>
            <Button variant="ghost" stretch size="small" onClick={nextStep}>
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
              Chapter <Icon type="right" size="small" />
            </Button>
          </Col>
        </Row>
      </LessonPlaygroundCard>
    );
  }
}
