import { useEffect } from 'react';
import { Conversation, createConversation, User } from '@chess-tent/models';
import { RecordValue } from '@chess-tent/redux-record/types';
import { hooks, requests, state, utils } from '@application';

import { selectConversationByUsers } from '../state/selectors';

const { useSelector, useActiveUserRecord, useApi, useDispatch } = hooks;
const {
  actions: { updateEntity },
} = state;
const { generateIndex } = utils;

export const useConversation = (
  participant: User,
): RecordValue<Conversation> => {
  const { value: activeUser } = useActiveUserRecord();
  const { fetch, loading, response, reset } = useApi(requests.conversations);
  const dispatch = useDispatch();
  const conversation = useSelector(
    selectConversationByUsers(activeUser, participant),
  );

  useEffect(() => {
    if (!response?.data) {
      return;
    }
    const newConversation =
      response.data.length === 1
        ? response.data[0]
        : createConversation(generateIndex(), [activeUser, participant], []);
    dispatch(updateEntity(newConversation));
    reset();
  }, [activeUser, dispatch, participant, reset, response]);

  useEffect(() => {
    if (participant && !conversation && !loading && !response) {
      fetch([activeUser.id, participant.id], {
        skip: 0,
        limit: 1,
      });
    }
  }, [participant, conversation, loading, fetch, response, activeUser.id]);

  return conversation;
};
