
import { Suspense } from "react";
import ArticleDetailClient from "./ArticleDetailClient";

export default function ArticleDetailPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ArticleDetailClient />
    </Suspense>
  );
}
