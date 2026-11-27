
"use client";

// Linkコンポーネントをインポート
import Link from "next/link";
// usePathnameフックをインポート
import { usePathname } from "next/navigation";
import { Suspense } from "react";

// 認証状態を取得するuseAuthをインポート
import { useAuth } from "@/app/components/auth/AuthProvider";

// 一般訪問者向けナビゲーションアイテム
const navItems = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "読書記事" },
  { href: "/books", label: "読んだ本一覧" },
];

// 管理者向けナビゲーションアイテム
const adminNavItems = [
  { href: "/articles/new", label: "記事登録" },
  { href: "/books/new", label: "書籍登録" },
];

// Sidebarコンポーネントを定義
function ChildSidebar() {
  // 現在のパス名を取得
  const pathname = usePathname();

  // 認証状態を取得
  const { isAdmin, isLoading } = useAuth();

  // 一般向けと管理者向けのメニューを結合
  const displayNavItems = isAdmin
    ? [...navItems, ...adminNavItems]
    : navItems;

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {displayNavItems.map((item) => {
            // 現在のパス名とhrefを比較してアクティブ状態を判定
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded ${
                    isActive
                      ? "bg-blue-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {!isLoading && isAdmin && (
          <div className="mt-6 border-t border-gray-600 pt-4">
            <p className="px-4 mb-2 text-sm text-gray-400">
              管理者メニュー
            </p>
          </div>
        )}
      </nav>
    </aside>
  );
}

// Sidebarコンポーネントをエクスポート
export default function Sidebar() {
  return (
    <Suspense
      fallback={
        <div className="w-64 bg-gray-800 min-h-screen" />
      }
    >
      <ChildSidebar />
    </Suspense>
  );
}
