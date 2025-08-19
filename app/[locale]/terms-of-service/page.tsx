'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle as _CheckCircle, AlertTriangle as _AlertTriangle } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import Link from 'next/link'


export default function TermsOfServicePage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  const { t } = useTranslations(locale as 'ru' | 'en' | 'zh' | 'th')

  // Функция для получения контента в зависимости от языка
  const getTermsContent = () => {
    switch (locale) {
      case 'ru':
        return {
          title: 'Пользовательское соглашение',
          lastUpdated: '15 января 2025 года',
          content: `
            <div class="terms-content">
              <p class="mb-6 text-lg text-gray-300">
                Настоящее Пользовательское соглашение (далее — «Соглашение») определяет условия использования программного обеспечения для автоматической торговли криптовалютами (далее — «Бот»), предоставляемого <strong class="text-primary-400">The SIM</strong>, зарегистрированной в соответствии с законодательством ОАЭ, Free Zone IFZA, с юридическим адресом: Dubai Silicon Oasis, Dubai, UAE (далее — «Компания»).
              </p>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">1. Термины и определения</h2>
                <ul class="space-y-3 text-gray-300">
                  <li class="flex items-start">
                    <span class="text-primary-400 mr-2">•</span>
                    <span><strong>Клиент</strong> — физическое или юридическое лицо, заключившее Соглашение с Компанией.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-primary-400 mr-2">•</span>
                    <span><strong>Бот</strong> — программное обеспечение, предназначенное для автоматической торговли криптовалютами через API Binance.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-primary-400 mr-2">•</span>
                    <span><strong>API-ключ</strong> — ключ доступа к аккаунту клиента на Binance, предоставленный Клиентом для работы Бота.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-primary-400 mr-2">•</span>
                    <span><strong>Прибыль</strong> — положительная разница между исходным балансом криптовалюты и конечным балансом за определённый период, зафиксированная с помощью данных Binance.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-primary-400 mr-2">•</span>
                    <span><strong>Комиссия</strong> — вознаграждение Компании в размере 30% от полученной Клиентом прибыли.</span>
                  </li>
                </ul>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">2. Предмет соглашения</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>2.1.</strong> Компания предоставляет Клиенту доступ к Боту, который автоматически совершает торговые операции на бирже Binance от имени Клиента, используя API-ключ без права вывода средств.</p>
                  <p><strong>2.2.</strong> Клиент обязуется самостоятельно создать API-ключ в аккаунте Binance и предоставить его Компании.</p>
                  <p><strong>2.3.</strong> Все торговые операции осуществляются исключительно на аккаунте Клиента. Компания не имеет доступа к средствам Клиента.</p>
                </div>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">3. Оплата и комиссии</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>3.1.</strong> Клиент обязуется выплачивать Компании 30% от прибыли, полученной в результате использования Бота.</p>
                  <p><strong>3.2.</strong> Оплата производится в криптовалюте (USDT, BUSD, BTC или иная согласованная сторонами) на адрес криптокошелька Компании, указанный в личном кабинете или на сайте.</p>
                  <p><strong>3.3.</strong> Клиент обязуется производить оплату не позднее 7 календарных дней после окончания расчетного периода (например, раз в месяц).</p>
                  <p><strong>3.4.</strong> В случае неоплаты Компания оставляет за собой право приостановить доступ к Боту.</p>
                </div>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">4. Ответственность сторон</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>4.1.</strong> Компания предоставляет Бота «как есть» и не гарантирует получение прибыли или отсутствие убытков.</p>
                  <p><strong>4.2.</strong> Клиент самостоятельно несет все риски, связанные с торговлей криптовалютами, включая рыночные, технические и регуляторные.</p>
                  <p><strong>4.3.</strong> Компания не несет ответственности за убытки, понесенные Клиентом в результате действий Бота, API-сбоев, или изменений на стороне биржи Binance.</p>
                </div>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">5. Конфиденциальность и безопасность</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>5.1.</strong> Компания обязуется не передавать третьим лицам данные API-ключей и иную личную информацию Клиента.</p>
                  <p><strong>5.2.</strong> Клиент обязуется обеспечить безопасность своего аккаунта Binance и не разглашать свои доступы третьим лицам.</p>
                </div>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">6. Прекращение использования</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>6.1.</strong> Клиент может прекратить использование Бота в любой момент, удалив или отключив API-ключ.</p>
                  <p><strong>6.2.</strong> Компания может прекратить доступ к Боту в случае нарушения условий настоящего Соглашения.</p>
                </div>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">7. Юрисдикция и разрешение споров</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>7.1.</strong> Настоящее Соглашение регулируется законодательством ОАЭ, Free Zone IFZA.</p>
                  <p><strong>7.2.</strong> Все споры подлежат рассмотрению в соответствии с действующим законодательством и юрисдикцией IFZA Free Zone.</p>
                </div>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">8. Прочие условия</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>8.1.</strong> Компания оставляет за собой право вносить изменения в настоящее Соглашение. Обновлённая версия публикуется на сайте Компании.</p>
                  <p><strong>8.2.</strong> Продолжение использования Бота считается согласием Клиента с новой редакцией Соглашения.</p>
                </div>
              </div>

              <div class="acceptance-section mt-12 p-6 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                <div class="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary-400 mr-3" />
                  <h3 class="text-xl font-bold text-white">Принятие условий</h3>
                </div>
                <p class="text-gray-300 mb-4">
                  Нажимая кнопку "Принять", Клиент подтверждает, что ознакомлен и согласен с условиями настоящего Соглашения.
                </p>
                <button className="px-8 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Принять условия
                </button>
              </div>

              <div class="warning-section mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div class="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
                  <span class="text-yellow-300 text-sm">
                    <strong>Важно:</strong> Использование Бота означает автоматическое согласие с условиями настоящего Соглашения.
                  </span>
                </div>
              </div>
            </div>
          `
        }
      case 'en':
        return {
          title: 'Terms of Service',
          lastUpdated: 'January 15, 2025',
          content: `
            <div class="terms-content">
              <p class="mb-6 text-lg text-gray-300">
                This Terms of Service Agreement (hereinafter — "Agreement") defines the terms of use of software for automatic cryptocurrency trading (hereinafter — "Bot"), provided by <strong class="text-primary-400">The SIM</strong>, registered in accordance with the legislation of the UAE, Free Zone IFZA, with legal address: Dubai Silicon Oasis, Dubai, UAE (hereinafter — "Company").
              </p>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">1. Terms and Definitions</h2>
                <ul class="space-y-3 text-gray-300">
                  <li class="flex items-start">
                    <span class="text-primary-400 mr-2">•</span>
                    <span><strong>Client</strong> — an individual or legal entity that has entered into an Agreement with the Company.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-primary-400 mr-2">•</span>
                    <span><strong>Bot</strong> — software designed for automatic cryptocurrency trading through the Binance API.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-primary-400 mr-2">•</span>
                    <span><strong>API Key</strong> — an access key to the client's account on Binance, provided by the Client for the Bot's operation.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-primary-400 mr-2">•</span>
                    <span><strong>Profit</strong> — the positive difference between the initial cryptocurrency balance and the final balance over a certain period, recorded using Binance data.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-primary-400 mr-2">•</span>
                    <span><strong>Commission</strong> — the Company's remuneration in the amount of 30% of the profit received by the Client.</span>
                  </li>
                </ul>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">2. Subject of Agreement</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>2.1.</strong> The Company provides the Client with access to the Bot, which automatically performs trading operations on the Binance exchange on behalf of the Client, using the API key without the right to withdraw funds.</p>
                  <p><strong>2.2.</strong> The Client undertakes to independently create an API key in the Binance account and provide it to the Company.</p>
                  <p><strong>2.3.</strong> All trading operations are carried out exclusively on the Client's account. The Company does not have access to the Client's funds.</p>
                </div>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">3. Payment and Commissions</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>3.1.</strong> The Client undertakes to pay the Company 30% of the profit received as a result of using the Bot.</p>
                  <p><strong>3.2.</strong> Payment is made in cryptocurrency (USDT, BUSD, BTC or other agreed by the parties) to the Company's crypto wallet address specified in the personal account or on the website.</p>
                  <p><strong>3.3.</strong> The Client undertakes to make payment no later than 7 calendar days after the end of the billing period (for example, once a month).</p>
                  <p><strong>3.4.</strong> In case of non-payment, the Company reserves the right to suspend access to the Bot.</p>
                </div>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">4. Liability of Parties</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>4.1.</strong> The Company provides the Bot "as is" and does not guarantee profit or absence of losses.</p>
                  <p><strong>4.2.</strong> The Client independently bears all risks associated with cryptocurrency trading, including market, technical and regulatory risks.</p>
                  <p><strong>4.3.</strong> The Company is not responsible for losses incurred by the Client as a result of the Bot's actions, API failures, or changes on the Binance exchange side.</p>
                </div>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">5. Confidentiality and Security</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>5.1.</strong> The Company undertakes not to transfer API key data and other personal information of the Client to third parties.</p>
                  <p><strong>5.2.</strong> The Client undertakes to ensure the security of their Binance account and not to disclose their access to third parties.</p>
                </div>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">6. Termination of Use</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>6.1.</strong> The Client may terminate the use of the Bot at any time by deleting or disabling the API key.</p>
                  <p><strong>6.2.</strong> The Company may terminate access to the Bot in case of violation of the terms of this Agreement.</p>
                </div>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">7. Jurisdiction and Dispute Resolution</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>7.1.</strong> This Agreement is governed by the legislation of the UAE, Free Zone IFZA.</p>
                  <p><strong>7.2.</strong> All disputes are subject to consideration in accordance with the current legislation and jurisdiction of IFZA Free Zone.</p>
                </div>
              </div>

              <div class="section mb-8">
                <h2 class="text-2xl font-bold text-white mb-4">8. Other Terms</h2>
                <div class="space-y-4 text-gray-300">
                  <p><strong>8.1.</strong> The Company reserves the right to make changes to this Agreement. The updated version is published on the Company's website.</p>
                  <p><strong>8.2.</strong> Continued use of the Bot is considered the Client's consent to the new version of the Agreement.</p>
                </div>
              </div>

              <div class="acceptance-section mt-12 p-6 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                <div class="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary-400 mr-3" />
                  <h3 class="text-xl font-bold text-white">Accept Terms</h3>
                </div>
                <p class="text-gray-300 mb-4">
                  By clicking "Accept", the Client confirms that they have read and agree to the terms of this Agreement.
                </p>
                <button className="px-8 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Accept Terms
                </button>
              </div>

              <div class="warning-section mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div class="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
                  <span class="text-yellow-300 text-sm">
                    <strong>Important:</strong> Using the Bot means automatic agreement with the terms of this Agreement.
                  </span>
                </div>
              </div>
            </div>
          `
        }
      default:
        return {
          title: 'Terms of Service',
          lastUpdated: 'January 15, 2025',
          content: `
            <div class="terms-content">
              <p class="mb-6 text-lg text-gray-300">
                This Terms of Service Agreement (hereinafter — "Agreement") defines the terms of use of software for automatic cryptocurrency trading (hereinafter — "Bot"), provided by <strong class="text-primary-400">The SIM</strong>, registered in accordance with the legislation of the UAE, Free Zone IFZA, with legal address: Dubai Silicon Oasis, Dubai, UAE (hereinafter — "Company").
              </p>
              <!-- English content as default -->
            </div>
          `
        }
    }
  }

  const content = getTermsContent()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link 
                href={`/${locale}`}
                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('common.back')}
              </Link>
              
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">{content.title}</span>
              </h1>

              <div className="text-gray-400 mb-8">
                📅 {locale === 'ru' ? 'Дата последнего обновления' : 'Last Updated'}: {content.lastUpdated}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="prose prose-lg prose-invert max-w-none"
            >
              <div 
                className="legal-content text-gray-300"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
