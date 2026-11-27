// 新しいIDを生成
export function generateId(): string {
  return crypto.randomUUID();
}

// 現在の日時をISO文字列で取得
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// 日時を表示用にフォーマット
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 日時を入力フォーム用にフォーマット
export function formatDateTimeForInput(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}