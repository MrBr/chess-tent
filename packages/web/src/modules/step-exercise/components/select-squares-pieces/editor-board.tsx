import { SegmentBoard } from '../segment';
import { withSegments } from '../../hoc';

export default withSegments({
  task: SegmentBoard,
  explanation: SegmentBoard,
  hint: SegmentBoard,
});
