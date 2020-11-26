import React, { useEffect } from 'react';
import { components, hooks, ui, requests, hoc } from '@application';
import { User } from '@chess-tent/models';
import { FileUploaderProps } from '@types';

const { useApi, useHistory } = hooks;
const { UserAvatar, Layout } = components;
const { Absolute, Button } = ui;
const { withFiles } = hoc;
const {
  Col,
  Row,
  Headline3,
  Headline4,
  InputGroup,
  Form,
  FormGroup,
  Label,
} = ui;

export default withFiles(
  ({ files, openFileDialog, user }: FileUploaderProps & { user: User }) => {
    const history = useHistory();
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
        updateMe({ state: { imageUrl: uploadImageResponse } });
      }
    }, [uploadImageResponse, signImageResponse, updateMe]);

    return (
      <Layout>
        <Form initialValues={user} onSubmit={user => updateMe(user)}>
          {({ dirty, handleSubmit, resetForm, values }) => (
            <>
              <Absolute bottom={25} right={25}>
                <Button
                  variant="regular"
                  className="mr-4"
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
                  <UserAvatar
                    user={user}
                    size="large"
                    onClick={openFileDialog}
                  />
                </Col>
                <Col>
                  <Headline3>{user.name}</Headline3>
                  {user.coach && (
                    <>
                      <FormGroup>
                        <Label>Punchline</Label>
                        <Form.Input
                          value={user.state.punchline}
                          as="textarea"
                          rows={2}
                          name="punchline"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Preferred elo</Label>
                        <Form.Input
                          value={user.state.studentElo}
                          name="state.studentElo"
                          type="number"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Pricing</Label>
                        <InputGroup>
                          <Form.Input
                            value={user.state.pricing}
                            name="state.pricing"
                            type="number"
                          />
                          <InputGroup.Append>
                            <InputGroup.Text>$/hr</InputGroup.Text>
                          </InputGroup.Append>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <Label>Availability</Label>
                        <Form.Input
                          value={user.state.availability}
                          name="state.availability"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Speciality</Label>
                        <Form.Input
                          value={user.state.speciality}
                          name="state.speciality"
                        />
                      </FormGroup>
                    </>
                  )}
                </Col>
                <Col>
                  <Headline4>About me</Headline4>
                  <FormGroup>
                    <Form.Input
                      as="textarea"
                      rows={5}
                      value={user.state.about}
                      name="state.about"
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <Headline4>Playing experience</Headline4>
                  <FormGroup>
                    <Form.Input
                      as="textarea"
                      rows={5}
                      value={user.state.playingExperience}
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
                        value={user.state.teachingExperience}
                        name="state.teachingExperience"
                      />
                    </FormGroup>
                    <Headline4>Teaching methodology</Headline4>
                    <FormGroup>
                      <Form.Input
                        as="textarea"
                        rows={5}
                        value={user.state.teachingMethodology}
                        name="state.teachingMethodology"
                      />
                    </FormGroup>
                  </Col>
                )}
              </Row>
            </>
          )}
        </Form>
      </Layout>
    );
  },
);