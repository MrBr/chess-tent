import { db } from '@application';
import {
  NormalizedPermission,
  Permission,
  TYPE_PERMISSION,
} from '@chess-tent/models/src';

export interface DepopulatedPermission {
  id: NormalizedPermission['id'];
  type: NormalizedPermission['type'];
  holder: NormalizedPermission['holder'];
  holderType: NormalizedPermission['holderType'];
  role: NormalizedPermission['role'];
  object: NormalizedPermission['object'];
  objectType: NormalizedPermission['objectType'];
  v?: number;
}

const permissionSchema = db.createSchema<DepopulatedPermission>(
  {
    type: {
      type: String,
      ref: TYPE_PERMISSION,
    } as unknown as DepopulatedPermission['type'],
    holder: {} as unknown as DepopulatedPermission['holder'],
    holderType: {} as unknown as DepopulatedPermission['holderType'],
    role: {} as unknown as DepopulatedPermission['role'],
    object: {} as unknown as DepopulatedPermission['object'],
    objectType: {} as unknown as DepopulatedPermission['objectType'],
    v: {} as unknown as number,
  },
  { minimize: false },
);

permissionSchema.index({
  holder: 'text',
  holderType: 'text',
  object: 'text',
  objectType: 'text',
});

permissionSchema.index(
  {
    holder: 'text',
    holderType: 'text',
    role: 'text',
    object: 'text',
    objectType: 'text',
  },
  { unique: true },
);
const depopulatePermission = (
  permission: Permission,
): DepopulatedPermission => {
  return {
    id: permission.id,
    type: permission.type,
    holder: permission.holder.id,
    holderType: permission.holder.type,
    role: permission.role,
    object: permission.object.id,
    objectType: permission.object.type,
  } as DepopulatedPermission;
};

const PermissionModel = db.createModel<DepopulatedPermission>(
  TYPE_PERMISSION,
  permissionSchema,
);

export { permissionSchema, PermissionModel, depopulatePermission };
