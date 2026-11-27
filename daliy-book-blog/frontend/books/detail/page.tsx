import { Suspense } from "react";
import BookDetailClient from "./BookDetailClient";

export default function BookDetailPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <BookDetailClient />
    </Suspense>
  );
}
