
"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { TextStyle } from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";

type ContentEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ContentEditor({
  value,
  onChange,
}: ContentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] px-4 py-3 outline-none prose max-w-none focus:outline-none",
      },
    },
  });

  // 外部からvalueが変更された場合にエディタへ反映
  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();

    if (currentContent !== value) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const buttonClass = (active: boolean) =>
    `rounded px-3 py-2 text-sm transition ${
      active
        ? "bg-gray-800 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
      {/* ツールバー */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 p-3">
        <button
          type="button"
          className={buttonClass(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="太字"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="斜体"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("underline"))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="下線"
        >
          <span className="underline">U</span>
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("strike"))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="取り消し線"
        >
          <span className="line-through">S</span>
        </button>

        <div className="mx-1 h-6 border-l border-gray-300" />

        <button
          type="button"
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="見出し"
        >
          H2
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="箇条書き"
        >
          • List
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="番号付きリスト"
        >
          1. List
        </button>

        <div className="mx-1 h-6 border-l border-gray-300" />

        <label className="flex cursor-pointer items-center gap-2 rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200">
          文字色
          <input
            type="color"
            className="h-5 w-6 cursor-pointer"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            title="文字色を変更"
          />
        </label>

        <button
          type="button"
          className={buttonClass(false)}
          onClick={() =>
            editor.chain().focus().unsetColor().run()
          }
          title="文字色を解除"
        >
          色を解除
        </button>
      </div>

      {/* 本文入力欄 */}
      <EditorContent editor={editor} />
    </div>
  );
}
