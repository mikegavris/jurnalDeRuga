"use client"

type ImageUploaderProps = {
  onUpload: (url: string) => void
  disabled?: boolean
}

export default function ImageUploader({ onUpload, disabled }: ImageUploaderProps) {
  function openWidget() {
    if (disabled) return

    // @ts-ignore
    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        multiple: false
      },
      (err: any, result: any) => {
        if (!err && result.event === "success") {
          onUpload(result.info.secure_url)
        }
      }
    )
  }

  return (
    <button
      type="button"
      onClick={openWidget}
      disabled={disabled}
      className={`w-24 h-24 border-2 border-dashed rounded flex items-center justify-center
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}
      `}
    >
      + Poză
    </button>
  )
}
