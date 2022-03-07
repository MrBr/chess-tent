import React, { useCallback } from 'react';
import { components, hooks, requests, ui } from '@application';
import { Lesson, User } from '@chess-tent/models';
import { debounce } from 'lodash';

const { Label, Headline3, ModalBody, Text, Modal, AsyncSelect } = ui;
const { useApi } = hooks;
const { UserAvatar } = components;

const searchUsers = debounce((name, callback) => {
  requests.users({ search: name }).then(({ data }) => {
    callback(data);
  });
}, 500);

export default ({ close, lesson }: { close: () => void; lesson: Lesson }) => {
  const users = lesson.users || [];
  const { fetch: saveLesson, response: assignResponse, loading } = useApi(
    requests.lessonPatch,
  );

  const onUsersChange = useCallback(
    selectOptions => {
      const newUsers = selectOptions
        ? selectOptions.map(({ id }: { id: string }) => id)
        : [];
      saveLesson(lesson.id, { users: newUsers });
    },
    [lesson.id, saveLesson],
  );

  return (
    <Modal show close={close}>
      <ModalBody>
        <Headline3 className="mt-0">Collaborators</Headline3>
        <Label>Sharing with</Label>
        <AsyncSelect
          name="user"
          cacheOptions
          placeholder="Find collaborator"
          loadOptions={searchUsers}
          isMulti
          onChange={onUsersChange}
          defaultValue={users}
          getOptionValue={({ id }) => id}
          className="mb-3"
          formatOptionLabel={(userOption: User) => (
            <>
              <UserAvatar user={userOption} size="small" />
              <Text inline>{userOption.name}</Text>
            </>
          )}
        />
        <Text as="span" fontSize="small" className="mt-3">
          {loading ? 'Saving' : !!assignResponse ? 'Collaborators saved' : null}
        </Text>
      </ModalBody>
    </Modal>
  );
};
