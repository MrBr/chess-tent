import { SegmentSidebar } from '../segment';
import { withSegmentSidebars } from '../../hoc';

export default withSegmentSidebars({
  task: SegmentSidebar,
  explanation: SegmentSidebar,
  hint: SegmentSidebar,
});
