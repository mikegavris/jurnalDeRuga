"use client"

import { useEditor, EditorContent, Extension } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import FontFamily from "@tiptap/extension-font-family"
import { useEffect, useRef } from "react"

// Custom font size extension
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {}
              return { style: `font-size: ${attributes.fontSize}` }
            },
          },
        },
      },
    ]
  },
})

type Props = {
  content: string
  onChange: (html: string) => void
  onImageUpload?: (callback: (url: string) => void) => void
}

const fonts = [
  { label: "Arial", value: "Arial" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Georgia", value: "Georgia" },
  { label: "Verdana", value: "Verdana" },
  { label: "Courier New", value: "Courier New" },
  { label: "Trebuchet MS", value: "Trebuchet MS" },
  { label: "Comic Sans MS", value: "Comic Sans MS" },
]

const fontSizes = ["10px", "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px"]

export default function RichTextEditor({ content, onChange, onImageUpload }: Props) {
  const colorRef = useRef<HTMLInputElement>(null)
  const highlightRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
        },
      }),
      TextAlign.configure({
        types: ["paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  function setFontSize(size: string) {
    editor?.chain().focus().setMark("textStyle", { fontSize: size }).run()
  }

  function addImage() {
    if (onImageUpload) {
      onImageUpload((url) => {
        editor?.chain().focus().setImage({ src: url }).run()
      })
    }
  }

  const btnBase = "w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center text-xs sm:text-sm"

  return (
    <div className="border rounded overflow-hidden">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 border-b bg-gray-50">

        {/* Font Family */}
        <select
          onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="border rounded px-1 py-0.5 text-xs sm:text-sm bg-white h-7 sm:h-8 max-w-[90px] sm:max-w-none"
          defaultValue=""
        >
          <option value="" disabled>Font</option>
          {fonts.map(f => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>

        {/* Font Size */}
        <select
          onChange={e => setFontSize(e.target.value)}
          className="border rounded px-1 py-0.5 text-xs sm:text-sm bg-white h-7 sm:h-8 w-14 sm:w-16"
          defaultValue=""
        >
          <option value="" disabled>Mărime</option>
          {fontSizes.map(s => (
            <option key={s} value={s}>{parseInt(s)}</option>
          ))}
        </select>

        <div className="w-px h-5 sm:h-6 bg-gray-300 mx-0.5" />

        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btnBase} font-bold ${
            editor.isActive("bold") ? "bg-blue-500 text-white" : "hover:bg-gray-200"
          }`}
          title="Bold"
        >
          B
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btnBase} italic ${
            editor.isActive("italic") ? "bg-blue-500 text-white" : "hover:bg-gray-200"
          }`}
          title="Italic"
        >
          I
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${btnBase} underline ${
            editor.isActive("underline") ? "bg-blue-500 text-white" : "hover:bg-gray-200"
          }`}
          title="Subliniere"
        >
          U
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${btnBase} line-through ${
            editor.isActive("strike") ? "bg-blue-500 text-white" : "hover:bg-gray-200"
          }`}
          title="Tăiere"
        >
          S
        </button>

        <div className="w-px h-5 sm:h-6 bg-gray-300 mx-0.5" />

        {/* Text Color */}
        <div className="relative">
          <button
            type="button"
            onClick={() => colorRef.current?.click()}
            className={`${btnBase} hover:bg-gray-200`}
            title="Culoare text"
          >
            <span className="font-bold" style={{ color: editor.getAttributes("textStyle").color || "#000" }}>A</span>
          </button>
          <input
            ref={colorRef}
            type="color"
            className="absolute opacity-0 w-0 h-0"
            onChange={e => editor.chain().focus().setColor(e.target.value).run()}
          />
        </div>

        {/* Highlight Color */}
        <div className="relative">
          <button
            type="button"
            onClick={() => highlightRef.current?.click()}
            className={`${btnBase} hover:bg-gray-200`}
            title="Evidențiere"
          >
            <span className="font-bold px-0.5 bg-yellow-300 rounded text-xs">A</span>
          </button>
          <input
            ref={highlightRef}
            type="color"
            defaultValue="#ffff00"
            className="absolute opacity-0 w-0 h-0"
            onChange={e => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
          />
        </div>

        <div className="w-px h-5 sm:h-6 bg-gray-300 mx-0.5" />

        {/* Align Left */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`${btnBase} hover:bg-gray-200 ${
            editor.isActive({ textAlign: "left" }) ? "bg-blue-500 text-white" : ""
          }`}
          title="Aliniere stânga"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="3" width="12" height="1.5" />
            <rect x="2" y="6.5" width="8" height="1.5" />
            <rect x="2" y="10" width="12" height="1.5" />
          </svg>
        </button>

        {/* Align Center */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`${btnBase} hover:bg-gray-200 ${
            editor.isActive({ textAlign: "center" }) ? "bg-blue-500 text-white" : ""
          }`}
          title="Aliniere centru"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="3" width="12" height="1.5" />
            <rect x="4" y="6.5" width="8" height="1.5" />
            <rect x="2" y="10" width="12" height="1.5" />
          </svg>
        </button>

        {/* Align Right */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`${btnBase} hover:bg-gray-200 ${
            editor.isActive({ textAlign: "right" }) ? "bg-blue-500 text-white" : ""
          }`}
          title="Aliniere dreapta"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="3" width="12" height="1.5" />
            <rect x="6" y="6.5" width="8" height="1.5" />
            <rect x="2" y="10" width="12" height="1.5" />
          </svg>
        </button>

        {/* Justify */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`${btnBase} hover:bg-gray-200 ${
            editor.isActive({ textAlign: "justify" }) ? "bg-blue-500 text-white" : ""
          }`}
          title="Aliniere justify"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="3" width="12" height="1.5" />
            <rect x="2" y="6.5" width="12" height="1.5" />
            <rect x="2" y="10" width="12" height="1.5" />
          </svg>
        </button>

        <div className="w-px h-5 sm:h-6 bg-gray-300 mx-0.5" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${btnBase} hover:bg-gray-200 ${
            editor.isActive("bulletList") ? "bg-blue-500 text-white" : ""
          }`}
          title="Listă cu buline"
        >
          •≡
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${btnBase} hover:bg-gray-200 ${
            editor.isActive("orderedList") ? "bg-blue-500 text-white" : ""
          }`}
          title="Listă numerotată"
        >
          1.≡
        </button>

        <div className="w-px h-5 sm:h-6 bg-gray-300 mx-0.5" />

        {/* Image via Cloudinary */}
        <button
          type="button"
          onClick={addImage}
          className={`${btnBase} hover:bg-gray-200`}
          title="Adaugă imagine"
        >
          🖼
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="p-2 sm:p-3 min-h-[120px] sm:min-h-[150px] prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px] sm:[&_.ProseMirror]:min-h-[120px] [&_img]:max-w-full [&_img]:h-auto"
      />
    </div>
  )
}