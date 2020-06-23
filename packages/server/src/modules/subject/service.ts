import { SubjectModel } from "./model";
import { Service } from "@types";
import { Subject } from "@chess-tent/models";

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

export const getSubject = <T extends Subject>(subjectId: T["id"]): Promise<T> =>
  new Promise((resolve, reject) => {
    SubjectModel.findOne({ _id: subjectId }, undefined, (err, result) => {
      err
        ? reject(err)
        : resolve(result ? (result.toObject() as T) : undefined);
    });
  });

export const findSubjects = <T extends Subject>(
  subject: Partial<T>
): Promise<T[]> =>
  new Promise((resolve, reject) => {
    SubjectModel.find({ ...subject }, undefined, (err, result) => {
      err ? reject(err) : resolve(result.map(item => item.toObject()) as T[]);
    });
  });
