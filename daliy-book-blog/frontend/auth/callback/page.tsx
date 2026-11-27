
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hub } from "aws-amplify/utils";
import { useAuth } from "@/app/components/auth/AuthProvider";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();

  const [message, setMessage] = useState(
    "ログイン処理を実行しています..."
  );

  useEffect(() => {
    const stopListening = Hub.listen("auth", async ({ payload }) => {
      if (payload.event === "signInWithRedirect") {
        setMessage("ログインに成功しました。");

        await refreshAuth();

        router.replace("/");
      }

      if (payload.event === "signInWithRedirect_failure") {
        setMessage(
          "ログインに失敗しました。もう一度お試しください。"
        );
      }
    });

    return () => {
      stopListening();
    };
  }, [refreshAuth, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-bold">
          Cognito認証
        </h1>

        <p className="mt-4 text-gray-600">
          {message}
        </p>
      </div>
    </div>
  );
}
