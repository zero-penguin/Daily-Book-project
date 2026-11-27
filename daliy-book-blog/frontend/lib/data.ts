//ユーティルのtype.tsからコンポーネントをインポート
import { apiRequest } from "./api";

import {
  Book,
  Article,
  Radio,
  statusTable,
  genreRow
} from "./types";

//----------------------------------------------------- 本管理機能 -----------------------------------------------------

// ============================================
// books API
// ============================================
// 本のデータを取得
export async function getBooks(): Promise<Book[]> {
  const response = await apiRequest<{ books: Book[] }>("/books");
  return response.books;
}

// IDをもとに本のデータを取得
export async function getBook(id: string): Promise<Book | undefined> {
  try {
    const response = await apiRequest<{ book: Book }>(`/books/${id}`);
    return response.book;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return undefined;
    }
    throw error;
  }
}

// 本のデータを保存
export async function saveBook(
  data: Omit<Book, "id" | "createdAt" | "updatedAt">
): Promise<Book> {
  const response = await apiRequest<{ book: Book }>("/books", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.book;
}

// 本のデータを更新
export async function updateBook(
  id: string,
  data: Partial<Omit<Book, "id" | "createdAt" | "updatedAt">>
): Promise<Book> {
  const response = await apiRequest<{ book: Book }>(`/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  return response.book;
}

// 本のデータを削除
export async function deleteBook(id: string): Promise<void> {
  await apiRequest<void>(`/books/${id}`, {
    method: "DELETE",
  });
}

// 書籍の表紙画像をS3へアップロード
export async function uploadBookCover(file: File): Promise<string> {
  const result = await apiRequest<{
    uploadUrl: string;
    imageUrl: string;
    key: string;
  }>("/books/image-upload-url", {
    method: "POST",
    body: JSON.stringify({
      contentType: file.type,
      contentLength: file.size,
    }),
  });

  console.log("[uploadBookCover] 開始");
  console.log("[uploadBookCover] 署名付きURL取得成功");
  console.log("[uploadBookCover] S3 PUT開始");

  const uploadResponse = await fetch(result.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(`画像アップロード失敗: ${uploadResponse.status}`);
  }

  return result.imageUrl;
}

//----------------------------------------------------- 記事管理機能 -----------------------------------------------------


// ============================================
// Articles API
// ============================================

export async function getArticles(): Promise<Article[]> {
  const response = await apiRequest<{ articles: Article[] }>("/articles");
  return response.articles;
}

export async function getArticle(id: string): Promise<Article | undefined> {
  try {
    const response = await apiRequest<{ article: Article }>(
      `/articles/${id}`
    );
    return response.article;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return undefined;
    }
    throw error;
  }
}

// 最新記事を取得する
export async function getRecentArticles(): Promise<Article[]> {
  const articles = await getArticles();

  return [...articles].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );
}

export async function saveArticle(
  data: Omit<Article, "id" | "createdAt" | "updatedAt">
): Promise<Article> {
  const response = await apiRequest<{ article: Article }>("/articles", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.article;
}

export async function updateArticle(
  id: string,
  data: Partial<Omit<Article, "id" | "createdAt" | "updatedAt">>
): Promise<Article> {
  const response = await apiRequest<{ article: Article }>(
    `/articles/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );

  return response.article;
}

export async function deleteArticle(id: string): Promise<void> {
  await apiRequest<void>(`/articles/${id}`, {
    method: "DELETE",
  });
}
