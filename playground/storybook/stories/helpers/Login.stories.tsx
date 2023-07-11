import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';
import { hooks, requests } from '@chess-tent/web/src/application';

import { withWebNamespace } from '../../utils';

export default {
  title: 'Helpers/Login',
} as ComponentMeta<UI['Form']>;

export const Default: ComponentStory<UI['Form']> = withWebNamespace(
  'ui',
  (args, { Form, Button }) => {
    const { fetch, response } = hooks.useApi(requests.login);

    useEffect(() => {
      if (response?.data) {
        const token = Cookies.get('token') || process.env.WEB_TOKEN || '';
        Cookies.set('token', token);
      }
    }, [response]);

    return (
      <Form
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={({ ...user }) => fetch(user)}
      >
        <Form.Input
          size="medium"
          type="email"
          name="email"
          placeholder="Email address"
        />
        <Form.Input
          size="medium"
          type="password"
          name="password"
          placeholder="Password"
        />
        <Button stretch type="submit">
          Sign in
        </Button>
      </Form>
    );
  },
);
