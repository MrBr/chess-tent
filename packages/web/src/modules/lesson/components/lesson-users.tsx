import React, { useCallback, useState } from 'react';
import { components, hooks, requests, ui } from '@application';
import { Lesson, User } from '@chess-tent/models';
import { debounce } from 'lodash';

const { Label, Headline3, Button, ModalBody, Text, Modal, AsyncSelect } = ui;
const { useApi } = hooks;
const { UserAvatar } = components;

const searchUsers = debounce((name, callback) => {
  requests.users({ search: name }).then(({ data }) => callback(data));
}, 500);

export default ({ close, lesson }: { close: () => void; lesson: Lesson }) => {
  const users = lesson.users || [];
  const [newUsers, setNewUsers] = useState([]);
  const { fetch: saveLesson, response: assignResponse, loading } = useApi(
    requests.lessonPatch,
  );

  const saveCollaborators = useCallback(() => {
    saveLesson(lesson.id, { users: newUsers });
  }, [lesson.id, newUsers, saveLesson]);

  const onUsersChange = useCallback(
    selectOptions => {
      setNewUsers(
        selectOptions ? selectOptions.map(({ id }: { id: string }) => id) : [],
      );
    },
    [setNewUsers],
  );

  return (
    <Modal show close={close}>
      <ModalBody>
        <Headline3 className="mt-0">Collaborators</Headline3>
        <Label>Sharing with</Label>
        <AsyncSelect
          name="user"
          placeholder="Find collaborator"
          loadOptions={searchUsers}
          isMulti
          onChange={onUsersChange}
          defaultValue={users}
          formatOptionLabel={(userOption: User) => (
            <>
              <UserAvatar user={userOption} size="small" />
              <Text inline>{userOption.name}</Text>
            </>
          )}
        />
        <Button
          type="submit"
          disabled={loading}
          onClick={saveCollaborators}
          className="mt-3"
        >
          Assign
        </Button>
        <Text inline fontSize="small" className="ml-4">
          {loading
            ? 'Assigning'
            : !!assignResponse
            ? 'Collaborators assigned'
            : null}
        </Text>
      </ModalBody>
    </Modal>
  );
};
