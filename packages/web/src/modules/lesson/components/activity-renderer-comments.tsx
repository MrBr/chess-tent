import React from 'react';
import { ActivityComment, ActivityRendererModuleProps } from '@types';
import { components, ui } from '@application';
import { updateActivityStepState } from '@chess-tent/models';
import Comments from './activity-comments';

const { LessonPlaygroundCard, LessonPlaygroundStepTag } = components;
const { Row, Col, Icon, Text } = ui;

export class ActivityRendererCommentsCard extends React.Component<
  ActivityRendererModuleProps<any>
> {
  addStepComment = (comment: ActivityComment) => {
    const { activityStepState, activity, updateActivity, boardState } =
      this.props;
    updateActivity(updateActivityStepState)(activity, boardState, {
      comments: [...(activityStepState.comments || []), comment],
    });
  };

  render() {
    const { activityStepState } = this.props;

    return (
      <LessonPlaygroundCard>
        <Row className="align-items-center mb-3">
          <Col className="col-auto">
            <LessonPlaygroundStepTag>
              <Icon type="conversation" size="extra-small" />
            </LessonPlaygroundStepTag>
          </Col>
          <Col>
            <Text weight={500} fontSize="extra-small" className="mb-1">
              Discussion
            </Text>
          </Col>
        </Row>
        <Comments
          addComment={this.addStepComment}
          comments={activityStepState.comments}
        />
      </LessonPlaygroundCard>
    );
  }
}
