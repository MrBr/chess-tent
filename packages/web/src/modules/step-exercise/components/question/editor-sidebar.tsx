import { ExerciseQuestionStep } from '@types';
import { SegmentSidebar } from '../segment';
import { withSegmentSidebars } from '../../hoc';

export default withSegmentSidebars<ExerciseQuestionStep>({
  task: SegmentSidebar,
  explanation: SegmentSidebar,
  hint: SegmentSidebar,
});
