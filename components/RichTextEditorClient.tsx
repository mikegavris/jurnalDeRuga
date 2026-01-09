"use client"

import dynamic from "next/dynamic"

const RichTextEditor = dynamic(
  () => import("./ui/RichTextEditor"),
  { ssr: false }
)

export default RichTextEditor
