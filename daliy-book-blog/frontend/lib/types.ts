// 本
export type Book = {
  // 本ID
  id: string;
  // 本のタイトル
  title: string;
  // 著者
  author: string;
  // 本のジャンル
  bookType:
    | "GeneralWorks"
    | "Philosophy"
    | "History"
    | "SocialSciences"
    | "NaturalSciences"
    | "Technology"
    | "Arts"
    | "Language"
    | "Literature"
    | "Business_Self_Help"
    | "Magazines"
    | "Comics";
  // 本のURL
  url?: string;
  // 本の表紙画像URL
  imageUrl?: string;
  // 作成日時
  createdAt: string;
  // 更新日時
  updatedAt: string;
};

// 読書記事
export type Article = {
  // 記事ID
  id: string;
  // // 本のID
  // bookId: string;
  // 記事タイトル
  title: string;
  // 記事ジャンル（総記、哲学・心理学、歴史・地理、社会科学、自然科学、技術・工学、芸術・スポーツ、言語、文学、ビジネス・自己啓発、雑誌、マンガ・コミック）
  articleType: "GeneralWorks" | "Philosophy" | "History" | "SocialSciences" | "NaturalSciences" | "Technology" | "Arts" | "Language" | "Literature" | "Business_Self_Help" | "Magazines" | "Comics";
  // 記事の内容
  content: string;
  // 記事の著者 
  author: string;
  // 本の評価
  reviewScore: "5" | "4" | "3" | "2" | "1";
  // 記事の作成日時
  createdAt: string;
  // 記事の更新日時
  updatedAt: string;
};

// ラジオ情報
export type Radio = {
  // ラジオID  
  id: string;
  // 記事ID
  articleId: string;
  // ラジオタイトル
  name: string;
  // ラジオのジャンル
  radioType: "GeneralWorks" | "Philosophy" | "History" | "SocialSciences" | "NaturalSciences" | "Technology" | "Arts" | "Language" | "Literature" | "Business / Self-Help" | "Magazines" | "Comics";
  // ラジオURL
  URL: string;
  // ラジオの作成日時
  createdAt: string;
  // ラジオの更新日時
  updatedAt: string;
};

// ステータステーブル
export type statusTable = {
  // ステータステーブルID
  id: string;
  // 記事ID
  articleId: string;
  // ステータス（scheduled: 予定、finished: 完了）
  status: "scheduled" | "finished";
  createdAt: string;
  updatedAt: string;
};

// ジャンルの１行
export type genreRow = {
  // ジャンルID
  id: string;
  // ジャンル名
  name: string;
  // このジャンルに属する本の数
  bookCount: number;
  //このジャンルに属する記事の評価の平均値
  averageReviewScore: number;
  // ジャンルの説明
  description: string;
  // 
};
