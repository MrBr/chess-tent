import { SubjectModel } from "./model";
import { Service } from "@types";

export const saveSubject: Service["saveSubject"] = subject =>
  new Promise((resolve, reject) => {
    SubjectModel.updateOne(
      { _id: subject.id },
      subject,
      { upsert: true },
      (err, result) => {
        err ? reject(err) : resolve(result.toObject() as typeof subject);
      }
    );
  });
