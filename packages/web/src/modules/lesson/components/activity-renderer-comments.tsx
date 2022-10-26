import React from 'react';
import { ActivityComment, ActivityRendererModuleProps } from '@types';
import { ui } from '@application';
import { updateActivityStepState } from '@chess-tent/models';
import { isDesktop } from 'react-device-detect';
import { css } from '@chess-tent/styled-props';

import Comments from './activity-comments';

const { Icon, Text } = ui;

const { className: collapsableClassName } = css`
  position: absolute;
  left: 0;
  bottom: 100%;
  display: none;
  width: 100%;
  background: var(--light-color);
  padding: 12px;
  max-height: 40vh;
  overflow: auto;
  border-bottom: 1px solid var(--grey-400-color);
  border-top: 1px solid var(--grey-400-color);
  flex-direction: column-reverse;
  &.show {
    display: flex;
    //display: block;
  }
`;

export class ActivityRendererCommentsCard extends React.Component<
  ActivityRendererModuleProps<any>,
  { showComments: boolean }
> {
  state = {
    showComments: false,
  };

  toggleComments = () => {
    this.setState({ showComments: !this.state.showComments });
  };
  addStepComment = (comment: ActivityComment) => {
    const { activityStepState, activity, updateActivity, boardState } =
      this.props;
    updateActivity(updateActivityStepState)(activity, boardState, {
      comments: [...(activityStepState.comments || []), comment],
    });
  };

  render() {
    const { activityStepState } = this.props;
    const { showComments } = this.state;

    if (!isDesktop) {
      return null;
    }

    return (
      <div className="position-relative py-3 px-2">
        <div
          className={`${collapsableClassName} ${showComments ? 'show' : ''}`}
        >
          <Comments
            addComment={this.addStepComment}
            comments={activityStepState.comments}
          />
        </div>
        <Text
          weight={400}
          fontSize="extra-small"
          className="mb-0"
          onClick={this.toggleComments}
        >
          <Icon type="conversation" size="extra-small" className="me-2" />
          {showComments ? 'Close' : 'Open'} conversation
        </Text>
      </div>
    );
  }
}
