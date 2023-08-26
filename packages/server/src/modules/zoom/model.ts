import {
  NormalizedZoomUserToken,
  TYPE_ZOOM_USER_TOKEN,
  TYPE_USER,
} from '@chess-tent/models';
import { db } from '@application';

const zoomUserTokenSchema = db.createSchema<NormalizedZoomUserToken>(
  {
    user: {
      type: String,
      ref: TYPE_USER,
      required: true,
      index: true,
    } as unknown as NormalizedZoomUserToken['user'],
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    } as unknown as string,
    updatedAt: {
      type: Date,
      required: true,
    } as unknown as Date,
    type: {
      type: String,
      default: TYPE_ZOOM_USER_TOKEN,
    } as unknown as typeof TYPE_ZOOM_USER_TOKEN,
  },
  { id: false, _id: true },
  false,
);

zoomUserTokenSchema.index({ user: 1 }, { unique: true });

const ZoomUserTokenModel = db.createModel<NormalizedZoomUserToken>(
  TYPE_ZOOM_USER_TOKEN,
  zoomUserTokenSchema,
);

export { zoomUserTokenSchema, ZoomUserTokenModel };
