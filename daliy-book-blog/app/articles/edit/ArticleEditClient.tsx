
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getArticle, updateArticle } from "../../lib/data";
import type { Article } from "../../lib/types";
import { Button, Input, Card, Select, TextArea, Content } from "@/app/components/ui";
import { useAuth } from "@/app/components/auth/AuthProvider";

export default function ArticleEditClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [articleType, setArticleType] = useState<Article["articleType"]>(
    "GeneralWorks"
  );
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [reviewScore, setReviewScore] = useState<Article["reviewScore"]>("1");

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const { isAdmin, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Cognitoの認証確認が終わるまで待機
    if (authLoading) return;

    // 管理者以外は記事一覧へ戻す
    if (!isAdmin) {
        router.replace("/articles");
        return;
    }

    if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
    }

    const fetchArticle = async () => {
        try {
        const article = await getArticle(id);

        if (!article) {
            setNotFound(true);
            return;
        }

        setTitle(article.title);
        setArticleType(article.articleType);
        setContent(article.content);
        setAuthor(article.author);
        setReviewScore(article.reviewScore);
        } catch (error) {
        console.error("記事の取得に失敗しました:", error);
        setError("記事の取得に失敗しました。");
        } finally {
        setLoading(false);
        }
    };

    fetchArticle();
  }, [id, authLoading, isAdmin, router]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!id) return;

    try {
      setSaving(true);
      setError("");

      await updateArticle(id, {
        title,
        articleType,
        content,
        author,
        reviewScore,
      });

      router.push("/articles");
    } catch (error) {
      console.error("記事の更新に失敗しました:", error);
      setError("記事の更新に失敗しました。");
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
        <p>記事が見つかりません。</p>
        <Button onClick={() => router.push("/articles")}>
          記事一覧へ戻る
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        記事の編集
      </h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <Input
            label="記事のタイトル"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Select
            label="記事のジャンル"
            name="articleType"
            value={articleType}
            onChange={(e) =>
              setArticleType(e.target.value as Article["articleType"])
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
              setReviewScore(e.target.value as Article["reviewScore"])
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
