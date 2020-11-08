import React, { useEffect } from 'react';
import { components, hooks, ui, requests, hoc } from '@application';
import { User } from '@chess-tent/models';
import { FileUploaderProps } from '@types';

const { useApi } = hooks;
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
      <Layout>
        <Form initialValues={user} onSubmit={user => updateMe(user)}>
          {({ dirty, handleSubmit }) => (
            <>
              <Absolute bottom={25} right={25}>
                {dirty ? (
                  <Button variant="secondary" onClick={handleSubmit}>
                    Save
                  </Button>
                ) : (
                  <Button variant="regular">No changes</Button>
                )}
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
                  <FormGroup>
                    <Label>Punchline</Label>
                    <Form.Input
                      value={user.punchline}
                      as="textarea"
                      rows={2}
                      name="punchline"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Preferred elo</Label>
                    <Form.Input
                      value={user.studentElo}
                      name="studentElo"
                      type="number"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Pricing</Label>
                    <InputGroup>
                      <Form.Input
                        value={user.pricing}
                        name="pricing"
                        type="number"
                      />
                      <InputGroup.Append>
                        <InputGroup.Text>$/hr</InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label>Availability</Label>
                    <Form.Input value={user.availability} name="availability" />
                  </FormGroup>
                  <FormGroup>
                    <Label>Speciality</Label>
                    <Form.Input value={user.speciality} name="speciality" />
                  </FormGroup>
                </Col>
                <Col>
                  <Headline4>About me</Headline4>
                  <FormGroup>
                    <Form.Input
                      as="textarea"
                      rows={5}
                      value={user.about}
                      name="about"
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <Headline4>Playing experience</Headline4>
                  <FormGroup>
                    <Form.Input
                      as="textarea"
                      rows={5}
                      value={user.playingExperience}
                      name="playingExperience"
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <Headline4>Teaching experience</Headline4>
                  <FormGroup>
                    <Form.Input
                      as="textarea"
                      rows={5}
                      value={user.playingExperience}
                      name="playingExperience"
                    />
                  </FormGroup>
                  <Headline4>Teaching methodology</Headline4>
                  <FormGroup>
                    <Form.Input
                      as="textarea"
                      rows={5}
                      value={user.teachingMethodology}
                      name="teachingMethodology"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </Layout>
    );
  },
);
