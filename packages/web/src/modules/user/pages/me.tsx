import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { components, hooks, ui, requests } from '@application';
import { User } from '@chess-tent/models';

const { useActiveUserRecord, useApi } = hooks;
const { Header, Lessons, Activities } = components;
const { Container, File } = ui;

export default () => {
  const [user] = useActiveUserRecord() as [User, never, never];
  const signImageApi = useApi(requests.signImageUrl);
  const uploadImageApi = useApi(requests.uploadImage);
  const updateMeApi = useApi(requests.updateMe);
  const [file, setFile] = useState<File | null>(null);

  const fileUploadHandle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        setFile(event.target.files[0]);
        signImageApi.fetch({
          contentType: event.target.files[0].type,
          key: user.id,
        });
      }
    },
    [],
  );

  useEffect(() => {
    if (signImageApi.response?.data && file) {
      uploadImageApi.fetch(signImageApi.response.data, file);
    }
  }, [signImageApi.response, file]);

  useEffect(() => {
    if (uploadImageApi.response && signImageApi.response) {
      updateMeApi.fetch({ imageUrl: uploadImageApi.response });
    }
  }, [uploadImageApi.response, signImageApi.response]);

  return (
    <Container>
      <Header />
      <File>
        <File.Input onChange={fileUploadHandle} />
      </File>
      <img src={user.imageUrl} alt="Profile image" width={100} />
      {JSON.stringify(user)}
      <Lessons owner={user} />
      <Activities owner={user} />
    </Container>
  );
};
