import { db } from '@application';

import { roleSchema, depopulateRole } from './model';

db.roleSchema = roleSchema;
db.depopulateRole = depopulateRole;
