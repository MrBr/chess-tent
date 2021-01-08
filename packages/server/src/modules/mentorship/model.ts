import { Schema } from 'mongoose';
import {
  TYPE_MENTORSHIP,
  TYPE_USER,
  NormalizedMentorship,
} from '@chess-tent/models';
import { db } from '@application';

const mentorshipSchema = db.createSchema<NormalizedMentorship>(
  {
    type: ({
      type: String,
      default: TYPE_MENTORSHIP,
    } as unknown) as typeof TYPE_MENTORSHIP,
    student: ({
      type: String,
      ref: TYPE_USER,
      required: true,
      index: true,
    } as unknown) as NormalizedMentorship['student'],
    coach: ({
      type: String,
      ref: TYPE_USER,
      required: true,
      index: true,
    } as unknown) as NormalizedMentorship['coach'],
    approved: ({
      type: Schema.Types.Boolean,
    } as unknown) as NormalizedMentorship['approved'],
  },
  { id: false, _id: true },
  false,
);
mentorshipSchema.index({ student: 1, coach: 1 }, { unique: true });

const MentorshipModel = db.createModel<NormalizedMentorship>(
  TYPE_MENTORSHIP,
  mentorshipSchema,
);

export { mentorshipSchema, MentorshipModel };
