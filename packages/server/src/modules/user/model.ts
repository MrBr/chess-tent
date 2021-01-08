import { Schema } from 'mongoose';
import { NormalizedUser, TYPE_USER } from '@chess-tent/models';
import { db } from '@application';

const userSchema = db.createSchema<NormalizedUser>(
  {
    type: ({ type: String, default: TYPE_USER } as unknown) as typeof TYPE_USER,
    name: (Schema.Types.String as unknown) as string,
    nickname: ({
      type: String,
      required: true,
      unique: true,
    } as unknown) as string,
    email: ({
      type: String,
      required: true,
      unique: true,
    } as unknown) as string,
    password: ({
      type: String,
      required: true,
      select: false,
    } as unknown) as string,
    coach: (Schema.Types.Boolean as unknown) as boolean,
    active: ({
      type: Schema.Types.Boolean,
      default: false,
    } as unknown) as boolean,
    state: ({
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    } as unknown) as NormalizedUser['state'],
  },
  {
    minimize: false,
    toJSON: {
      transform: (doc, ret) => {
        if (!ret.state) {
          ret.state = {};
        }
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        if (!ret.state) {
          ret.state = {};
        }
        return ret;
      },
    },
  },
);

userSchema.index({ name: 'text', nickname: 'text' });

const UserModel = db.createModel<NormalizedUser>(TYPE_USER, userSchema);

export { userSchema, UserModel };
