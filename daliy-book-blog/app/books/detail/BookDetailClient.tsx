
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import type { Book } from "../../lib/types";
import { getBook } from "../../lib/data";
import { Button } from "@/app/components/ui";
import { formatDate } from "../../lib/utils";
import { useAuth } from "@/app/components/auth/AuthProvider";

export default function BookDetailClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isAdmin, isLoading: authLoading } = useAuth();

  // 書籍情報を取得する
  useEffect(() => {
    if (!id) {
      setError("書籍IDが指定されていません。");
      setLoading(false);
      return;
    }

    const fetchBook = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getBook(id);

        if (!data) {
          setError("書籍が見つかりません。");
          return;
        }

        setBook(data);
      } catch (error) {
        console.error("書籍の取得に失敗しました:", error);
        setError("書籍の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const bookTypeLabels: Record<Book["bookType"], string> = {
    GeneralWorks: "総記",
    Philosophy: "哲学・宗教",
    History: "歴史",
    SocialSciences: "社会科学",
    NaturalSciences: "自然科学",
    Technology: "技術・工学",
    Arts: "芸術",
    Language: "言語",
    Literature: "文学",
    Business_Self_Help: "ビジネス・自己啓発",
    Magazines: "雑誌",
    Comics: "漫画",
  };

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-[#faf9f6] px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm tracking-[0.2em] text-[#9b8062]">
            BOOK DETAIL
          </p>
          <p className="mt-5 text-sm text-[#77766e]">
            書籍情報を読み込んでいます...
          </p>
        </div>
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="min-h-[60vh] bg-[#faf9f6] px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.25em] text-[#9b8062]">
            BOOK DETAIL
          </p>
          <h1 className="mt-5 font-serif text-3xl text-[#292923]">
            書籍が見つかりません
          </h1>
          <p className="mt-4 text-sm text-[#77766e]">
            {error || "本が見つかりません。"}
          </p>
          <div className="mt-8">
            <Link href="/books">
              <Button variant="secondary">書籍一覧へ戻る</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#292923]">
      {/* ページヘッダー */}
      <section className="border-b border-[#e8e5de]">
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] tracking-[0.3em] text-[#9b8062]">
                MY BOOKSHELF
              </p>
              <p className="mt-2 text-xs text-[#77766e]">
                BOOK DETAIL
              </p>
            </div>

            {!authLoading && isAdmin && (
              <Link
                href={`/books/edit?id=${encodeURIComponent(book.id)}`}
              >
                <Button>編集する</Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 書籍メイン情報 */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          {/* 表紙画像 */}
          <div className="mx-auto w-full max-w-[340px]">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#eeece6] shadow-[0_18px_45px_rgba(41,41,35,0.10)]">
              {book.imageUrl ? (
                <Image
                  src={book.imageUrl}
                  alt={`${book.title}の表紙`}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 80vw, 340px"
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <span className="text-xs tracking-[0.3em] text-[#9b8062]">
                    NO COVER
                  </span>
                  <p className="mt-5 font-serif text-xl text-[#77766e]">
                    {book.title}
                  </p>
                </div>
              )}
            </div>

            <p className="mt-5 text-center text-[10px] tracking-[0.2em] text-[#aaa69c]">
              BOOK COVER
            </p>
          </div>

          {/* 書籍情報 */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="border border-[#d8cbbb] px-3 py-1 text-[11px] tracking-wider text-[#8d7359]">
                {bookTypeLabels[book.bookType] ?? "その他"}
              </span>
              <span className="text-[11px] tracking-[0.15em] text-[#aaa69c]">
                BOOK COLLECTION
              </span>
            </div>

            <h1 className="mt-7 font-serif text-3xl leading-[1.5] tracking-wide text-[#292923] md:text-5xl md:leading-[1.4]">
              {book.title}
            </h1>

            {book.author && (
              <p className="mt-6 text-sm tracking-wide text-[#77766e]">
                著者：{book.author}
              </p>
            )}

            <div className="my-10 h-px w-full bg-[#dedbd3]" />

            <div className="space-y-7">
              <div>
                <p className="text-[10px] tracking-[0.25em] text-[#9b8062]">
                  CATEGORY
                </p>
                <p className="mt-2 text-sm text-[#44443d]">
                  {bookTypeLabels[book.bookType] ?? "その他"}
                </p>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.25em] text-[#9b8062]">
                  REGISTERED
                </p>
                <p className="mt-2 text-sm text-[#44443d]">
                  {formatDate(book.createdAt)}
                </p>
              </div>

              {book.url && (
                <div>
                  <p className="text-[10px] tracking-[0.25em] text-[#9b8062]">
                    EXTERNAL LINK
                  </p>
                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block break-all text-sm text-[#8d7359] underline decoration-[#c9b9a6] underline-offset-4 transition-colors hover:text-[#292923]"
                  >
                    書籍の詳細を見る
                  </a>
                </div>
              )}
            </div>

            <div className="mt-12 border-t border-[#dedbd3] pt-6">
              <p className="text-[10px] tracking-[0.25em] text-[#aaa69c]">
                MY READING COLLECTION
              </p>
              <p className="mt-3 text-sm leading-8 text-[#77766e]">
                読んだ本の記録を残し、日々の読書を振り返るためのコレクションです。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 読書記事 */}
      <section className="border-t border-[#e8e5de] bg-[#f5f3ee]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.3em] text-[#9b8062]">
              READING JOURNAL
            </p>
            <h2 className="mt-3 font-serif text-3xl text-[#292923]">
              Reading Notes
            </h2>
            <p className="mt-3 text-sm text-[#77766e]">
              この本について書いた読書記事
            </p>
          </div>

          <div className="border-y border-[#dedbd3] py-12 text-center">
            <p className="font-serif text-xl text-[#77766e]">
              No articles yet
            </p>
            <p className="mt-3 text-sm text-[#99968d]">
              本に対する読書記事を作成すると、ここに表示されます。
            </p>
          </div>
        </div>
      </section>

      {/* 戻るリンク */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <Link
          href="/books"
          className="inline-flex items-center gap-3 text-xs tracking-wider text-[#8d7359] transition-colors hover:text-[#292923]"
        >
          <span aria-hidden="true">←</span>
          BACK TO BOOKSHELF
        </Link>
      </section>
    </main>
  );
}
