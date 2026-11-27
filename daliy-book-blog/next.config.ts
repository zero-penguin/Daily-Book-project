import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //静的HTML/CSS/JSを出力するための設定
  output: 'export',

  //全てindex.htmlにする
  trailingSlash: true,

  // 静的エクスポートでは無効化
  cacheComponents: false,
  partialPrefetching: false,

  reactCompiler: true,

  images: {
    unoptimized: true,
  },

  experimental: {
    agentFeedback: true,
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
