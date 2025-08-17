'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import Link from 'next/link'

export default function PrivacyPage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  const { t } = useTranslations(locale as any)

  // Функция для получения контента в зависимости от языка
  const getPrivacyContent = () => {
    switch (locale) {
      case 'ru':
        return {
          title: 'Политика конфиденциальности',
          content: `
            <h2>1. Общие положения</h2>
            <p>Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей платформы The SIM.</p>
            
            <h2>2. Сбор персональных данных</h2>
            <p>Мы собираем следующие виды персональных данных:</p>
            <ul>
              <li>Имя и фамилия</li>
              <li>Адрес электронной почты</li>
              <li>Номер телефона</li>
              <li>Информация об инвестиционных предпочтениях</li>
            </ul>
            
            <h2>3. Цели обработки данных</h2>
            <p>Ваши персональные данные используются для:</p>
            <ul>
              <li>Предоставления инвестиционных услуг</li>
              <li>Связи с вами по вопросам инвестиций</li>
              <li>Соблюдения требований законодательства</li>
              <li>Улучшения качества наших услуг</li>
            </ul>
            
            <h2>4. Защита данных</h2>
            <p>Мы принимаем все необходимые меры для защиты ваших персональных данных от несанкционированного доступа, изменения или уничтожения.</p>
            
            <h2>5. Ваши права</h2>
            <p>Вы имеете право:</p>
            <ul>
              <li>Получать информацию об обработке ваших данных</li>
              <li>Требовать исправления неточных данных</li>
              <li>Требовать удаления ваших данных</li>
              <li>Отзывать согласие на обработку данных</li>
            </ul>
            
            <h2>6. Контактная информация</h2>
            <p>По вопросам обработки персональных данных обращайтесь по адресу: info@thesim.com</p>
          `
        }
      case 'en':
        return {
          title: 'Privacy Policy',
          content: `
            <h2>1. General Provisions</h2>
            <p>This Privacy Policy defines the procedure for processing personal data of The SIM platform users.</p>
            
            <h2>2. Personal Data Collection</h2>
            <p>We collect the following types of personal data:</p>
            <ul>
              <li>First and last name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Investment preference information</li>
            </ul>
            
            <h2>3. Data Processing Purposes</h2>
            <p>Your personal data is used for:</p>
            <ul>
              <li>Providing investment services</li>
              <li>Contacting you regarding investments</li>
              <li>Compliance with legal requirements</li>
              <li>Improving the quality of our services</li>
            </ul>
            
            <h2>4. Data Protection</h2>
            <p>We take all necessary measures to protect your personal data from unauthorized access, modification, or destruction.</p>
            
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Receive information about the processing of your data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            
            <h2>6. Contact Information</h2>
            <p>For questions regarding personal data processing, contact us at: info@thesim.com</p>
          `
        }
      case 'th':
        return {
          title: 'นโยบายความเป็นส่วนตัว',
          content: `
            <h2>1. บทบัญญัติทั่วไป</h2>
            <p>นโยบายความเป็นส่วนตัวนี้กำหนดขั้นตอนการประมวลผลข้อมูลส่วนบุคคลของผู้ใช้แพลตฟอร์ม The SIM</p>
            
            <h2>2. การเก็บข้อมูลส่วนบุคคล</h2>
            <p>เราเก็บข้อมูลส่วนบุคคลประเภทต่อไปนี้:</p>
            <ul>
              <li>ชื่อและนามสกุล</li>
              <li>ที่อยู่อีเมล</li>
              <li>หมายเลขโทรศัพท์</li>
              <li>ข้อมูลความชอบในการลงทุน</li>
            </ul>
            
            <h2>3. วัตถุประสงค์ในการประมวลผลข้อมูล</h2>
            <p>ข้อมูลส่วนบุคคลของคุณใช้เพื่อ:</p>
            <ul>
              <li>การให้บริการลงทุน</li>
              <li>การติดต่อคุณเกี่ยวกับการลงทุน</li>
              <li>การปฏิบัติตามข้อกำหนดทางกฎหมาย</li>
              <li>การปรับปรุงคุณภาพบริการของเรา</li>
            </ul>
            
            <h2>4. การป้องกันข้อมูล</h2>
            <p>เราใช้มาตรการที่จำเป็นทั้งหมดเพื่อปป้องกันข้อมูลส่วนบุคคลของคุณจากการเข้าถึง การแก้ไข หรือการทำลายโดยไม่ได้รับอนุญาต</p>
            
            <h2>5. สิทธิของคุณ</h2>
            <p>คุณมีสิทธิที่จะ:</p>
            <ul>
              <li>รับข้อมูลเกี่ยวกับการประมวลผลข้อมูลของคุณ</li>
              <li>ขอแก้ไขข้อมูลที่ไม่ถูกต้อง</li>
              <li>ขอลบข้อมูลของคุณ</li>
              <li>ถอนความยินยอมในการประมวลผลข้อมูล</li>
            </ul>
            
            <h2>6. ข้อมูลการติดต่อ</h2>
            <p>สำหรับคำถามเกี่ยวกับการประมวลผลข้อมูลส่วนบุคคล ติดต่อเราที่: info@thesim.com</p>
          `
        }
      case 'zh':
        return {
          title: '隐私政策',
          content: `
            <h2>1. 一般条款</h2>
            <p>本隐私政策规定了 The SIM 平台用户个人数据的处理程序。</p>
            
            <h2>2. 个人数据收集</h2>
            <p>我们收集以下类型的个人数据：</p>
            <ul>
              <li>姓名</li>
              <li>电子邮件地址</li>
              <li>电话号码</li>
              <li>投资偏好信息</li>
            </ul>
            
            <h2>3. 数据处理目的</h2>
            <p>您的个人数据用于：</p>
            <ul>
              <li>提供投资服务</li>
              <li>就投资事宜与您联系</li>
              <li>遵守法律要求</li>
              <li>改善我们的服务质量</li>
            </ul>
            
            <h2>4. 数据保护</h2>
            <p>我们采取一切必要措施保护您的个人数据免受未经授权的访问、修改或销毁。</p>
            
            <h2>5. 您的权利</h2>
            <p>您有权：</p>
            <ul>
              <li>获取有关处理您数据的信息</li>
              <li>要求更正不准确的数据</li>
              <li>要求删除您的数据</li>
              <li>撤回数据处理同意</li>
            </ul>
            
            <h2>6. 联系信息</h2>
            <p>有关个人数据处理的问题，请联系我们：info@thesim.com</p>
          `
        }
      default:
        return {
          title: 'Privacy Policy',
          content: `
            <h2>1. General Provisions</h2>
            <p>This Privacy Policy defines the procedure for processing personal data of The SIM platform users.</p>
            
            <h2>2. Personal Data Collection</h2>
            <p>We collect the following types of personal data:</p>
            <ul>
              <li>First and last name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Investment preference information</li>
            </ul>
            
            <h2>3. Data Processing Purposes</h2>
            <p>Your personal data is used for:</p>
            <ul>
              <li>Providing investment services</li>
              <li>Contacting you regarding investments</li>
              <li>Compliance with legal requirements</li>
              <li>Improving the quality of our services</li>
            </ul>
            
            <h2>4. Data Protection</h2>
            <p>We take all necessary measures to protect your personal data from unauthorized access, modification, or destruction.</p>
            
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Receive information about the processing of your data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            
            <h2>6. Contact Information</h2>
            <p>For questions regarding personal data processing, contact us at: info@thesim.com</p>
          `
        }
    }
  }

  const content = getPrivacyContent()

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
