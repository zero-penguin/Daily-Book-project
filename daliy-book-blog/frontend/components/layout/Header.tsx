
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/articles", label: "ARTICLES" },
  { href: "/books", label: "BOOKS" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, isAdmin, isLoading, login, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href="/" className="site-logo">
          Daily Book.
        </Link>

        <nav className="header-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <Link href="/articles/new" className="nav-link">
                WRITE
              </Link>
              <Link href="/books/new" className="nav-link">
                ADD BOOK
              </Link>
            </>
          )}
        </nav>

        <div className="header-auth">
          {isLoading ? (
            <span className="auth-label">確認中...</span>
          ) : user ? (
            <button onClick={logout} className="auth-button">
              LOG OUT
            </button>
          ) : (
            <button onClick={login} className="auth-button">
              LOG IN
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
