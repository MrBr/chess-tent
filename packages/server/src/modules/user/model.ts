import { model, Schema, Document } from "mongoose";
import { TYPE_USER, User } from "@chess-tent/models";
import { db } from "@application";

const userSchema = db.createStandardSchema<User>(
  {
    type: ({ type: String, default: TYPE_USER } as unknown) as typeof TYPE_USER,
    name: (Schema.Types.String as unknown) as string,
    nickname: ({
      type: String,
      required: true,
      unique: true
    } as unknown) as string,
    email: ({
      type: String,
      required: true,
      unique: true
    } as unknown) as string,
    password: ({ type: String, required: true } as unknown) as string
  },
  { _id: false, id: true }
);

const UserModel = model<User & Document>(TYPE_USER, userSchema);

export { userSchema, UserModel };
