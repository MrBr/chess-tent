import React, { PropsWithChildren, ReactElement } from 'react';
import { Chapter, updateSubjectState } from '@chess-tent/models';
import { ActivityRendererModuleProps, Steps } from '@types';
import { components, hooks, constants } from '@application';
import { css } from '@chess-tent/styled-props';

const { useActiveUserRecord, useLocation } = hooks;

const { ZoomProvider, ZoomHostControl, ZoomGuestControl, ZoomActivityView } =
  components;

const { className } = css`
  display: flex;
  flex-direction: column;
  padding: 10px;
  max-width: 100%;
`;

export const ActivityRendererZoom = <
  T extends Steps | undefined,
  K extends Chapter | undefined = Chapter | undefined,
>(
  props: PropsWithChildren<ActivityRendererModuleProps<T, K>>,
): ReactElement<any, any> | null => {
  const { value: user } = useActiveUserRecord();
  const location = useLocation();
  const { activity, updateActivity } = props;

  const setZoomMeetingNumberState = (meetingNumber: string) => {
    updateActivity(updateSubjectState)(activity, {
      zoomMeetingNumber: meetingNumber,
    });
  };

  return (
    <div className={className}>
      <ZoomProvider
        redirectUri={constants.APP_URL + location.pathname}
        user={user}
        meetingNumber={
          !user?.coach ? activity.state?.zoomMeetingNumber : undefined
        }
      >
        {user?.coach ? <ZoomHostControl /> : <ZoomGuestControl />}
        <ZoomActivityView
          setZoomMeetingNumberState={setZoomMeetingNumberState}
        />
      </ZoomProvider>
    </div>
  );
};
