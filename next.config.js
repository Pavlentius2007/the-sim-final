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
          { 
            key: 'Content-Security-Policy', 
            value: isDev 
              ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' ws: wss:; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';"
              : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';"
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 