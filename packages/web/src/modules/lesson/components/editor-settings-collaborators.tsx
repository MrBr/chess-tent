import React, { useCallback, useEffect } from 'react';
import { components, hooks, requests, ui } from '@application';
import { Lesson, User } from '@chess-tent/models';

const { Label, Headline6, Text, Select } = ui;
const { useApi } = hooks;
const { UserAvatar } = components;

const EditorSettingsCollaborators = ({ lesson }: { lesson: Lesson }) => {
  const users = lesson.users || [];
  const {
    fetch: saveLesson,
    response: assignResponse,
    loading,
  } = useApi(requests.lessonPatch);
  const { fetch: loadContacts, response: contacts } = useApi(requests.contacts);

  useEffect(() => {
    loadContacts({ skip: 0, limit: 20 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <>
      <Headline6 className="mt-3">Collaborators</Headline6>
      <Label>Sharing with</Label>
      <Select
        name="user"
        options={contacts?.data}
        placeholder="Find collaborator"
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
    </>
  );
};

export default EditorSettingsCollaborators;
