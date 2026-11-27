
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Article } from "../lib/types";
import { getArticles, deleteArticle } from "../lib/data";
import { Button } from "@/app/components/ui";
import { formatDate } from "../lib/utils";
import { useAuth } from "@/app/components/auth/AuthProvider";

const articleTypes: Record<string, string> = {
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

export default function ArticlePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const { isAdmin, isLoading } = useAuth();

  // 記事一覧を取得
  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (error) {
      console.error("記事一覧の取得に失敗しました:", error);
      alert("記事一覧の取得に失敗しました。");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // 記事を削除
  const handleDelete = async (id: string) => {
    if (isLoading || !isAdmin) {
      alert("管理者のみ削除できます。");
      return;
    }

    if (!confirm("この記事を削除しますか？")) return;

    try {
      await deleteArticle(id);
      await fetchArticles();
    } catch (error) {
      console.error("記事の削除に失敗しました:", error);
      alert("記事の削除に失敗しました。");
    }
  };

  // 記事本文の抜粋
  const getExcerpt = (content: string) => {
    return content
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

      {/* ページヘッダー */}
      <section className="mb-12 border-b border-[#dedbd3] pb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#9b8062]">
          Reading Journal
        </p>

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-serif text-4xl font-medium tracking-wide text-[#292923] sm:text-5xl">
              Articles
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#77766e]">
              読んだ本の記録と、そこから得た気づきを残す、小さな場所。
            </p>
          </div>

          {!isLoading && isAdmin && (
            <Link href="/articles/new">
              <Button>記事を作成する</Button>
            </Link>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3 text-sm text-[#77766e]">
          <span>記事アーカイブ</span>
          <span className="h-px w-8 bg-[#c9b9a5]" />
          <span>{articles.length} Articles</span>
        </div>
      </section>

      {/* 記事一覧 */}
      <section>
        {isFetching ? (
          <p className="py-16 text-center text-sm text-[#89877e]">
            記事を読み込んでいます...
          </p>
        ) : articles.length > 0 ? (
          <div className="divide-y divide-[#e5e1d9]">
            {articles.map((article, index) => (
              <article
                key={article.id}
                className="group py-8 first:pt-0 last:pb-0"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:gap-8">

                  {/* 記事番号 */}
                  <div className="hidden pt-1 sm:block">
                    <span className="font-serif text-2xl text-[#c2b5a4]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* 記事情報 */}
                  <div className="min-w-0 flex-1">

                    {/* ジャンル・投稿日 */}
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs tracking-wide text-[#89877e]">
                      <span className="border border-[#d9d1c5] px-3 py-1 text-[#8b7257]">
                        {articleTypes[article.articleType] ?? article.articleType}
                      </span>

                      <span>{formatDate(article.createdAt)}</span>
                    </div>

                    {/* タイトル */}
                    <Link
                      href={`/articles/detail?id=${encodeURIComponent(article.id)}`}
                      className="inline-block"
                    >
                      <h2 className="font-serif text-xl font-medium leading-relaxed text-[#292923] transition-colors group-hover:text-[#9b8062] sm:text-2xl">
                        {article.title}
                      </h2>
                    </Link>

                    {/* 本文抜粋 */}
                    <p className="mt-3 text-sm leading-7 text-[#77766e]">
                      {getExcerpt(article.content)}
                      {article.content.length > 120 && "..."}
                    </p>

                    {/* 著者・評価 */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#89877e]">
                      <span>著者：{article.author}</span>
                      <span>
                        評価：
                        <span className="ml-1 tracking-wider text-[#a8875c]">
                          {"★".repeat(Number(article.reviewScore))}
                          {"☆".repeat(5 - Number(article.reviewScore))}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* 操作ボタン */}
                  <div className="flex shrink-0 items-center gap-2 sm:pt-1">
                    <Link
                      href={`/articles/detail?id=${encodeURIComponent(article.id)}`}
                      className="border border-[#d9d1c5] px-4 py-2 text-xs text-[#68665e] transition-colors hover:border-[#9b8062] hover:text-[#9b8062]"
                    >
                      詳細を見る
                    </Link>

                    {!isLoading && isAdmin && (
                      <>
                        <Link
                          href={`/articles/edit?id=${encodeURIComponent(article.id)}`}
                          className="border border-[#d9d1c5] px-3 py-2 text-xs text-[#68665e] transition-colors hover:border-[#9b8062] hover:text-[#9b8062]"
                        >
                          編集
                        </Link>

                        <button
                          onClick={() => handleDelete(article.id)}
                          className="border border-[#e2d2ce] px-3 py-2 text-xs text-[#a16d63] transition-colors hover:bg-[#f6eeeb]"
                        >
                          削除
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border-y border-[#e5e1d9] py-20 text-center">
            <p className="font-serif text-2xl text-[#292923]">
              No Articles Yet
            </p>
            <p className="mt-3 text-sm text-[#89877e]">
              まだ記事がありません。
            </p>

            {!isLoading && isAdmin && (
              <div className="mt-6">
                <Link href="/articles/new">
                  <Button>最初の記事を作成する</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ページ下部 */}
      <footer className="mt-16 border-t border-[#dedbd3] pt-6 text-center">
        <p className="font-serif text-sm tracking-widest text-[#a49a8c]">
          THANK YOU FOR READING！！
        </p>
      </footer>
    </div>
  );
}
