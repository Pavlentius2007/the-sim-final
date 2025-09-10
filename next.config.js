/** @type {import('next').NextConfig} */
const nextConfig = {
  // Включаем оптимизации для лучшей производительности
  swcMinify: true,
  compress: true,
  
  // Оптимизация изображений
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: false, // Включаем оптимизацию для производительности
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  
  // Агрессивная оптимизация webpack
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Оптимизация для продакшена
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      }
      
      // Tree shaking оптимизация
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
    }
    
    return config
  },
  
  // Отключаем экспериментальные оптимизации в development
  experimental: process.env.NODE_ENV === 'production' ? {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  } : {},
  
  // Standalone режим для Docker
  output: 'standalone',
  
  // Оптимизация производительности
  poweredByHeader: false,
  generateEtags: false,
  
  // Оптимизация компиляции
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Оптимизированные заголовки
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/fon.webp',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

module.exports = nextConfig 