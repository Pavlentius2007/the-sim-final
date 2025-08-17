/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
    dangerouslyAllowSVG: true,
    unoptimized: true
  },
  
  // Добавляем security headers для продакшена
  async headers() {
    if (process.env.NODE_ENV !== 'production') {
      return []
    }
    
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { 
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https: blob:; font-src 'self'; connect-src 'self'; media-src 'self' https://www.youtube.com https://youtu.be; frame-src 'self' https://www.youtube.com https://youtu.be; object-src 'none';"
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 