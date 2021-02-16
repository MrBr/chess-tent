import React, { useCallback, useState, useRef } from 'react';
import { components, hooks, ui, requests } from '@application';
import { Tag, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';
import { APP_DOMAIN } from '../../../api';

const { Page, CoachTrainings, LessonBrowser } = components;
const { useLessons, useUserTrainings, useApi } = hooks;
const {
  Headline3,
  Button,
  Modal,
  Input,
  Tooltip,
  Overlay,
  Check,
  Label,
  Row,
  Col,
} = ui;

export default ({ user }: { user: User }) => {
  const [trainings] = useUserTrainings(user);
  const [lessonsFilter, setLessonsFilter] = useState<LessonsRequest>({});
  const [lessons] = useLessons(`own-lessons-${user.id}`, lessonsFilter, {
    my: true,
  });
  const { fetch } = useApi(requests.inviteUser);
  const target = useRef();
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isLinkCopied, setLink] = useState(false);
  const [isMentor, setMentor] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleFilterChange = useCallback(
    (search, difficulty, tags) => {
      setLessonsFilter({
        search,
        tagIds: tags.map((it: Tag) => it.id),
        difficulty,
      });
    },
    [setLessonsFilter],
  );

  const invitationLink = `${APP_DOMAIN}/register?referrer=${user.id}${
    isMentor ? `&mentorship=${isMentor}` : ''
  }`;

  const HandleLinkCopy = () => {
    navigator.clipboard.writeText(invitationLink);
    setLink(true);
  };

  const handleSend = () => {
    fetch({
      email,
      name,
      link: invitationLink,
    });
  };

  return (
    <Page>
      <Button onClick={() => setModalVisibility(true)}>Invite student</Button>
      {/* this will be invitationModal */}
      <Modal close={() => setModalVisibility(false)} show={isModalVisible}>
        <Modal.Header>Invite student</Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="col-sm-9 col-12">
              <Input value={invitationLink} className="mb-3" />
            </Col>
            <Col className="col-sm-3 col-12">
              <Button
                className="py-2"
                ref={target}
                onClick={HandleLinkCopy}
                size="extra-small"
              >
                Copy link
              </Button>
            </Col>
            <Overlay
              //@ts-ignore
              target={target.current}
              show={isLinkCopied}
              placement="right"
            >
              {props => (
                <Tooltip {...props} id="copy-link">
                  Link copied
                </Tooltip>
              )}
            </Overlay>
          </Row>
          <Row>
            <Col className="col-12 mb-3">
              <Check
                checked={isMentor}
                onChange={() => setMentor(!isMentor)}
                label="Mentorship"
              />
            </Col>
          </Row>
          <Row>
            <Col className="col-12">
              <Label>Name:</Label>
              <Input
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </Col>
            <Col className="col-12">
              <Label>Email:</Label>
              <Input
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </Col>
            <Col className="col-12 mt-3">
              <Button size="small" onClick={handleSend}>
                Send
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      {trainings && (
        <>
          <Headline3>My trainings</Headline3>
          <CoachTrainings trainings={trainings} />
        </>
      )}
      <LessonBrowser lessons={lessons} onFiltersChange={handleFilterChange} />
    </Page>
  );
};
