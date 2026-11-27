
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getBook, updateBook, uploadBookCover } from "../../lib/data";
import type { Book } from "../../lib/types";
import { Button, Input, Select, Card, DropZone } from "@/app/components/ui";
import { useAuth } from "@/app/components/auth/AuthProvider";

export default function BookEditClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [bookType, setBookType] = useState<Book["bookType"]>("Comics");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const { isAdmin, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!isAdmin) {
      router.replace("/books");
      return;
    }

    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const fetchBook = async () => {
      try {
        const book = await getBook(id);

        if (!book) {
          setNotFound(true);
          return;
        }

        setTitle(book.title);
        setAuthor(book.author);
        setBookType(book.bookType);
        setUrl(book.url || "");
        setImageUrl(book.imageUrl || "");
      } catch (error) {
        console.error("書籍の取得に失敗しました:", error);
        setError("書籍の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, authLoading, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) return;

    try {
      setSaving(true);
      setError("");

      const newImageUrl = imageFile
        ? await uploadBookCover(imageFile)
        : imageUrl || undefined;

      await updateBook(id, {
        title,
        author,
        bookType,
        url: url || undefined,
        imageUrl: newImageUrl,
      });

      router.push("/books");
    } catch (error) {
      console.error("書籍の更新に失敗しました:", error);
      setError("書籍の更新に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !isAdmin) {
    return <div>認証を確認しています...</div>;
  }

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (notFound) {
    return (
      <div>
        <p>書籍が見つかりません。</p>
        <Button onClick={() => router.push("/books")}>
          書籍一覧へ戻る
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        書籍の編集
      </h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <Input
            label="書籍名"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="著者"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />

          <Select
            label="ジャンル"
            name="bookType"
            value={bookType}
            onChange={(e) =>
              setBookType(e.target.value as Book["bookType"])
            }
            options={[
              { value: "GeneralWorks", label: "総記" },
              { value: "Philosophy", label: "哲学・心理学" },
              { value: "History", label: "歴史・地理" },
              { value: "SocialSciences", label: "社会科学" },
              { value: "NaturalSciences", label: "自然科学" },
              { value: "Technology", label: "技術・工学" },
              { value: "Arts", label: "芸術・スポーツ" },
              { value: "Language", label: "言語" },
              { value: "Literature", label: "文学" },
              { value: "Business_Self_Help", label: "自己啓発" },
              { value: "Magazines", label: "雑誌" },
              { value: "Comics", label: "漫画" },
            ]}
            required
          />

          <Input
            label="URL"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <div className="mt-4">
            <DropZone
              file={imageFile}
              onFileChange={setImageFile}
              currentImageUrl={imageUrl}
            />
          </div>

          {error && (
            <p className="text-red-500 mt-4">
              {error}
            </p>
          )}

          <div className="flex gap-2 mt-6">
            <Button type="submit" disabled={saving}>
              {saving ? "保存中..." : "保存"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
