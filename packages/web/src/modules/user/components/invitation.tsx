import React from 'react';
import { hooks, ui, components, constants } from '@application';
import { Components } from '@types';

const { useActiveUserRecord, usePrompt } = hooks;
const { Share } = components;
const { Button } = ui;
const { APP_DOMAIN } = constants;

const Invitation: Components['Invitation'] = ({ className }) => {
  const { value: activeUser } = useActiveUserRecord();

  const link = `${APP_DOMAIN}/register?referrer=${activeUser.id}`;
  const title = activeUser.coach ? 'Invite student' : 'Invite friend';
  const description = activeUser.coach
    ? 'Copy the link and share it with your students. The students will have to create their own accounts and they will be added to your student list automatically.'
    : 'Copy the link and share it with your friends. You`ll be able to work together on the lessons.';
  const [inviteOffcanvas, promptInvite] = usePrompt(close => (
    <Share title={title} link={link} close={close} description={description} />
  ));

  return (
    <div className={`h-25 me-3 ${className}`}>
      {inviteOffcanvas}
      <Button onClick={promptInvite} size="extra-small" variant="text">
        Invite
      </Button>
    </div>
  );
};

export default Invitation;
