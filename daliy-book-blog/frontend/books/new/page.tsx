
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveBook, uploadBookCover } from "../../lib/data";
import { Button, Input, Select, Card, DropZone } from "@/app/components/ui";
import { useAuth } from "@/app/components/auth/AuthProvider";
import Image from "next/image";

export default function NewCompetitionPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [bookType, setBookType] = useState<
    "GeneralWorks" | "Philosophy" | "History" | "SocialSciences" |
    "NaturalSciences" | "Technology" | "Arts" | "Language" |
    "Literature" | "Business_Self_Help" | "Magazines" | "Comics"
  >("GeneralWorks");
  const [url, setUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/books");
    }
  }, [isLoading, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("[handleSubmit] 実行");
    console.log("[handleSubmit] imageFile:", imageFile);

    if (isLoading || !isAdmin) {
      alert("管理者のみ書籍を登録できます。");
      return;
    }

    try {
      setSaving(true);

      let imageUrl: string | undefined;

      if (imageFile) {
        console.log("[handleSubmit] uploadBookCover呼び出し前");

        imageUrl = await uploadBookCover(imageFile);

        console.log("[handleSubmit] uploadBookCover完了:", imageUrl);
      } else {
        console.log("[handleSubmit] 画像ファイルが選択されていません");
      }

      await saveBook({
        title,
        author,
        bookType,
        url: url || undefined,
        imageUrl,
      });

      console.log("[handleSubmit] 書籍登録完了");

      router.push("/books");
    } catch (error) {
      console.error("書籍の登録に失敗しました:", error);
      alert("書籍の登録に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !isAdmin) {
    return <div>認証を確認しています...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        読んだ本の新規登録
      </h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <Input
            label="本のタイトル"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="例: 火花"
          />

          <Input
            label="著者"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            placeholder="例: 又吉直樹"
          />

          <Select
            label="ジャンル"
            name="bookType"
            value={bookType}
            onChange={(e) => setBookType(e.target.value as typeof bookType)}
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
            label="本の情報が載っているURL"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="例: https://www.amazon.co.jp/..."
          />

          <div className="mt-4">
            <DropZone
              file={imageFile}
              onFileChange={setImageFile}
            />
          </div>

          <div className="flex gap-2 mt-6">
            <Button type="submit" disabled={saving}>
              {saving ? "登録中..." : "登録"}
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
