import Container from 'react-bootstrap/Container';
import BRow from 'react-bootstrap/Row';
import BCol from 'react-bootstrap/Col';
import { UI } from '@types';

const Row = BRow as UI['Row']; // degrading Row props; UI row is a lesser type
const Col = BCol as UI['Col']; // degrading Col props; UI col is a lesser type

export { Container, Row, Col };
