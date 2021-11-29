import { SegmentSidebar } from '../segment';
import { withSegmentBoardsidebars } from '../../hoc';

export default withSegmentBoardsidebars({
  task: SegmentSidebar,
  explanation: SegmentSidebar,
  hint: SegmentSidebar,
});
