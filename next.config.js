/** @type {import('next').NextConfig} */
const nextConfig = {
  // Временно отключаем агрессивные оптимизации для отладки
  swcMinify: process.env.NODE_ENV === 'production',
  compress: process.env.NODE_ENV === 'production',
  
  // Оптимизация изображений
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: true,
    formats: ['image/webp', 'image/avif']
  },
  
  // Упрощаем webpack в development
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Оптимизация только для продакшена
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    
    return config
  },
  
  // Отключаем экспериментальные оптимизации в development
  experimental: process.env.NODE_ENV === 'production' ? {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  } : {},
  
  // Standalone режим для Docker
  output: 'standalone',
  
  // Security headers для всех режимов
  async headers() {
    const isDev = process.env.NODE_ENV === 'development'
    
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Дополнительные заголовки для development
          ...(isDev ? [
            { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
            { key: 'Pragma', value: 'no-cache' },
            { key: 'Expires', value: '0' }
          ] : [
            {
              key: 'Content-Security-Policy', 
              value: "default-src 'self'; script-src 'self' 'unsafe-inline'; script-src-elem 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.telegram.org; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';"
            }
          ]),
        ],
      },
    ]
  },
}

module.exports = nextConfig 