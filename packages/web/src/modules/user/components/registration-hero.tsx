import React from 'react';
import { css } from '@chess-tent/styled-props';
import { utils } from '@application';
import boardHeroSrc from '../images/board-hero.png';

const { mobileCss } = utils;

const { className } = css`
  object-fit: cover;
  width: auto;
  height: 100vh;
  ${mobileCss`
    left: 0px;
    position: absolute;
    height: 100%;
    width: 100%;
  `}
`;

const RegistrationHero = () => (
  <img src={boardHeroSrc} alt="Zoomed chess board " className={className} />
);

export default RegistrationHero;
