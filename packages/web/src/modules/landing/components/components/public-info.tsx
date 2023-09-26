import React, { ReactNode } from 'react';
import { ui, hooks } from '@application';
import { css } from '@chess-tent/styled-props';

const { Row, Col, Button, Icon, Text } = ui;
const { useIsMobile } = hooks;

interface PublicInfoProps {
  title: string;
  description: string;
  dataLength: number;
  setCardIndex: Function;
  children: ReactNode;
}

const { className: arrowClassName } = css`
  margin-right: 5px;
`;

const CARD_STEP = 1;

const PublicInfo = ({
  title,
  description,
  dataLength,
  setCardIndex,
  children,
}: PublicInfoProps) => {
  const isMobile = useIsMobile();
  const cardCount = isMobile ? 1 : 3;

  const onLeftArrowClick = () => {
    setCardIndex((prevIndex: number) =>
      prevIndex > cardCount ? prevIndex - CARD_STEP : dataLength + 1,
    );
  };

  const onRightArrowClick = () => {
    setCardIndex((prevIndex: number) =>
      prevIndex <= dataLength ? prevIndex + CARD_STEP : cardCount,
    );
  };

  return (
    <Row className="d-flex flex-row pt-4 align-items-center">
      <Col lg={3} className="pb-5">
        <Text weight={500}>🚀 {title}</Text>
        <Text>{description}</Text>
        <Button
          variant="regular"
          size="extra-small"
          className={arrowClassName}
          onClick={onLeftArrowClick}
        >
          <Icon type="left" />
        </Button>
        <Button
          variant="regular"
          size="extra-small"
          onClick={onRightArrowClick}
        >
          <Icon type="right" />
        </Button>
      </Col>
      <Col
        md={12}
        lg={9}
        className="d-flex flex-row overflow-hidden justify-content-center justify-content-md-end"
      >
        {children}
      </Col>
    </Row>
  );
};

export default PublicInfo;
