import React, { useCallback } from 'react';
import { components, hooks, ui, utils } from '@application';
import { updateSubject, User } from '@chess-tent/models';

import EditableUserAvatar from '../components/editable-user-avatar';
import SelectStudentElo from '../components/select-student-elo';
import SelectFideTitle from '../components/select-fide-title';
import SelectLanguages from '../components/select-languages';

const { useActiveUserRecord, useHistory } = hooks;
const { Page, Header } = components;
const { Button } = ui;
const { getCountries, getCountryByCode } = utils;
const {
  Col,
  Row,
  InputGroup,
  Form,
  FormGroup,
  Label,
  Select,
  Headline5,
  Headline6,
  Container,
  Breadcrumbs,
} = ui;

const EditUserPage = ({ user }: { user: User }) => {
  const history = useHistory();
  const { update, save } = useActiveUserRecord();

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      update(updateSubject(user, patch));
      save();
    },
    [update, user, save],
  );

  return (
    <Form
      enableReinitialize
      initialValues={user}
      onSubmit={user => updateUser(user)}
      className="position-relative d-flex flex-column col"
    >
      {({ dirty, handleSubmit, resetForm, values, setFieldValue }) => (
        <Page
          header={
            <Header className="justify-content-between border-bottom">
              <Col className="col-auto">
                <Breadcrumbs>
                  <Breadcrumbs.Item href="/">Coaches</Breadcrumbs.Item>
                  <Breadcrumbs.Item>{user.name}</Breadcrumbs.Item>
                  <Breadcrumbs.Item>Edit</Breadcrumbs.Item>
                </Breadcrumbs>
              </Col>
              <Col />
              <Col className="col-auto">
                <Button
                  size="extra-small"
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
                  size="extra-small"
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
              </Col>
            </Header>
          }
        >
          <Container fluid className="px-5 py-4">
            <Headline5 className="mb-3">Profile</Headline5>
            <Headline6>Basic</Headline6>
            <Row className="mt-2">
              <Col className="col-auto mt-4">
                <EditableUserAvatar />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <FormGroup>
                  <Label>Name</Label>
                  <Form.Input name="name" />
                </FormGroup>
              </Col>
              <Col className="col-md-4">
                <FormGroup>
                  <Label>Country</Label>
                  <Select
                    isMulti={false}
                    defaultValue={
                      user.state.country
                        ? getCountryByCode(user.state.country)
                        : undefined
                    }
                    options={getCountries()}
                    getOptionValue={({ name }) => name}
                    formatOptionLabel={({ name, flag }) => (
                      <span>
                        {flag} {name}
                      </span>
                    )}
                    onChange={val => {
                      setFieldValue('state.country', val?.cca2);
                    }}
                  />
                </FormGroup>
              </Col>
              <Col className="col-md-4">
                <FormGroup>
                  <Label>Languages</Label>
                  <SelectLanguages
                    languages={user.state.languages}
                    onChange={languages => {
                      setFieldValue('state.languages', languages);
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <FormGroup>
                  <Label>Elo</Label>
                  <Form.Input name="state.elo" type="number" />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>FIDE title</Label>
                  <SelectFideTitle
                    fideTitle={user.state.fideTitle}
                    onChange={value => {
                      setFieldValue('state.fideTitle', value);
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Label>About me</Label>
                <FormGroup>
                  <Form.Input as="textarea" rows={5} name="state.about" />
                </FormGroup>
              </Col>
              <Col>
                <Label>Playing experience</Label>
                <FormGroup>
                  <Form.Input
                    as="textarea"
                    rows={5}
                    name="state.playingExperience"
                  />
                </FormGroup>
              </Col>
            </Row>
            {user.coach && (
              <>
                <Headline6 className="mt-5">Coach info</Headline6>
                <Row className="mt-4">
                  <Col>
                    <FormGroup>
                      <Label>Punchline</Label>
                      <Form.Input name="state.punchline" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                      <Label>Speciality</Label>
                      <Form.Input name="state.speciality" />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup className="mt-3">
                      <Label>Student elo</Label>
                      <SelectStudentElo
                        range={[
                          user.state.studentEloMin || 500,
                          user.state.studentEloMax || 1200,
                        ]}
                        onChange={([min, max]) => {
                          setFieldValue('state.studentEloMin', min);
                          setFieldValue('state.studentEloMax', max);
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Pricing</Label>
                      <InputGroup>
                        <Form.Input name="state.pricing" type="number" />
                        <InputGroup.Text>$/hr</InputGroup.Text>
                      </InputGroup>
                    </FormGroup>
                    <FormGroup className="mt-3">
                      <Label>Availability</Label>
                      <Form.Input name="state.availability" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col>
                    <Label>Teaching experience</Label>
                    <FormGroup>
                      <Form.Input
                        as="textarea"
                        rows={5}
                        name="state.teachingExperience"
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <Label>Teaching methodology</Label>
                    <FormGroup>
                      <Form.Input
                        as="textarea"
                        rows={5}
                        name="state.teachingMethodology"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </>
            )}
          </Container>
        </Page>
      )}
    </Form>
  );
};

export default EditUserPage;
