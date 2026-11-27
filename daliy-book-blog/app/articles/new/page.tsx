
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveArticle } from "../../lib/data";
import { Button, Input, Card, Select, Content } from "@/app/components/ui";
import { useAuth } from "@/app/components/auth/AuthProvider";

export default function NewArticlePage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [articleType, setArticleType] = useState<
    "GeneralWorks" | "Philosophy" | "History" | "SocialSciences" |
    "NaturalSciences" | "Technology" | "Arts" | "Language" |
    "Literature" | "Business_Self_Help" | "Magazines" | "Comics"
  >("GeneralWorks");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [reviewScore, setReviewScore] = useState<
    "5" | "4" | "3" | "2" | "1"
  >("1");

  // 管理者以外は記事一覧へ戻す
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/articles");
    }
  }, [isLoading, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || !isAdmin) {
      alert("管理者のみ記事を登録できます。");
      return;
    }

    try {
      await saveArticle({
        title,
        articleType,
        content,
        author,
        reviewScore,
      });

      router.push("/articles");
    } catch (error) {
      console.error("記事の登録に失敗しました:", error);
      alert("記事の登録に失敗しました。");
    }
  };

  // 認証確認中、または管理者以外にはフォームを表示しない
  if (isLoading || !isAdmin) {
    return <div>認証を確認しています...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">記事の新規作成</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <Input
            label="記事のタイトル"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="例:火花を読んで"
          />

          <Select
            label="記事のジャンル"
            name="articleType"
            value={articleType}
            onChange={(e) =>
              setArticleType(e.target.value as typeof articleType)
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

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">
              記事本文
            </label>

            <Content 
              value={content}
              onChange={setContent}
            />
          </div>

          <Input
            label="記事の著者"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            placeholder="例:マグロバスター"
          />

          <Select
            label="本の評価"
            name="reviewScore"
            value={reviewScore}
            onChange={(e) =>
              setReviewScore(e.target.value as typeof reviewScore)
            }
            options={[
              { value: "5", label: "感動的だ" },
              { value: "4", label: "とても良い" },
              { value: "3", label: "良い" },
              { value: "2", label: "そこそこ" },
              { value: "1", label: "自分とは合わない" },
            ]}
            required
          />

          <div className="flex gap-2 mt-6">
            <Button type="submit">記事作成</Button>

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
