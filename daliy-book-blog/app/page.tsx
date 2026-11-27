
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Article } from "./lib/types";
import { getBooks, getArticles, getRecentArticles } from "./lib/data";

const genreLabels: Record<string, string> = {
  GeneralWorks: "総記",
  Philosophy: "哲学・心理学",
  History: "歴史・地理",
  SocialSciences: "社会科学",
  NaturalSciences: "自然科学",
  Technology: "技術・工学",
  Arts: "芸術・スポーツ",
  Language: "言語",
  Literature: "文学",
  Business_Self_Help: "ビジネス・自己啓発",
  Magazines: "雑誌",
  Comics: "マンガ・コミック",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getExcerpt(content: string) {
  return content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 110);
}

export default function Home() {
  const [stats, setStats] = useState({
    books: 0,
    articles: 0,
  });

  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [articles, books, allArticles] = await Promise.all([
          getRecentArticles(),
          getBooks(),
          getArticles(),
        ]);

        setLatestArticles(articles.slice(0, 5));

        setStats({
          books: books.length,
          articles: allArticles.length,
        });
      } catch (error) {
        console.error("ホーム画面のデータ取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-page">
      <div className="site-container">

        {/* Hero */}
        <section className="hero-section">
          <p className="eyebrow">
            A JOURNAL OF BOOKS & IDEAS
          </p>

          <h1 className="hero-title">
            本を読み、考え、
            <br />
            <span>日々を記録する。</span>
          </h1>

          <p className="hero-description">
            読書を通じて得た気づきや、日々の学び。
            <br className="desktop-break" />
            自分の考えを言葉にして残す、小さな記録の場所。
          </p>
        </section>

        {/* Latest Articles */}
        <section className="latest-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LATEST JOURNAL</p>
              <h2 className="section-title">Latest Articles</h2>
            </div>

            <Link href="/articles" className="text-link">
              すべての記事を見る →
            </Link>
          </div>

          {isLoading ? (
            <p className="empty-message">記事を読み込んでいます...</p>
          ) : latestArticles.length > 0 ? (
            <div className="article-list">
              {latestArticles.map((article, index) => (
                <Link
                  href={`/articles/detail?id=${encodeURIComponent(article.id)}`}
                  key={article.id}
                  className="article-card"
                >
                  <div className="article-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="article-main">
                    <div className="article-meta">
                      <time dateTime={article.createdAt}>
                        {formatDate(article.createdAt)}
                      </time>
                      <span className="meta-divider">/</span>
                      <span>
                        {genreLabels[article.articleType] ??
                          article.articleType}
                      </span>
                    </div>

                    <h3 className="article-title">
                      {article.title}
                    </h3>

                    <p className="article-excerpt">
                      {getExcerpt(article.content)}
                      {article.content.length > 110 ? "..." : ""}
                    </p>
                  </div>

                  <div className="article-arrow">↗</div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="empty-message">
              まだ記事がありません。
            </p>
          )}
        </section>

        {/* Reading Statistics */}
        <section className="statistics-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MY COLLECTION</p>
              <h2 className="section-title">Reading Records</h2>
            </div>
          </div>

          <div className="statistics-grid">
            <Link href="/books" className="stat-card">
              <span className="stat-label">BOOKS READ</span>
              <span className="stat-number">{stats.books}</span>
              <span className="stat-description">
                読んだ本の数
              </span>
            </Link>

            <Link href="/articles" className="stat-card">
              <span className="stat-label">ARTICLES</span>
              <span className="stat-number">{stats.articles}</span>
              <span className="stat-description">
                書き残した記事の数
              </span>
            </Link>
          </div>
        </section>

        {/* Footer Message */}
        <section className="closing-section">
          <p className="closing-text">
            Every book leaves something behind.
          </p>
        </section>

      </div>
    </div>
  );
}
