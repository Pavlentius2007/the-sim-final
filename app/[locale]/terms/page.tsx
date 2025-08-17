'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import Link from 'next/link'

export default function TermsPage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  const { t } = useTranslations(locale as any)

  // Функция для получения контента в зависимости от языка
  const getTermsContent = () => {
    switch (locale) {
      case 'ru':
        return {
          title: 'Условия использования',
          content: `
            <h2>1. Общие условия</h2>
            <p>Настоящие Условия использования регулируют порядок использования платформы The SIM и предоставляемых инвестиционных услуг.</p>
            
            <h2>2. Описание услуг</h2>
            <p>The SIM предоставляет следующие услуги:</p>
            <ul>
              <li>Консультации по инвестиционным стратегиям</li>
              <li>Анализ инвестиционных возможностей</li>
              <li>Управление инвестиционными портфелями</li>
              <li>Обучение основам инвестирования</li>
            </ul>
            
            <h2>3. Минимальная сумма инвестиций</h2>
            <p><strong>Минимальная сумма для работы с нашей платформой составляет $2,000.</strong> Это требование установлено для обеспечения качественного сервиса и соответствия регулятивным требованиям.</p>
            
            <h2>4. Права и обязанности пользователя</h2>
            <p>Пользователь обязуется:</p>
            <ul>
              <li>Предоставлять достоверную информацию</li>
              <li>Соблюдать условия использования платформы</li>
              <li>Нести ответственность за свои инвестиционные решения</li>
              <li>Своевременно информировать об изменениях в финансовом положении</li>
            </ul>
            
            <h2>5. Риски и ответственность</h2>
            <p>Инвестиции связаны с рисками. Пользователь понимает и принимает возможность потери части или всех инвестированных средств. The SIM не гарантирует доходность инвестиций.</p>
            
            <h2>6. Конфиденциальность</h2>
            <p>Мы обязуемся защищать конфиденциальность ваших данных в соответствии с нашей Политикой конфиденциальности.</p>
            
            <h2>7. Изменение условий</h2>
            <p>The SIM оставляет за собой право изменять настоящие условия. Пользователи будут уведомлены об изменениях заблаговременно.</p>
            
            <h2>8. Контактная информация</h2>
            <p>По вопросам использования услуг обращайтесь: info@thesim.com</p>
          `
        }
      case 'en':
        return {
          title: 'Terms of Use',
          content: `
            <h2>1. General Terms</h2>
            <p>These Terms of Use govern the use of The SIM platform and the investment services provided.</p>
            
            <h2>2. Service Description</h2>
            <p>The SIM provides the following services:</p>
            <ul>
              <li>Investment strategy consulting</li>
              <li>Investment opportunity analysis</li>
              <li>Investment portfolio management</li>
              <li>Investment fundamentals education</li>
            </ul>
            
            <h2>3. Minimum Investment Amount</h2>
            <p><strong>The minimum amount to work with our platform is $2,000.</strong> This requirement is established to ensure quality service and compliance with regulatory requirements.</p>
            
            <h2>4. User Rights and Obligations</h2>
            <p>The user undertakes to:</p>
            <ul>
              <li>Provide accurate information</li>
              <li>Comply with platform terms of use</li>
              <li>Take responsibility for their investment decisions</li>
              <li>Promptly inform about changes in financial situation</li>
            </ul>
            
            <h2>5. Risks and Liability</h2>
            <p>Investments involve risks. The user understands and accepts the possibility of losing part or all of the invested funds. The SIM does not guarantee investment returns.</p>
            
            <h2>6. Confidentiality</h2>
            <p>We undertake to protect the confidentiality of your data in accordance with our Privacy Policy.</p>
            
            <h2>7. Terms Modification</h2>
            <p>The SIM reserves the right to modify these terms. Users will be notified of changes in advance.</p>
            
            <h2>8. Contact Information</h2>
            <p>For questions about using our services, contact: info@thesim.com</p>
          `
        }
      case 'th':
        return {
          title: 'เงื่อนไขการใช้งาน',
          content: `
            <h2>1. เงื่อนไขทั่วไป</h2>
            <p>เงื่อนไขการใช้งานเหล่านี้ควบคุมการใช้แพลตฟอร์ม The SIM และบริการลงทุนที่ให้บริการ</p>
            
            <h2>2. คำอธิบายบริการ</h2>
            <p>The SIM ให้บริการดังต่อไปนี้:</p>
            <ul>
              <li>คำปรึกษาเรื่องกลยุทธ์การลงทุน</li>
              <li>การวิเคราะห์โอกาสการลงทุน</li>
              <li>การจัดการพอร์ตการลงทุน</li>
              <li>การศึกษาพื้นฐานการลงทุน</li>
            </ul>
            
            <h2>3. จำนวนเงินลงทุนขั้นต่ำ</h2>
            <p><strong>จำนวนเงินขั้นต่ำในการทำงานกับแพลตฟอร์มของเราคือ $2,000</strong> ข้อกำหนดนี้ตั้งขึ้นเพื่อให้มั่นใจในคุณภาพบริการและการปฏิบัติตามข้อกำหนดด้านกฎระเบียบ</p>
            
            <h2>4. สิทธิและหน้าที่ของผู้ใช้</h2>
            <p>ผู้ใช้มีหน้าที่:</p>
            <ul>
              <li>ให้ข้อมูลที่ถูกต้อง</li>
              <li>ปฏิบัติตามเงื่อนไขการใช้แพลตฟอร์ม</li>
              <li>รับผิดชอบต่อการตัดสินใจลงทุนของตนเอง</li>
              <li>แจ้งการเปลี่ยนแปลงสถานะทางการเงินอย่างรวดเร็ว</li>
            </ul>
            
            <h2>5. ความเสี่ยงและความรับผิด</h2>
            <p>การลงทุนมีความเสี่ยง ผู้ใช้เข้าใจและยอมรับความเป็นไปได้ที่จะสูญเสียเงินลงทุนบางส่วนหรือทั้งหมด The SIM ไม่รับประกันผลตอบแทนจากการลงทุน</p>
            
            <h2>6. ความลับ</h2>
            <p>เราให้คำมั่นว่าจะปกป้องความลับของข้อมูลของคุณตามนโยบายความเป็นส่วนตัวของเรา</p>
            
            <h2>7. การแก้ไขเงื่อนไข</h2>
            <p>The SIM ขอสงวนสิทธิ์ในการแก้ไขเงื่อนไขเหล่านี้ ผู้ใช้จะได้รับแจ้งการเปลี่ยนแปลงล่วงหน้า</p>
            
            <h2>8. ข้อมูลการติดต่อ</h2>
            <p>สำหรับคำถามเกี่ยวกับการใช้บริการของเรา ติดต่อ: info@thesim.com</p>
          `
        }
      case 'zh':
        return {
          title: '使用条款',
          content: `
            <h2>1. 一般条款</h2>
            <p>这些使用条款管理 The SIM 平台的使用和所提供的投资服务。</p>
            
            <h2>2. 服务描述</h2>
            <p>The SIM 提供以下服务：</p>
            <ul>
              <li>投资策略咨询</li>
              <li>投资机会分析</li>
              <li>投资组合管理</li>
              <li>投资基础教育</li>
            </ul>
            
            <h2>3. 最低投资金额</h2>
            <p><strong>与我们平台合作的最低金额为 $2,000。</strong>此要求的设立是为了确保优质服务并符合监管要求。</p>
            
            <h2>4. 用户权利和义务</h2>
            <p>用户承诺：</p>
            <ul>
              <li>提供准确信息</li>
              <li>遵守平台使用条款</li>
              <li>对自己的投资决策负责</li>
              <li>及时告知财务状况变化</li>
            </ul>
            
            <h2>5. 风险和责任</h2>
            <p>投资涉及风险。用户理解并接受可能失去部分或全部投资资金的可能性。The SIM 不保证投资回报。</p>
            
            <h2>6. 保密性</h2>
            <p>我们承诺根据我们的隐私政策保护您数据的机密性。</p>
            
            <h2>7. 条款修改</h2>
            <p>The SIM 保留修改这些条款的权利。用户将提前收到变更通知。</p>
            
            <h2>8. 联系信息</h2>
            <p>有关使用我们服务的问题，请联系：info@thesim.com</p>
          `
        }
      default:
        return {
          title: 'Terms of Use',
          content: `
            <h2>1. General Terms</h2>
            <p>These Terms of Use govern the use of The SIM platform and the investment services provided.</p>
            
            <h2>2. Service Description</h2>
            <p>The SIM provides the following services:</p>
            <ul>
              <li>Investment strategy consulting</li>
              <li>Investment opportunity analysis</li>
              <li>Investment portfolio management</li>
              <li>Investment fundamentals education</li>
            </ul>
            
            <h2>3. Minimum Investment Amount</h2>
            <p><strong>The minimum amount to work with our platform is $2,000.</strong> This requirement is established to ensure quality service and compliance with regulatory requirements.</p>
            
            <h2>4. User Rights and Obligations</h2>
            <p>The user undertakes to:</p>
            <ul>
              <li>Provide accurate information</li>
              <li>Comply with platform terms of use</li>
              <li>Take responsibility for their investment decisions</li>
              <li>Promptly inform about changes in financial situation</li>
            </ul>
            
            <h2>5. Risks and Liability</h2>
            <p>Investments involve risks. The user understands and accepts the possibility of losing part or all of the invested funds. The SIM does not guarantee investment returns.</p>
            
            <h2>6. Confidentiality</h2>
            <p>We undertake to protect the confidentiality of your data in accordance with our Privacy Policy.</p>
            
            <h2>7. Terms Modification</h2>
            <p>The SIM reserves the right to modify these terms. Users will be notified of changes in advance.</p>
            
            <h2>8. Contact Information</h2>
            <p>For questions about using our services, contact: info@thesim.com</p>
          `
        }
    }
  }

  const content = getTermsContent()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900/20">
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
