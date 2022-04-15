import React, { useEffect, useCallback } from 'react';
import { components, hooks, ui, requests, hoc } from '@application';
import { updateSubject, User } from '@chess-tent/models';
import { FileUploaderProps } from '@types';

import EditableUserAvatar from '../components/editable-user-avatar';

const { useApi, useHistory, useDispatchService } = hooks;
const { Page } = components;
const { Absolute, Button } = ui;
const { withFiles } = hoc;
const { Col, Row, Headline4, InputGroup, Form, FormGroup, Label } = ui;

export default withFiles(
  ({ files, openFileDialog, user }: FileUploaderProps & { user: User }) => {
    const history = useHistory();
    const updateUserLocal = useDispatchService()(updateSubject);
    const {
      fetch: signImage,
      response: signImageResponse,
      loading: signingImage,
      reset: resetSignedImage,
    } = useApi(requests.signImageUrl);
    const {
      fetch: uploadImage,
      response: uploadImageResponse,
      loading: uploadingImage,
      reset: resetUploadedImage,
    } = useApi(requests.uploadImage);
    const { fetch: updateMe } = useApi(requests.updateMe);

    const updateUser = useCallback(
      (patch: Partial<User>) => {
        updateMe(patch);
        updateUserLocal(user, patch);
      },
      [updateUserLocal, updateMe, user],
    );

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
        resetSignedImage();
        resetUploadedImage();
        // TODO - find a better way for unique image url
        //  `t` is added to invalidate cache
        const imageUrl = uploadImageResponse + '?t=' + Date.now();
        updateUser({ state: { imageUrl } });
      }
    }, [
      uploadImageResponse,
      signImageResponse,
      updateUser,
      resetUploadedImage,
      resetSignedImage,
    ]);

    return (
      <Page>
        <Form
          enableReinitialize
          initialValues={user}
          onSubmit={user => updateUser(user)}
        >
          {({ dirty, handleSubmit, resetForm, values }) => (
            <>
              <Absolute bottom={25} right={25}>
                <Button
                  variant="regular"
                  className="me-4"
                  onClick={() => {
                    resetForm();
                    history.goBack();
                  }}
                >
                  {dirty ? 'Cancel' : 'Done'}
                </Button>
                <Button
                  variant={dirty ? 'secondary' : 'regular'}
                  disabled={!dirty}
                  type="button"
                  onClick={() => {
                    handleSubmit();
                    resetForm({ values });
                  }}
                >
                  Save
                </Button>
              </Absolute>

              <Row>
                <Col className="col-auto mt-4">
                  <EditableUserAvatar
                    user={user}
                    onClick={openFileDialog}
                    uploading={signingImage || uploadingImage}
                  />
                </Col>
                <Col>
                  <FormGroup>
                    <Headline4>Name</Headline4>
                    <Form.Input name="name" />
                  </FormGroup>
                  {user.coach && (
                    <>
                      <FormGroup>
                        <Label>Punchline</Label>
                        <Form.Input
                          as="textarea"
                          rows={2}
                          name="state.punchline"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Preferred elo</Label>
                        <Form.Input name="state.studentElo" type="number" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Pricing</Label>
                        <InputGroup>
                          <Form.Input name="state.pricing" type="number" />
                          <InputGroup.Text>$/hr</InputGroup.Text>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <Label>Availability</Label>
                        <Form.Input name="state.availability" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Speciality</Label>
                        <Form.Input name="state.speciality" />
                      </FormGroup>
                    </>
                  )}
                </Col>
                <Col>
                  <Headline4>About me</Headline4>
                  <FormGroup>
                    <Form.Input as="textarea" rows={5} name="state.about" />
                  </FormGroup>
                </Col>
                <Col>
                  <Headline4>Playing experience</Headline4>
                  <FormGroup>
                    <Form.Input
                      as="textarea"
                      rows={5}
                      name="state.playingExperience"
                    />
                  </FormGroup>
                </Col>
                {user.coach && (
                  <Col>
                    <Headline4>Teaching experience</Headline4>
                    <FormGroup>
                      <Form.Input
                        as="textarea"
                        rows={5}
                        name="state.teachingExperience"
                      />
                    </FormGroup>
                    <Headline4>Teaching methodology</Headline4>
                    <FormGroup>
                      <Form.Input
                        as="textarea"
                        rows={5}
                        name="state.teachingMethodology"
                      />
                    </FormGroup>
                  </Col>
                )}
              </Row>
            </>
          )}
        </Form>
      </Page>
    );
  },
);
