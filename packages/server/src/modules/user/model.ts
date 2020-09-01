import { model, Schema, Document } from "mongoose";
import { NormalizedUser, TYPE_USER, User } from "@chess-tent/models";
import { db } from "@application";

const userSchema = db.createStandardSchema<NormalizedUser>({
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
  imageUrl: ({
    type: String
  } as unknown) as string,
  password: ({
    type: String,
    required: true,
    select: false
  } as unknown) as string
});

const UserModel = model<NormalizedUser & Document>(TYPE_USER, userSchema);

export { userSchema, UserModel };
