import { hoc } from '@application';
import Desktop from './desktop';
import Mobile from './mobile';

export default hoc.withMobile(Desktop, Mobile);
