import React, { FunctionComponent } from 'react';
import { ui } from '@application';
import { css } from '@chess-tent/styled-props';

const { Row, Col, Headline4, Text, Badge } = ui;

export interface RegistrationTipsProps {
  title: string;
  subtitle: string;
  tips: { sign: string; tip: string }[];
}

const { className } = css`
  background-color: var(--tertiary-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const RegistrationTips: FunctionComponent<RegistrationTipsProps> = ({
  tips,
  title,
  subtitle,
}) => {
  return (
    <div className={className}>
      <Col xs="10">
        <Headline4 color="light">{title}</Headline4>
        <Text fontSize="extra-small" color="light" className="mb-5">
          {subtitle}
        </Text>
        {tips.map(({ sign, tip }) => (
          <Row className="align-items-center mb-4">
            <Col className="col-auto">
              <Badge circle className="p-4" bg="bg">
                <Text className="m-0">{sign}</Text>
              </Badge>
            </Col>
            <Col>
              <Text color="light" fontSize="small" className="m-0">
                {tip}
              </Text>
            </Col>
          </Row>
        ))}
      </Col>
    </div>
  );
};

export default RegistrationTips;
