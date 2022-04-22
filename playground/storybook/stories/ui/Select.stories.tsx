import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/Select',
} as ComponentMeta<UI['Select']>;

export const SingleValue: ComponentStory<UI['Select']> = withWebNamespace(
  'ui',
  (args, { Select, Icon }) => {
    const options = [
      { label: 'activities', value: 'activities' },
      { label: 'lessons', value: 'lessons' },
      { label: 'users', value: 'users' },
    ];

    return (
      <>
        <Select options={options} />
      </>
    );
  },
);

export const MultiValue: ComponentStory<UI['Select']> = withWebNamespace(
  'ui',
  (args, { Select, Icon }) => {
    const options = [
      { label: 'activities', value: 'activities' },
      { label: 'lessons', value: 'lessons' },
      { label: 'users', value: 'users' },
    ];

    return (
      <>
        <Select options={options} isMulti={true} />
      </>
    );
  },
);
