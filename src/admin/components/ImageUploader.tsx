import React, { useState, useRef, useEffect } from 'react'
import { Upload, X, CheckCircle2, Loader2, ShieldCheck, Ruler } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { convertToWebP } from '../utils/imageOptimizer'

export interface StagedFile {
  blob: Blob
  previewUrl: string
  fileName: string
  contentType: string
}

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  onFileSelect?: (staged: StagedFile) => void
  folder?: string
  fileName?: string
  accept?: string
  label?: string
  invertPreview?: boolean
  aspectRatio?: '16/9' | '1/1' | 'auto'
  standardizeAspectRatio?: number // e.g. 16/9
  recommendedDimensions?: {
    width: number
    height: number
    label?: string
  }
}

export default function ImageUploader({
  value,
  onChange,
  onFileSelect,
  folder = 'uploads',
  fileName,
  accept = 'image/*, .png, .jpg, .jpeg, .webp, .avif, .gif, .bmp, .svg, .heic, .tiff',
  label = 'Upload Image',
  invertPreview = false,
  aspectRatio = 'auto',
  standardizeAspectRatio,
  recommendedDimensions,
}: ImageUploaderProps): React.JSX.Element {
  const [uploading, setUploading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Load natural dimensions of current image value
  useEffect(() => {
    if (!value || !accept.includes('image')) {
      setDimensions(null)
      return
    }
    const img = new Image()
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      setDimensions(null)
    }
    img.src = value
  }, [value, accept])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      // 1. Immediately convert image to WebP with optional aspect ratio standardization guard
      const { blob, fileName: optimizedName, contentType, width, height } = await convertToWebP(
        file,
        {
          quality: 0.88,
          standardizeAspectRatio,
          targetWidth: recommendedDimensions?.width || 1920,
          targetHeight: recommendedDimensions?.height || 1080,
        }
      )
      const finalFileName = fileName || `${Date.now()}_${optimizedName}`

      if (width && height) {
        setDimensions({ width, height })
      }

      if (onFileSelect) {
        // Deferred mode: preview locally and stage the WebP file; only uploads on "Save Changes"
        const previewUrl = URL.createObjectURL(blob)
        onFileSelect({
          blob,
          previewUrl,
          fileName: finalFileName,
          contentType,
        })
        onChange(previewUrl)
      } else {
        // Immediate mode: upload directly to Supabase Storage
        const storagePath = `${folder}/${finalFileName}`
        const { data, error: uploadError } = await supabase.storage
          .from('portfolio-media')
          .upload(storagePath, blob, {
            contentType,
            cacheControl: '31536000',
            upsert: true,
          })

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('portfolio-media')
          .getPublicUrl(data.path)

        onChange(publicUrlData.publicUrl)
      }
    } catch (err: any) {
      console.error('Upload processing failed:', err)
      setError(err.message || 'Failed to process image.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <label className="block text-xs font-semibold text-slate-300">{label}</label>}
        {recommendedDimensions && (
          <span className="text-[11px] font-mono text-slate-400">
            Standard: <strong className="text-slate-200">{recommendedDimensions.label || `${recommendedDimensions.width} × ${recommendedDimensions.height} px`}</strong>
          </span>
        )}
      </div>

      {value ? (
        <div className="space-y-2">
          <div
            className={`relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/90 flex items-center justify-center shadow-lg shadow-black/20 ${
              aspectRatio === '16/9'
                ? 'aspect-[16/9] w-full max-h-80 sm:max-h-96'
                : aspectRatio === '1/1'
                ? 'aspect-square w-32 h-32'
                : 'h-36 w-full'
            }`}
          >
            {accept.includes('image') ? (
              <img
                src={value}
                alt="Uploaded"
                className={`w-full h-full ${
                  invertPreview ? 'object-contain p-4 brightness-0 invert' : 'object-cover'
                }`}
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-slate-300 p-4">
                <CheckCircle2 className="text-emerald-400" size={22} />
                <span className="text-xs font-mono truncate max-w-xs text-slate-300">{value}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                onChange('')
                setDimensions(null)
              }}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/90 hover:bg-black text-white shadow-md transition-opacity"
              title="Remove Image"
            >
              <X size={14} />
            </button>
          </div>

          {/* Dimension Details */}
          {dimensions && (
            <div className="flex items-center gap-2 pt-0.5 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700/80 text-slate-300 flex items-center gap-1.5">
                <Ruler size={12} className="text-slate-400" />
                <span className="text-slate-400 font-sans">Size:</span>
                <span className="text-white font-semibold">{dimensions.width} × {dimensions.height} px</span>
              </span>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed border-slate-700 hover:border-slate-500 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-slate-800/40 hover:bg-slate-800/70 group ${
            aspectRatio === '16/9' ? 'aspect-[16/9] w-full max-h-64 p-6' : 'p-6'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={22} className="animate-spin text-slate-300" />
              <span className="text-xs text-slate-300 font-mono">
                Standardizing to 16:9 & optimizing WebP...
              </span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                <Upload size={18} />
              </div>
              <p className="text-xs font-semibold text-slate-200">Click to upload cover image</p>
              <div className="flex flex-col items-center gap-0.5 text-center">
                <p className="text-[11px] text-slate-400">
                  {recommendedDimensions
                    ? `Recommended: ${recommendedDimensions.label || `${recommendedDimensions.width} × ${recommendedDimensions.height} px (16:9)`}`
                    : 'Any image format (PNG, JPG, WEBP, SVG)'}
                </p>
                {standardizeAspectRatio && (
                  <p className="text-[10px] text-indigo-400 font-sans flex items-center gap-1 mt-0.5">
                    <ShieldCheck size={11} /> Auto-standardized to 16:9 for identical project cover dimensions
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  )
}
