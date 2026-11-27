
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/layout/Header";
import { AuthProvider } from "@/app/components/auth/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://daily-book.com"),

  title: {
    default: "Daily Book | 読書と日々の記録",
    template: "%s | Daily Book",
  },

  description:
    "日々の読書や学びから生まれた、小さな気づきを綴るブログです。読んだ本の感想や書評、読書記録を通して、本との出会いを記録します。",

  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },

  openGraph: {
    title: "Daily Book | ５分読書の時間ラジオ",
    description:
      "日々の読書や学びから生まれた、小さな気づきを綴るブログです。",
    url: "https://daily-book.com",
    siteName: "Daily Book",
    locale: "ja_JP",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="site-footer">
            <div className="site-container">
              <p className="footer-logo">Daily Book.</p>
              <p className="footer-copy">
                READ · THINK · RECORD
              </p>
              <p className="footer-copyright">
                © {new Date().getFullYear()} Daily Book
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
