
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type ImageDropzoneProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  currentImageUrl?: string;
};

export default function ImageDropzone({
  file,
  onFileChange,
  currentImageUrl,
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // ========================================
  // 画像プレビューURLの生成・解放
  // ========================================
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // ========================================
  // 画像ファイルの検証・設定
  // ========================================
  const handleFile = (selectedFile?: File | null) => {
    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("JPEG、PNG、WebP形式の画像を選択してください。");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("画像サイズは5MB以下にしてください。");
      return;
    }

    onFileChange(selectedFile);
  };

  // ========================================
  // クリップボードから画像を貼り付け
  // ========================================
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;

      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const pastedFile = item.getAsFile();

          if (pastedFile) {
            handleFile(pastedFile);
            e.preventDefault();
            return;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  // ========================================
  // ドラッグ＆ドロップ
  // ========================================
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    handleFile(e.dataTransfer.files?.[0]);
  };

  // ========================================
  // ファイル選択
  // ========================================
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFile(e.target.files?.[0]);

    // 同じ画像を再選択できるようにする
    e.target.value = "";
  };

  // ========================================
  // 選択画像の取り消し
  // ========================================
  const handleRemoveSelection = () => {
    onFileChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="mt-4">
      <label className="block font-medium mb-2">
        表紙画像（5MB以下・JPEG/PNG/WebP）
      </label>

      {/* ドラッグ＆ドロップエリア */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          if (
            !e.currentTarget.contains(
              e.relatedTarget as Node
            )
          ) {
            setIsDragging(false);
          }
        }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center
          min-h-40 p-6 rounded-lg border-2 border-dashed
          cursor-pointer transition-colors
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
          }
        `}
      >
        <p className="font-medium text-gray-700">
          画像をドラッグ＆ドロップ
        </p>

        <p className="text-sm text-gray-500 mt-1">
          またはクリックして画像を選択
        </p>

        <p className="text-sm text-blue-600 mt-2">
          コピーした画像を Command + V で貼り付け
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* 画像プレビュー */}
      {(previewUrl || currentImageUrl) && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">
            {file ? "選択した画像" : "現在の表紙画像"}
          </p>

          <Image
            src={previewUrl || currentImageUrl!}
            alt="表紙画像プレビュー"
            width={160}
            height={224}
            unoptimized={!!previewUrl}
            className="w-40 h-56 object-contain border rounded"
          />

          {file && (
            <button
              type="button"
              onClick={handleRemoveSelection}
              className="block mt-2 text-sm text-red-600 hover:underline"
            >
              選択した画像を取り消す
            </button>
          )}
        </div>
      )}
    </div>
  );
}
