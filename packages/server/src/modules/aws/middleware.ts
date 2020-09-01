import { getSignedUrl } from "./service";
import { MiddlewareFunction } from "@types";

const DEFAULT_SIGNED_URL_EXPIRATION_TIME = 60 * 2; // 2 min

export const generateImageSignedUrl: MiddlewareFunction = (req, res, next) => {
  getSignedUrl({
    Bucket: process.env.AWS_IMAGES_BUCKET,
    Key: res.locals.key,
    Expires: DEFAULT_SIGNED_URL_EXPIRATION_TIME,
    ContentType: res.locals.contentType,
    ACL: "public-read"
  })
    .then(url => {
      res.locals.url = url;
      next();
    })
    .catch(next);
};
