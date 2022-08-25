import React from 'react';
import { css } from '@chess-tent/styled-props';
import boardHeroSrc from '../images/board-hero.png';

const { className } = css`
  object-fit: cover;
  width: auto;
  height: 100vh;
`;

const RegistrationHero = () => (
  <img src={boardHeroSrc} alt="Zoomed chess board " className={className} />
);

export default RegistrationHero;
