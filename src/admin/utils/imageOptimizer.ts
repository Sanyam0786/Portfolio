/**
 * Converts any image format (PNG, JPG, JPEG, GIF, BMP, AVIF, HEIC, SVG, WEBP)
 * into a lightweight, high-performance WebP Blob using native browser HTML5 Canvas.
 *
 * Benefits:
 * - Reduces file size by 75% to 90% with near-lossless visual quality (0.88 quality).
 * - Preserves transparent backgrounds (alpha channel).
 * - Downscales ultra-high resolution images (>2560px) to prevent browser memory bloat.
 * - Falls back safely to original file if format is non-image (e.g. PDF) or unsupported.
 */
export interface ConvertOptions {
  quality?: number
  maxDimension?: number
  standardizeAspectRatio?: number // e.g. 16 / 9 for project cover hero banners
  targetWidth?: number // e.g. 1920
  targetHeight?: number // e.g. 1080
}

export interface OptimizedImageResult {
  blob: Blob
  fileName: string
  contentType: string
  width?: number
  height?: number
  aspectRatio?: number
}

/**
 * Converts any image format (PNG, JPG, JPEG, GIF, BMP, AVIF, HEIC, SVG, WEBP)
 * into a lightweight, high-performance WebP Blob using native browser HTML5 Canvas.
 *
 * Supports optional aspect-ratio standardization (e.g. 16:9 for uniform cover banners).
 */
export async function convertToWebP(
  file: File,
  qualityOrOptions: number | ConvertOptions = 0.88,
  legacyMaxDimension = 2560
): Promise<OptimizedImageResult> {
  const options: ConvertOptions =
    typeof qualityOrOptions === 'object'
      ? qualityOrOptions
      : { quality: qualityOrOptions, maxDimension: legacyMaxDimension }

  const quality = options.quality ?? 0.88
  const maxDimension = options.maxDimension ?? 2560
  const standardizeAspectRatio = options.standardizeAspectRatio
  const targetWidth = options.targetWidth ?? 1920

  // If file is not an image (e.g. PDF resume), return original untouched
  if (!file.type.startsWith('image/')) {
    return {
      blob: file,
      fileName: file.name,
      contentType: file.type || 'application/octet-stream',
    }
  }

  return new Promise((resolve) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      try {
        const naturalW = img.naturalWidth || img.width || 1200
        const naturalH = img.naturalHeight || img.height || 800

        let srcX = 0
        let srcY = 0
        let srcW = naturalW
        let srcH = naturalH

        let outW = naturalW
        let outH = naturalH

        // 1. If aspect ratio standardization guard is requested (e.g. 16:9 for project covers)
        if (standardizeAspectRatio && standardizeAspectRatio > 0) {
          const currentRatio = naturalW / naturalH

          if (currentRatio > standardizeAspectRatio) {
            // Wider than target ratio: crop sides symmetrically
            srcH = naturalH
            srcW = Math.round(naturalH * standardizeAspectRatio)
            srcX = Math.round((naturalW - srcW) / 2)
            srcY = 0
          } else {
            // Taller than target ratio: crop top/bottom symmetrically
            srcW = naturalW
            srcH = Math.round(naturalW / standardizeAspectRatio)
            srcX = 0
            srcY = Math.round((naturalH - srcH) / 2)
          }

          // Scale output to standard size up to targetWidth (default 1920px)
          outW = Math.min(srcW, targetWidth)
          if (outW < 1280 && srcW >= 1280) outW = 1280
          outH = Math.round(outW / standardizeAspectRatio)
        } else {
          // Standard auto-scale preserving original aspect ratio
          if (outW > maxDimension || outH > maxDimension) {
            if (outW > outH) {
              outH = Math.round((outH * maxDimension) / outW)
              outW = maxDimension
            } else {
              outW = Math.round((outW * maxDimension) / outH)
              outH = maxDimension
            }
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = outW
        canvas.height = outH

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return resolve({ blob: file, fileName: file.name, contentType: file.type })
        }

        // Draw image onto canvas
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH)

        // Convert canvas to WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image'
              const sanitizedName = baseName
                .toLowerCase()
                .replace(/[^a-z0-9_-]/g, '_')
                .substring(0, 30)

              resolve({
                blob,
                fileName: `${sanitizedName}.webp`,
                contentType: 'image/webp',
                width: outW,
                height: outH,
                aspectRatio: outW / outH,
              })
            } else {
              resolve({ blob: file, fileName: file.name, contentType: file.type })
            }
          },
          'image/webp',
          quality
        )
      } catch (err) {
        console.warn('WebP conversion failed, using original file:', err)
        resolve({ blob: file, fileName: file.name, contentType: file.type })
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({ blob: file, fileName: file.name, contentType: file.type })
    }

    img.src = objectUrl
  })
}
