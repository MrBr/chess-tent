import React from 'react';
import { ActivityComment, ActivityRendererModuleProps } from '@types';
import { components } from '@application';
import { updateActivityStepState } from '@chess-tent/models';
import Comments from './activity-comments';

const { LessonPlaygroundCard } = components;

export class ActivityRendererCommentsModuleCard extends React.Component<
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
        <Comments
          addComment={this.addStepComment}
          comments={activityStepState.comments}
        />
      </LessonPlaygroundCard>
    );
  }
}
