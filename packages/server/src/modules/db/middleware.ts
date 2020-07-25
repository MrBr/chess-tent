import { MiddlewareFunction } from "@types";
import mongoose from "mongoose";

export const indexEntity: MiddlewareFunction = (req, res, next) => {
  req.body._id = new mongoose.Types.ObjectId();
  next();
};
