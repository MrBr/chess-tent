import { NormalizedRole, Role, TYPE_USER } from '@chess-tent/models';
import { db } from '@application';

const roleSchema = db.createSchema<NormalizedRole<string>>(
  {
    user: ({
      type: String,
      ref: TYPE_USER,
      index: true,
    } as unknown) as NormalizedRole<string>['user'],
    role: ({
      type: String,
    } as unknown) as NormalizedRole<string>['role'],
  },
  { minimize: false },
);

const depopulateRole = <T>({ user, role }: Role<T>): NormalizedRole<T> => ({
  user: user.id,
  role,
});

export { roleSchema, depopulateRole };
