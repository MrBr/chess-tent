export const TYPE_TAG = "tags";

export interface Tag {
  id: string;
  text: string;
  type: typeof TYPE_TAG;
}

export interface NormalizedTag {
  id: Tag["id"];
  text: Tag["text"];
  type: Tag["type"];
}
