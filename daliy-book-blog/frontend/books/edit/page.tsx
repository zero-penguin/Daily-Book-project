import { Suspense } from "react";
import BookEditClient from "./BookEditClient";

export default function BookEditPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <BookEditClient />
    </Suspense>
  );
}
