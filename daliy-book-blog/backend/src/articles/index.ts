
import { createCrudHandler } from "../common/crudHandler";

const ARTICLE_TYPES = [
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

const REVIEW_SCORES = ["5", "4", "3", "2", "1"];

const allowedFields = [
  "title",
  "articleType",
  "content",
  "author",
  "reviewScore",
];

const validate = (data: Record<string, unknown>): string | null => {
  if (
    "title" in data &&
    (typeof data.title !== "string" || !data.title.trim())
  ) {
    return "titleは空でない文字列で指定してください";
  }

  if (
    "articleType" in data &&
    !ARTICLE_TYPES.includes(data.articleType as string)
  ) {
    return "articleTypeが不正です";
  }

  if (
    "content" in data &&
    typeof data.content !== "string"
  ) {
    return "contentは文字列で指定してください";
  }

  if (
    "author" in data &&
    (typeof data.author !== "string" || !data.author.trim())
  ) {
    return "authorは空でない文字列で指定してください";
  }

  if (
    "reviewScore" in data &&
    !REVIEW_SCORES.includes(data.reviewScore as string)
  ) {
    return "reviewScoreは1〜5の文字列で指定してください";
  }

  return null;
};

export const handler = createCrudHandler({
  tableName: process.env.ARTICLES_TABLE!,
  resourceName: "article",
  allowedFields,
  validate,
});
