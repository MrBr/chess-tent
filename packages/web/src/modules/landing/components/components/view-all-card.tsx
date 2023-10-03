import React from 'react';
import { ui } from '@application';
import { css } from '@chess-tent/styled-props';

const { Button, Text, Card } = ui;

interface ViewAllCardProps {
  caption: string;
  buttonText: string;
  onClick: () => void;
  backgroundImage: string;
}
const ViewAllCard = ({
  caption,
  buttonText,
  backgroundImage,
  onClick,
}: ViewAllCardProps) => {
  const { className: cardClassName } = css`
    width: 300px;
    height: 410px;
    display: flex;
    align-items: center;
    background-image: url(${backgroundImage});
    background-size: cover;

    .all-card-body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: var(--neutrals-90050, rgba(24, 34, 53, 0.5));
      width: inherit;

      .all-card-info-text {
        text-align: center;
        font-weight: 800;

        color: white;
      }

      .view-all-button {
        font-weight: 700;
        font-size: 14px;
        width: fit-content;
      }
    }
  `;

  return (
    <Card className={cardClassName}>
      <Card.Body className="all-card-body">
        <Text weight={500} className="all-card-info-text">
          {caption}
        </Text>
        <Button
          variant="primary"
          size="small"
          className="view-all-button"
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ViewAllCard;
