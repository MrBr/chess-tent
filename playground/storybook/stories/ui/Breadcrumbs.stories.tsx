import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/Breadcrumbs',
} as ComponentMeta<UI['Breadcrumbs']>;

const Template: ComponentStory<UI['Breadcrumbs']> = withWebNamespace(
  'ui',
  (args, { Breadcrumbs }, { application }) => (
    <application.components.Router>
      {() => (
        <Breadcrumbs>
          <Breadcrumbs.Item href="/?path=/story/ui-breadcrumbs--default">
            Dashboard
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="/?">Lesson</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/">Preview</Breadcrumbs.Item>
        </Breadcrumbs>
      )}
    </application.components.Router>
  ),
);

export const Default = Template.bind({});
Default.args = {};
