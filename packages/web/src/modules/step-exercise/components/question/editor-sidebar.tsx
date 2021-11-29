import { ExerciseQuestionStep } from '@types';
import { SegmentSidebar } from '../segment';
import { withSegmentBoardsidebars } from '../../hoc';

export default withSegmentBoardsidebars<ExerciseQuestionStep>({
  task: SegmentSidebar,
  explanation: SegmentSidebar,
  hint: SegmentSidebar,
});
