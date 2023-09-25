import React from 'react';
import { ui, hooks } from '@application';
import { css } from '@chess-tent/styled-props';

import coachesImage from '../../images/coaches.png';

const { Button, Text, Card } = ui;
const { useHistory } = hooks;

const { className: cardClassName } = css`
  width: 300px;
  height: 410px;
  display: flex;
  align-items: center;
  background-image: url(${coachesImage});
  background-size: cover;

  .coaches-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--neutrals-90050, rgba(24, 34, 53, 0.5));
    width: inherit;

    .coaches-info-text {
      text-align: center;
      font-weight: 800;

      color: white;
    }

    .view-coaches-button {
      font-weight: 700;
      font-size: 14px;
      width: fit-content;
    }
  }
`;

const ViewAllCoachesCard = ({ count }: { count: number }) => {
  const history = useHistory();

  return (
    <Card className={cardClassName}>
      <Card.Body className="coaches-card-body">
        <Text
          weight={500}
          className="coaches-info-text"
        >{`${count}+ Coaches, 0-2006 ELO, 30+ languages`}</Text>
        <Button
          variant="primary"
          size="small"
          className="view-coaches-button"
          onClick={() => history.push(`/coaches`)}
        >
          View all coaches
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ViewAllCoachesCard;
