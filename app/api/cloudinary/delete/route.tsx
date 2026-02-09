import { NextResponse } from "next/server"
import cloudinary from "cloudinary"

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json(
        { error: "Missing image URL" },
        { status: 400 }
      )
    }

    // extrage public_id din URL
    // https://res.cloudinary.com/xxx/image/upload/v123/journal/abc.jpg
    const filename = url.split("/").pop()
    const publicId = filename?.split(".")[0]

    if (!publicId) {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      )
    }

    await cloudinary.v2.uploader.destroy(`journal/${publicId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    )
  }
}
