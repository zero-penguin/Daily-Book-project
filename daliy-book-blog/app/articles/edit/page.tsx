
import { Suspense } from "react";
import ArticleEditClient from "./ArticleEditClient";

export default function ArticleEditPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ArticleEditClient />
    </Suspense>
  );
}
