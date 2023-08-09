import {
  Difficulty,
  NormalizedStep,
  Step,
  TYPE_STEP,
  TYPE_TAG,
} from '@chess-tent/models';
import { db } from '@application';
import { Schema } from 'mongoose';
import { DepupulatedLesson } from '../lesson/model';

// could be called StepEntity as entities are established concepts in the persistence context
export interface DepopulatedStep {
  id: NormalizedStep['id'];
  type: NormalizedStep['type'];
  state: NormalizedStep['state'];
  difficulty?: NormalizedStep['difficulty'];
  tags?: NormalizedStep['tags'];
  v?: number;
}

const stepSchema = db.createSchema<DepopulatedStep>(
  {
    type: {
      type: String,
      ref: TYPE_STEP,
    } as unknown as DepopulatedStep['type'],
    state: {
      type: Schema.Types.Mixed,
      required: true,
    } as unknown as DepopulatedStep['state'],
    difficulty: {
      type: String,
      enum: Object.keys(Difficulty),
      required: true,
      index: true,
    } as unknown as DepopulatedStep['difficulty'],
    tags: [
      {
        type: String,
        ref: TYPE_TAG,
      } as unknown,
    ] as DepopulatedStep['tags'],
    v: {
      type: Schema.Types.Number,
      default: 1,
    } as unknown as number,
  },
  { minimize: false },
);

stepSchema.index({ 'state.id': 'text' });

const depopulate = (step: Partial<Step>): DepopulatedStep => {
  return new StepModel(step).depopulate('tags');
};
const StepModel = db.createModel<DepopulatedStep>(TYPE_STEP, stepSchema);

export { stepSchema, StepModel, depopulate };
