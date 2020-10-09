import { TagModel } from "./model";
import { Tag } from "@chess-tent/models";

export const getAll = (): Promise<Tag[]> =>
  new Promise(resolve => {
    TagModel.find()
      .then(tags => {
        resolve(tags.map(tag => tag.toObject()));
      })
      .catch(err => {
        throw err;
      });
  });

export const findTags = (startsWith: string): Promise<Tag[]> =>
  new Promise(resolve => {
    TagModel.find({ text: new RegExp(startsWith, "i") })
      .then(tags => {
        resolve(tags.map(tag => tag.toObject()));
      })
      .catch(err => {
        throw err;
      });
  });
