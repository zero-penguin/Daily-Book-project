
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import type { Article } from "../../lib/types";
import { getArticle } from "../../lib/data";
import { Button } from "@/app/components/ui";
import { formatDate } from "../../lib/utils";
import { useAuth } from "@/app/components/auth/AuthProvider";

const articleTypeLabels: Record<string, string> = {
  GeneralWorks: "総記",
  Philosophy: "哲学・心理学",
  History: "歴史・地理",
  SocialSciences: "社会科学",
  NaturalSciences: "自然科学",
  Technology: "技術・工学",
  Arts: "芸術・スポーツ",
  Language: "言語",
  Literature: "文学",
  Business_Self_Help: "自己啓発",
  Magazines: "雑誌",
  Comics: "漫画",
};

export default function ArticleDetailClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isAdmin, isLoading: authLoading } = useAuth();

  // 記事情報を取得する
  useEffect(() => {
    if (!id) {
      setError("記事IDが指定されていません。");
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getArticle(id);

        if (!data) {
          setError("記事が見つかりません。");
          return;
        }

        setArticle(data);
      } catch (error) {
        console.error("記事の取得に失敗しました:", error);
        setError("記事の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // 読み込み中
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="font-serif text-xl text-[#77766e]">
          Loading Article...
        </p>
        <p className="mt-3 text-xs tracking-widest text-[#a49a8c]">
          PLEASE WAIT
        </p>
      </div>
    );
  }

  // エラー・記事が存在しない場合
  if (error || !article) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="font-serif text-3xl text-[#292923]">
          Article Not Found
        </p>

        <p className="mt-4 text-sm text-[#77766e]">
          {error || "記事が見つかりません。"}
        </p>

        <div className="mt-8">
          <Link href="/articles">
            <Button variant="secondary">記事一覧へ戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

      {/* パンくず・ナビゲーション */}
      <div className="mb-10 flex items-center justify-between border-b border-[#dedbd3] pb-4">
        <Link
          href="/articles"
          className="text-xs tracking-wide text-[#89877e] transition-colors hover:text-[#9b8062]"
        >
          ← 記事一覧へ戻る
        </Link>

        {!authLoading && isAdmin && (
          <Link
            href={`/articles/edit?id=${encodeURIComponent(article.id)}`}
            className="border border-[#d9d1c5] px-4 py-2 text-xs text-[#68665e] transition-colors hover:border-[#9b8062] hover:text-[#9b8062]"
          >
            この記事を編集する
          </Link>
        )}
      </div>

      {/* 記事ヘッダー */}
      <header className="mb-12 border-b border-[#dedbd3] pb-10">

        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#9b8062]">
          Reading Journal
        </p>

        {/* ジャンル */}
        <div className="mb-5">
          <span className="border border-[#d9d1c5] px-3 py-1.5 text-xs text-[#8b7257]">
            {articleTypeLabels[article.articleType] ?? article.articleType}
          </span>
        </div>

        {/* タイトル */}
        <h1 className="font-serif text-3xl font-medium leading-relaxed tracking-wide text-[#292923] sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        {/* 著者・投稿日 */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-[#89877e]">
          <span>
            著者：{article.author}
          </span>

          <span>
            投稿日：{formatDate(article.createdAt)}
          </span>
        </div>
      </header>

      {/* 評価情報 */}
      <section className="mb-12 flex flex-wrap items-center justify-between gap-4 border-y border-[#e5e1d9] py-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#a49a8c]">
            Review Score
          </p>

          <div className="mt-2 flex items-center gap-3">
            <span className="font-serif text-2xl text-[#292923]">
              {article.reviewScore}
              <span className="text-sm text-[#89877e]"> / 5</span>
            </span>

            <span className="tracking-wider text-[#a8875c]">
              {"★".repeat(Number(article.reviewScore))}
              {"☆".repeat(5 - Number(article.reviewScore))}
            </span>
          </div>
        </div>

        <div className="text-right text-xs leading-6 text-[#89877e]">
          <p>最終更新日</p>
          <p>{formatDate(article.updatedAt)}</p>
        </div>
      </section>

      {/* 記事本文 */}
      <section className="mb-16">

        <div className="mb-8 flex items-center gap-4">
          <h2 className="font-serif text-xl tracking-wide text-[#292923]">
            Article
          </h2>

          <div className="h-px flex-1 bg-[#dedbd3]" />

          <span className="text-[10px] tracking-[0.2em] text-[#a49a8c]">
            CONTENT
          </span>
        </div>

        <div
          className="
            article-content
            [&_p]:mb-4
            [&_strong]:font-bold
            [&_em]:italic
            [&_u]:underline
            [&_ul]:list-disc
            [&_ul]:pl-6
            [&_ol]:list-decimal
            [&_ol]:pl-6
            [&_h2]:mb-3
            [&_h2]:mt-6
            [&_h2]:text-xl
            [&_h2]:font-bold
          "
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </section>

      {/* 記事フッター */}
      <footer className="border-t border-[#dedbd3] pt-8">

        <div className="text-center">
          <p className="font-serif text-sm tracking-[0.2em] text-[#a49a8c]">
            READ · THINK · RECORD
          </p>

          <p className="mt-3 text-xs text-[#89877e]">
            読書から得た気づきを、記録として残す。
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/articles">
            <Button variant="secondary">
              記事一覧へ戻る
            </Button>
          </Link>
        </div>
      </footer>
    </article>
  );
}
