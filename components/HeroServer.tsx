import { ChevronDown, MessageCircle } from 'lucide-react'

interface HeroServerProps {
  title: string
  subtitle: string
  ctaButton: string
  learnMore: string
  managedAssets: string
  satisfiedClients: string
  support: string
}

export default function HeroServer({
  title,
  subtitle,
  ctaButton,
  learnMore,
  managedAssets,
  satisfiedClients,
  support
}: HeroServerProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" suppressHydrationWarning>
      {/* Космический overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-900/5 to-purple-900/10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-accent-purple/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-accent-cyan/20 rounded-full blur-lg"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-16">
            <div className="flex justify-center mb-6">
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-500 mb-4" style={{textShadow: '0 4px 8px rgba(0,0,0,0.3)'}}>TheSim</div>
                <div className="text-lg md:text-xl text-blue-400 font-medium uppercase tracking-wider">Smart Investments</div>
              </div>
            </div>
            <div className="w-32 h-1.5 bg-gradient-primary mx-auto rounded-full"></div>
          </div>

          {/* Main Headline */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a 
              href="#contact-form"
              className="px-8 py-4 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-105"
            >
              {ctaButton}
            </a>
            <a 
              href="https://t.me/Sergey_Loye" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              {learnMore}
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">$10M+</div>
              <div className="text-gray-400">{managedAssets}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">540+</div>
              <div className="text-gray-400">{satisfiedClients}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">{support}</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <a
            href="#about"
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:text-primary-400 transition-colors"
          >
            <div className="animate-bounce">
              <ChevronDown className="w-6 h-6" />
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
