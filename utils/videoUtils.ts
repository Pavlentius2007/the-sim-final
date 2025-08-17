export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtu\.be\/([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }
  
  return null
}

export function getYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeId(url)
  if (!videoId) {
    return ''
  }
  return `https://www.youtube.com/embed/${videoId}`
}

export function getYouTubeThumbnail(url: string): string {
  const videoId = extractYouTubeId(url)
  console.log('Extracting thumbnail for URL:', url, 'Video ID:', videoId)
  if (!videoId) {
    console.log('No video ID found for URL:', url)
    return ''
  }
  // Попробуем сначала maxresdefault, если не работает - hqdefault
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  console.log('Generated thumbnail URL:', thumbnailUrl)
  return thumbnailUrl
}

export function getYouTubeThumbnailFallback(url: string): string {
  const videoId = extractYouTubeId(url)
  if (!videoId) {
    return ''
  }
  // Fallback на hqdefault если maxresdefault недоступен
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function validateYouTubeUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/
  ]
  
  return patterns.some(pattern => pattern.test(url))
}
