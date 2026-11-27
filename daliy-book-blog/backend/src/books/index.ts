
import { createCrudHandler } from "../common/crudHandler";

const BOOK_TYPES = [
  "GeneralWorks",
  "Philosophy",
  "History",
  "SocialSciences",
  "NaturalSciences",
  "Technology",
  "Arts",
  "Language",
  "Literature",
  "Business_Self_Help",
  "Magazines",
  "Comics",
];

const allowedFields = [
  "title",
  "author",
  "bookType",
  "url",
  "imageUrl",
];


const validate = (data: Record<string, unknown>): string | null => {
  if (
    "title" in data &&
    (typeof data.title !== "string" || !data.title.trim())
  ) {
    return "titleは空でない文字列で指定してください";
  }

  if (
    "author" in data &&
    (typeof data.author !== "string" || !data.author.trim())
  ) {
    return "authorは空でない文字列で指定してください";
  }

  if (
    "bookType" in data &&
    !BOOK_TYPES.includes(data.bookType as string)
  ) {
    return "bookTypeが不正です";
  }

  if (
    "url" in data &&
    data.url !== undefined &&
    typeof data.url !== "string"
  ) {
    return "urlは文字列で指定してください";
  }

  if (
    "imageUrl" in data &&
    data.imageUrl !== undefined &&
    typeof data.imageUrl !== "string"
  ) {
    return "imageUrlは文字列で指定してください";
  }

  return null;
};

export const handler = createCrudHandler({
  tableName: process.env.BOOKS_TABLE!,
  resourceName: "book",
  allowedFields,
  validate,
});
