import React from 'react';
import { components, constants, hooks } from '@application';
import { User } from '@chess-tent/models';
import { Hooks } from '@types';
import { useSelector } from 'react-redux';

import { userSelector } from './state/selectors';
import { activeUser } from './records';

const { usePrompt } = hooks;
const { Share } = components;
const { APP_URL } = constants;

export const useUser = (userId: User['id']) => {
  return useSelector(userSelector(userId));
};

export const useActiveUserRecord = (fallback => {
  return hooks.useRecordSafe(
    hooks.useRecordInit(activeUser, 'activeUser'),
    fallback,
  );
}) as Hooks['useActiveUserRecord'];

export const useInviteUser = () => {
  const { value: activeUser } = useActiveUserRecord();

  const link = `${APP_URL}/register?referrer=${activeUser.id}`;
  const title = activeUser.coach ? 'Invite student' : 'Invite friend';
  const description = activeUser.coach
    ? 'Copy the link and share it with your students. The students will have to create their own accounts and they will be added to your student list automatically.'
    : 'Copy the link and share it with your friends. You`ll be able to work together on the lessons.';
  return usePrompt(close => (
    <Share title={title} link={link} close={close} description={description} />
  ));
};
