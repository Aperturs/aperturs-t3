import { customAlphabet, nanoid } from "nanoid";

import type { UniqueIdsType } from "@aperturs/validators/user";

export function createUniqueIds(id: UniqueIdsType, custom?: boolean) {
  if (custom) {
    const nanoid = customAlphabet("-abcdefghijklmnopqrstuvwxyz", 14);
    return `${id}-${nanoid()}`;
  }
  return `${id}-${nanoid(11)}`;
}
