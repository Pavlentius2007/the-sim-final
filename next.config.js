/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизация производительности
  swcMinify: true,
  compress: true,
  
  // Оптимизация изображений
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: true,
    formats: ['image/webp', 'image/avif']
  },
  
  // Оптимизация webpack
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Оптимизация для продакшена
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
  
  // Экспериментальные функции для производительности
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  
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
          // CSP отключен для разработки чтобы избежать ошибок от расширений
          ...(isDev ? [] : [{
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; script-src-elem 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.telegram.org; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';"
          }]),
        ],
      },
    ]
  },
}

module.exports = nextConfig 