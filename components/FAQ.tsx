'use client'

import { useState, useCallback, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { m } from '@/components/LazyMotionProvider'
import { useTranslations } from '@/hooks/useTranslations'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  supportedAssets?: string[]
}

export default function FAQ() {
  const { t } = useTranslations()
  const [openItems, setOpenItems] = useState<number[]>([])
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const faqItems: FAQItem[] = useMemo(() => [
    {
      question: t('faq.capitalProtection.question') || 'Как работает защита капитала в TheSim?',
      answer: t('faq.capitalProtection.answer') || 'Мы используем многоуровневую систему защиты: диверсификацию портфеля по 30+ активам, стоп-лоссы, динамическое перераспределение и интеграцию с Binance для максимальной ликвидности. Наша система автоматически адаптируется к рыночным условиям.'
    },
    {
      question: t('faq.cryptocurrencies.question') || 'Какие криптовалюты поддерживаются?',
      answer: t('faq.cryptocurrencies.answer') || 'Поддерживаются все топовые криптовалюты: Bitcoin, Ethereum, BNB, Solana, Cardano, а также популярные DeFi токены. Мы постоянно анализируем рынок и добавляем перспективные активы с высокой ликвидностью.',
      supportedAssets: [
        "BTC", "ETH", "BNB", "SOL", "ADA", "XRP", "DOGE", "AVAX", "MATIC", "DOT",
        "LINK", "UNI", "AAVE", "COMP", "CRV", "LDO", "PENDLE", "RENDER", "SUI", "TAO",
        "1INCH", "BONK", "ENA", "ENS", "ETHFI", "JTO", "JUP", "PEPE", "RAY", "RED",
        "RESOLV", "REZ", "SPK", "ZRO"
      ]
    },
    {
      question: t('faq.investmentStart.question') || 'Как начать инвестировать с TheSim?',
      answer: t('faq.investmentStart.answer') || 'Процесс простой: оставьте заявку на сайте, наш менеджер свяжется с вами для консультации, подберет оптимальную стратегию под ваш бюджет и цели, после чего вы сможете начать инвестировать уже в течение 24 часов.'
    },
    {
      question: t('faq.risks.question') || 'Какие риски связаны с криптоинвестициями?',
      answer: t('faq.risks.answer') || 'Основные риски: высокая волатильность рынка, регулятивные изменения, технологические риски. Однако наша система управления рисками минимизирует эти угрозы через диверсификацию, стоп-лоссы и профессиональный мониторинг.'
    },
    {
      question: t('faq.returns.question') || 'Какую доходность можно ожидать?',
      answer: t('faq.returns.answer') || 'Исторически наша платформа показывает 15-45% годовых в зависимости от рыночных условий. Мы не гарантируем конкретные результаты, но наша система оптимизирована для получения стабильного дохода с минимальными рисками.'
    },
    {
      question: t('faq.security.question') || 'Насколько безопасна платформа TheSim?',
      answer: t('faq.security.answer') || 'Мы используем банковский уровень безопасности: двухфакторную аутентификацию, шифрование данных, работу напрямую с Binance API без хранения средств на собственных счетах, регулярные аудиты безопасности и страховку активов.'
    },
    {
      question: t('faq.minimumInvestment.question') || 'Какая минимальная сумма для инвестирования?',
      answer: t('faq.minimumInvestment.answer') || 'Минимальная сумма составляет $10,000 для начала работы с платформой. Это позволяет обеспечить качественную диверсификацию портфеля и эффективное управление рисками.'
    },
    {
      question: t('faq.withdrawal.question') || 'Как быстро можно вывести средства?',
      answer: t('faq.withdrawal.answer') || 'Вывод средств осуществляется в течение 1-3 рабочих дней. Мы работаем напрямую с Binance, что обеспечивает быстрые транзакции. Комиссия за вывод составляет 0.1% от суммы.'
    },
    {
      question: t('faq.support.question') || 'Какая поддержка предоставляется инвесторам?',
      answer: t('faq.support.answer') || 'Мы предоставляем персонального менеджера, круглосуточную поддержку через чат и телефон, регулярные отчеты о состоянии портфеля, консультации по стратегиям и доступ к образовательным материалам.'
    }
  ], [t])

  const toggleItem = useCallback((index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }, [])

  return (
    <section 
      ref={ref}
      id="faq"
      suppressHydrationWarning 
      className="py-20 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('faq.title') || 'Часто задаваемые вопросы'}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('faq.subtitle') || 'Ответы на самые популярные вопросы о нашей платформе управления цифровыми активами'}
          </p>
        </m.div>

        <div className="max-w-4xl mx-auto">
          {faqItems.map((item, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-left bg-white/5 backdrop-blur-lg rounded-lg p-6 hover:bg-white/10 transition-all duration-200 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {item.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  )}
                </div>
                
                {openItems.includes(index) && (
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {item.answer}
                    </p>
                    
                    {item.supportedAssets && Array.isArray(item.supportedAssets) && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-white mb-3">
                          Поддерживаемые активы:
                        </h4>
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                          {item.supportedAssets.map((asset, assetIndex) => (
                            <div
                              key={assetIndex}
                              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg px-3 py-2 text-center border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
                            >
                              <span className="text-xs font-medium text-blue-300">
                                {asset}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </m.div>
                )}
              </button>
            </m.div>
          ))}
        </div>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6">
            {t('faq.contactText') || 'Не нашли ответ на свой вопрос?'}
          </p>
          <a
            href="#contact-form"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            {t('faq.contactButton') || 'Связаться с нами'}
          </a>
        </m.div>
      </div>
    </section>
  )
}
