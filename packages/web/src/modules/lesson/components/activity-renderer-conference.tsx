import React, { PropsWithChildren, ReactElement } from 'react';
import { Chapter, TYPE_ACTIVITY } from '@chess-tent/models';
import { ActivityRendererModuleProps, Steps } from '@types';
import { components } from '@application';
import { css } from '@chess-tent/styled-props';

const { ConferencingProvider } = components;

const { className } = css`
  display: flex;
  flex-direction: column;
  padding: 10px;
  max-width: 100%;
`;

export const ActivityRendererConference = <
  T extends Steps | undefined,
  K extends Chapter | undefined = Chapter | undefined,
>(
  props: PropsWithChildren<ActivityRendererModuleProps<T, K>>,
): ReactElement<any, any> | null => {
  const { activity } = props;

  return (
    <div className={className}>
      <ConferencingProvider room={`${TYPE_ACTIVITY}-${activity.id}`} />
    </div>
  );
};
