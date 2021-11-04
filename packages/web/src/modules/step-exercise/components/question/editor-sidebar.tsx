import { ExerciseQuestionStep, ExerciseSegmentKeys } from '@types';
import { SegmentSidebar } from '../segment';
import { withSegmentSidebars } from '../../hoc';
import { SegmentToolboxProps } from '../../types';

export default withSegmentSidebars<
  SegmentToolboxProps<ExerciseQuestionStep, ExerciseSegmentKeys>
>({
  task: SegmentSidebar,
  explanation: SegmentSidebar,
  hint: SegmentSidebar,
});
