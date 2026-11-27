
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Book } from "../lib/types";
import { getBooks, deleteBook } from "../lib/data";
import { Button } from "@/app/components/ui";
import { formatDate } from "../lib/utils";
import { useAuth } from "@/app/components/auth/AuthProvider";

const bookTypes: Record<string, string> = {
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

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const { isAdmin, isLoading } = useAuth();

  // 書籍一覧を取得
  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error("書籍一覧の取得に失敗しました:", error);
      alert("書籍一覧の取得に失敗しました。");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 書籍を削除
  const handleDelete = async (id: string) => {
    if (isLoading || !isAdmin) {
      alert("管理者のみ削除できます。");
      return;
    }

    if (!confirm("この本を削除しますか？")) return;

    try {
      await deleteBook(id);
      await fetchBooks();
    } catch (error) {
      console.error("書籍の削除に失敗しました:", error);
      alert("書籍の削除に失敗しました。");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

      {/* ページヘッダー */}
      <section className="mb-12 border-b border-[#dedbd3] pb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#9b8062]">
          My Library
        </p>

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-serif text-4xl font-medium tracking-wide text-[#292923] sm:text-5xl">
              Books
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#77766e]">
              これまでに読んだ本と、その記録を集めた、小さな場所。
            </p>
          </div>

          {!isLoading && isAdmin && (
            <Link href="/books/new">
              <Button>本を登録する</Button>
            </Link>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3 text-sm text-[#77766e]">
          <span>読書ライブラリ</span>
          <span className="h-px w-8 bg-[#c9b9a5]" />
          <span>{books.length} Books</span>
        </div>
      </section>

      {/* 書籍一覧 */}
      <section>
        {isFetching ? (
          <p className="py-16 text-center text-sm text-[#89877e]">
            書籍を読み込んでいます...
          </p>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 sm:gap-x-7 lg:grid-cols-4 lg:gap-x-8">

            {books.map((book) => (
              <article key={book.id} className="group min-w-0">

                {/* 表紙画像 */}
                <Link
                  href={`/books/detail?id=${encodeURIComponent(book.id)}`}
                  className="relative mb-5 flex aspect-[3/4] items-center justify-center overflow-hidden bg-[#eeece6] p-5 transition-colors group-hover:bg-[#e8e4db]"
                >
                  {book.imageUrl ? (
                    <Image
                      src={book.imageUrl}
                      alt={`${book.title}の表紙`}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 220px"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center border border-[#d8d2c7] text-[#a49a8c]">
                      <span className="font-serif text-3xl">BOOK</span>
                      <span className="mt-2 text-[10px] tracking-[0.2em]">
                        NO COVER IMAGE
                      </span>
                    </div>
                  )}
                </Link>

                {/* 書籍情報 */}
                <div>
                  <p className="mb-2 text-[10px] tracking-[0.15em] text-[#9b8062]">
                    {bookTypes[book.bookType] ?? book.bookType}
                  </p>

                  <Link
                    href={`/books/detail?id=${encodeURIComponent(book.id)}`}
                  >
                    <h2 className="line-clamp-2 font-serif text-base font-medium leading-relaxed text-[#292923] transition-colors group-hover:text-[#9b8062] sm:text-lg">
                      {book.title}
                    </h2>
                  </Link>

                  <p className="mt-2 text-xs text-[#77766e]">
                    {book.author}
                  </p>

                  <p className="mt-3 text-[11px] text-[#a09c93]">
                    登録日：{formatDate(book.createdAt)}
                  </p>

                  {/* 管理者操作 */}
                  {!isLoading && isAdmin && (
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-[#e5e1d9] pt-3">
                      <Link
                        href={`/books/edit?id=${encodeURIComponent(book.id)}`}
                        className="border border-[#d9d1c5] px-3 py-1.5 text-xs text-[#68665e] transition-colors hover:border-[#9b8062] hover:text-[#9b8062]"
                      >
                        編集
                      </Link>

                      <button
                        onClick={() => handleDelete(book.id)}
                        className="border border-[#e2d2ce] px-3 py-1.5 text-xs text-[#a16d63] transition-colors hover:bg-[#f6eeeb]"
                      >
                        削除
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border-y border-[#e5e1d9] py-20 text-center">
            <p className="font-serif text-2xl text-[#292923]">
              Your Bookshelf Is Empty
            </p>
            <p className="mt-3 text-sm text-[#89877e]">
              まだ登録された本がありません。
            </p>

            {!isLoading && isAdmin && (
              <div className="mt-6">
                <Link href="/books/new">
                  <Button>最初の本を登録する</Button>
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
