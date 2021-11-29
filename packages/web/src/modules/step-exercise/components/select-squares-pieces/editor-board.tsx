import { SegmentBoard } from '../segment';
import { withSegmentBoards } from '../../hoc';

export default withSegmentBoards({
  task: SegmentBoard,
  explanation: SegmentBoard,
  hint: SegmentBoard,
});
