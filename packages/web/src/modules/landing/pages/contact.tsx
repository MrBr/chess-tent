import React from 'react';
import { hooks, requests, ui } from '@application';
import * as yup from 'yup';

import Topbar from '../components/topbar';
import Section from '../components/section';
import Footer from '../components/footer';
import CTA from '../components/cta';

const ContactSchema = yup.object().shape({
  name: yup.string().min(2, 'Too Short!').max(70, 'Too Long!').required(),
  message: yup.string().required(),
  email: yup.string().email('Invalid email').required(),
});

const { Container, Row, Col, Text, Hero, Form, Button, FormGroup, Label } = ui;
const { useApi } = hooks;

export const ContactPage = () => {
  const { fetch, loading, response, error } = useApi(requests.contact);
  return (
    <Container fluid>
      <Topbar />
      <Section>
        <Container>
          <Row>
            <Col md={{ offset: 2, span: 8 }} className="position-relative">
              <Hero align="center">Contact us</Hero>
              <Text align="center" fontSize="large">
                Do you have any comments, suggestions or questions? Let us know
                what you think.
              </Text>
            </Col>
          </Row>
        </Container>
      </Section>
      <Section fill>
        <Container>
          <Form
            enableReinitialize
            initialValues={{ message: '', name: '', email: '' }}
            onSubmit={fetch}
            validationSchema={ContactSchema}
          >
            <Row>
              <Col xs={12} sm={6}>
                <FormGroup>
                  <Label>Name</Label>
                  <Form.Input name="name" placeholder="Who you are" />
                </FormGroup>
              </Col>
              <Col xs={12} sm={6}>
                <FormGroup>
                  <Label>Email</Label>
                  <Form.Input
                    name="email"
                    type="email"
                    placeholder="How can we get back"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <FormGroup>
                  <Label>Message</Label>
                  <Form.Input
                    as="textarea"
                    name="message"
                    placeholder="Tell us what you have in mind"
                    rows={5}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="mt-4 align-items-center">
              <Col className="col-auto ms-auto">
                {response && !error && (
                  <Text className="m-0">Message sent successfully!</Text>
                )}
                {error && (
                  <Text className="m-0">
                    Failed to send a message. Please send us email at{' '}
                    <a href="mailto:info@chesstent.com">info@chesstent.com</a>
                  </Text>
                )}
              </Col>
              <Col className="col-auto">
                <Button type="submit" size="small" disabled={loading}>
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </Section>
      <CTA />
      <Footer />
    </Container>
  );
};

export default ContactPage;
