import React, { useEffect } from 'react';
import { components, hooks, ui, requests, hoc } from '@application';
import { User } from '@chess-tent/models';
import { FileUploaderProps } from '@types';

const { useActiveUserRecord, useApi } = hooks;
const { Header, UserAvatar } = components;
const { withFiles } = hoc;
const { Page, Col, Row, Headline3, Text } = ui;

export default withFiles(({ files, openFileDialog }: FileUploaderProps) => {
  const [user] = useActiveUserRecord() as [User, never, never];
  const { fetch: signImage, response: signImageResponse } = useApi(
    requests.signImageUrl,
  );
  const { fetch: uploadImage, response: uploadImageResponse } = useApi(
    requests.uploadImage,
  );
  const { fetch: updateMe } = useApi(requests.updateMe);

  useEffect(() => {
    if (files.length === 0) {
      return;
    }
    signImage({
      contentType: files[0].type,
      key: user.id,
    });
  }, [files, signImage, user.id]);

  useEffect(() => {
    if (signImageResponse?.data && files.length > 0) {
      uploadImage(signImageResponse.data, files[0]);
    }
  }, [signImageResponse, files, uploadImage]);

  useEffect(() => {
    if (uploadImageResponse && signImageResponse) {
      updateMe({ imageUrl: uploadImageResponse });
    }
  }, [uploadImageResponse, signImageResponse, updateMe]);

  return (
    <Page>
      <Header />
      <Row>
        <Col className="col-auto">
          <UserAvatar user={user} size="large" onClick={openFileDialog} />
        </Col>
        <Col>
          <Headline3>{user.name}</Headline3>
          <Text>{user.punchline}</Text>
          <Text>{user.studentElo}</Text>
          <Text className="text-uppercase">Pricing</Text>
          <Text>{user.pricing}</Text>
          <Text className="text-uppercase">Availability</Text>
          <Text>{user.availability}</Text>
          <Text className="text-uppercase">Speciality</Text>
          <Text>{user.speciality}</Text>
        </Col>
        <Col>
          <Headline3>About me</Headline3>
          <Text>{user.about}</Text>
        </Col>
        <Col>
          <Headline3>Playing experience</Headline3>
          <Text>{user.playingExperience}</Text>
        </Col>
        <Col>
          <Headline3>Teaching experience</Headline3>
          <Text>{user.playingExperience}</Text>
          <Headline3>Teaching methodology</Headline3>
          <Text>{user.teachingMethodology}</Text>
        </Col>
      </Row>
    </Page>
  );
});
