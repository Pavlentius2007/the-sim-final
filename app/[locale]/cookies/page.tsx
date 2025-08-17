'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import Link from 'next/link'

export default function CookiesPage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  const { t } = useTranslations(locale as any)

  // Функция для получения контента в зависимости от языка
  const getCookiesContent = () => {
    switch (locale) {
      case 'ru':
        return {
          title: 'Политика использования файлов cookie',
          content: `
            <h2>1. Что такое файлы cookie</h2>
            <p>Файлы cookie - это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении нашего веб-сайта. Они помогают нам улучшить ваш опыт использования платформы.</p>
            
            <h2>2. Какие файлы cookie мы используем</h2>
            <p>Мы используем следующие типы файлов cookie:</p>
            <ul>
              <li><strong>Необходимые cookie:</strong> Обеспечивают основную функциональность сайта</li>
              <li><strong>Аналитические cookie:</strong> Помогают понять, как посетители взаимодействуют с сайтом</li>
              <li><strong>Функциональные cookie:</strong> Запоминают ваши предпочтения и настройки</li>
              <li><strong>Маркетинговые cookie:</strong> Используются для показа релевантной рекламы</li>
            </ul>
            
            <h2>3. Цель использования cookie</h2>
            <p>Мы используем файлы cookie для:</p>
            <ul>
              <li>Обеспечения работы основных функций сайта</li>
              <li>Запоминания ваших предпочтений (язык, валюта)</li>
              <li>Анализа трафика и поведения пользователей</li>
              <li>Улучшения пользовательского опыта</li>
              <li>Предоставления персонализированного контента</li>
            </ul>
            
            <h2>4. Управление файлами cookie</h2>
            <p>Вы можете управлять файлами cookie через настройки своего браузера:</p>
            <ul>
              <li>Блокировать все файлы cookie</li>
              <li>Разрешить только необходимые cookie</li>
              <li>Удалить существующие файлы cookie</li>
              <li>Получать уведомления о новых cookie</li>
            </ul>
            
            <h2>5. Сторонние сервисы</h2>
            <p>Наш сайт может использовать сторонние сервисы, которые также устанавливают файлы cookie:</p>
            <ul>
              <li>Google Analytics для анализа трафика</li>
              <li>YouTube для воспроизведения видео</li>
              <li>Социальные сети для интеграции</li>
            </ul>
            
            <h2>6. Срок хранения</h2>
            <p>Различные файлы cookie имеют разные сроки хранения:</p>
            <ul>
              <li><strong>Сессионные cookie:</strong> Удаляются при закрытии браузера</li>
              <li><strong>Постоянные cookie:</strong> Хранятся до истечения срока или удаления пользователем</li>
            </ul>
            
            <h2>7. Контактная информация</h2>
            <p>По вопросам использования файлов cookie обращайтесь: info@thesim.com</p>
          `
        }
      case 'en':
        return {
          title: 'Cookie Policy',
          content: `
            <h2>1. What are cookies</h2>
            <p>Cookies are small text files that are stored on your device when you visit our website. They help us improve your experience using the platform.</p>
            
            <h2>2. What cookies we use</h2>
            <p>We use the following types of cookies:</p>
            <ul>
              <li><strong>Essential cookies:</strong> Ensure basic site functionality</li>
              <li><strong>Analytics cookies:</strong> Help understand how visitors interact with the site</li>
              <li><strong>Functional cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Marketing cookies:</strong> Used to show relevant advertising</li>
            </ul>
            
            <h2>3. Purpose of using cookies</h2>
            <p>We use cookies to:</p>
            <ul>
              <li>Ensure the operation of basic site functions</li>
              <li>Remember your preferences (language, currency)</li>
              <li>Analyze traffic and user behavior</li>
              <li>Improve user experience</li>
              <li>Provide personalized content</li>
            </ul>
            
            <h2>4. Managing cookies</h2>
            <p>You can manage cookies through your browser settings:</p>
            <ul>
              <li>Block all cookies</li>
              <li>Allow only essential cookies</li>
              <li>Delete existing cookies</li>
              <li>Receive notifications about new cookies</li>
            </ul>
            
            <h2>5. Third-party services</h2>
            <p>Our site may use third-party services that also set cookies:</p>
            <ul>
              <li>Google Analytics for traffic analysis</li>
              <li>YouTube for video playback</li>
              <li>Social networks for integration</li>
            </ul>
            
            <h2>6. Storage period</h2>
            <p>Different cookies have different storage periods:</p>
            <ul>
              <li><strong>Session cookies:</strong> Deleted when browser is closed</li>
              <li><strong>Persistent cookies:</strong> Stored until expiration or user deletion</li>
            </ul>
            
            <h2>7. Contact information</h2>
            <p>For questions about cookie usage, contact: info@thesim.com</p>
          `
        }
      case 'th':
        return {
          title: 'นโยบายการใช้คุกกี้',
          content: `
            <h2>1. คุกกี้คืออะไร</h2>
            <p>คุกกี้คือไฟล์ข้อความขนาดเล็กที่เก็บไว้ในอุปกรณ์ของคุณเมื่อคุณเยี่ยมชมเว็บไซต์ของเรา ช่วยให้เราปรับปรุงประสบการณ์การใช้แพลตฟอร์มของคุณ</p>
            
            <h2>2. คุกกี้ที่เราใช้</h2>
            <p>เราใช้คุกกี้ประเภทต่อไปนี้:</p>
            <ul>
              <li><strong>คุกกี้ที่จำเป็น:</strong> รับประกันการทำงานพื้นฐานของเว็บไซต์</li>
              <li><strong>คุกกี้วิเคราะห์:</strong> ช่วยเข้าใจวิธีที่ผู้เยี่ยมชมโต้ตอบกับเว็บไซต์</li>
              <li><strong>คุกกี้การทำงาน:</strong> จดจำความชอบและการตั้งค่าของคุณ</li>
              <li><strong>คุกกี้การตลาด:</strong> ใช้เพื่อแสดงโฆษณาที่เกี่ยวข้อง</li>
            </ul>
            
            <h2>3. วัตถุประสงค์ของการใช้คุกกี้</h2>
            <p>เราใช้คุกกี้เพื่อ:</p>
            <ul>
              <li>รับประกันการทำงานของฟังก์ชันพื้นฐานของเว็บไซต์</li>
              <li>จดจำความชอบของคุณ (ภาษา, สกุลเงิน)</li>
              <li>วิเคราะห์การจราจรและพฤติกรรมผู้ใช้</li>
              <li>ปรับปรุงประสบการณ์ผู้ใช้</li>
              <li>ให้เนื้อหาที่ปรับแต่งเฉพาะบุคคล</li>
            </ul>
            
            <h2>4. การจัดการคุกกี้</h2>
            <p>คุณสามารถจัดการคุกกี้ผ่านการตั้งค่าเบราว์เซอร์ของคุณ:</p>
            <ul>
              <li>บล็อกคุกกี้ทั้งหมด</li>
              <li>อนุญาตเฉพาะคุกกี้ที่จำเป็น</li>
              <li>ลบคุกกี้ที่มีอยู่</li>
              <li>รับการแจ้งเตือนเกี่ยวกับคุกกี้ใหม่</li>
            </ul>
            
            <h2>5. บริการบุคคลที่สาม</h2>
            <p>เว็บไซต์ของเราอาจใช้บริการบุคคลที่สามที่ยังตั้งคุกกี้:</p>
            <ul>
              <li>Google Analytics สำหรับการวิเคราะห์การจราจร</li>
              <li>YouTube สำหรับการเล่นวิดีโอ</li>
              <li>เครือข่ายสังคมสำหรับการบูรณาการ</li>
            </ul>
            
            <h2>6. ระยะเวลาการเก็บรักษา</h2>
            <p>คุกกี้ต่างๆ มีระยะเวลาการเก็บรักษาที่แตกต่างกัน:</p>
            <ul>
              <li><strong>คุกกี้เซสชัน:</strong> ถูกลบเมื่อปิดเบราว์เซอร์</li>
              <li><strong>คุกกี้ถาวร:</strong> เก็บไว้จนกว่าจะหมดอายุหรือผู้ใช้ลบ</li>
            </ul>
            
            <h2>7. ข้อมูลการติดต่อ</h2>
            <p>สำหรับคำถามเกี่ยวกับการใช้คุกกี้ ติดต่อ: info@thesim.com</p>
          `
        }
      case 'zh':
        return {
          title: 'Cookie 政策',
          content: `
            <h2>1. 什么是 Cookie</h2>
            <p>Cookie 是在您访问我们网站时存储在您设备上的小型文本文件。它们帮助我们改善您使用平台的体验。</p>
            
            <h2>2. 我们使用的 Cookie</h2>
            <p>我们使用以下类型的 Cookie：</p>
            <ul>
              <li><strong>必要 Cookie：</strong>确保网站基本功能</li>
              <li><strong>分析 Cookie：</strong>帮助了解访问者如何与网站互动</li>
              <li><strong>功能 Cookie：</strong>记住您的偏好和设置</li>
              <li><strong>营销 Cookie：</strong>用于显示相关广告</li>
            </ul>
            
            <h2>3. 使用 Cookie 的目的</h2>
            <p>我们使用 Cookie 来：</p>
            <ul>
              <li>确保网站基本功能的运行</li>
              <li>记住您的偏好（语言、货币）</li>
              <li>分析流量和用户行为</li>
              <li>改善用户体验</li>
              <li>提供个性化内容</li>
            </ul>
            
            <h2>4. 管理 Cookie</h2>
            <p>您可以通过浏览器设置管理 Cookie：</p>
            <ul>
              <li>阻止所有 Cookie</li>
              <li>仅允许必要 Cookie</li>
              <li>删除现有 Cookie</li>
              <li>接收有关新 Cookie 的通知</li>
            </ul>
            
            <h2>5. 第三方服务</h2>
            <p>我们的网站可能使用也会设置 Cookie 的第三方服务：</p>
            <ul>
              <li>Google Analytics 用于流量分析</li>
              <li>YouTube 用于视频播放</li>
              <li>社交网络用于集成</li>
            </ul>
            
            <h2>6. 存储期限</h2>
            <p>不同的 Cookie 有不同的存储期限：</p>
            <ul>
              <li><strong>会话 Cookie：</strong>浏览器关闭时删除</li>
              <li><strong>持久 Cookie：</strong>存储到到期或用户删除</li>
            </ul>
            
            <h2>7. 联系信息</h2>
            <p>有关 Cookie 使用的问题，请联系：info@thesim.com</p>
          `
        }
      default:
        return {
          title: 'Cookie Policy',
          content: `
            <h2>1. What are cookies</h2>
            <p>Cookies are small text files that are stored on your device when you visit our website. They help us improve your experience using the platform.</p>
            
            <h2>2. What cookies we use</h2>
            <p>We use the following types of cookies:</p>
            <ul>
              <li><strong>Essential cookies:</strong> Ensure basic site functionality</li>
              <li><strong>Analytics cookies:</strong> Help understand how visitors interact with the site</li>
              <li><strong>Functional cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Marketing cookies:</strong> Used to show relevant advertising</li>
            </ul>
            
            <h2>3. Purpose of using cookies</h2>
            <p>We use cookies to:</p>
            <ul>
              <li>Ensure the operation of basic site functions</li>
              <li>Remember your preferences (language, currency)</li>
              <li>Analyze traffic and user behavior</li>
              <li>Improve user experience</li>
              <li>Provide personalized content</li>
            </ul>
            
            <h2>4. Managing cookies</h2>
            <p>You can manage cookies through your browser settings:</p>
            <ul>
              <li>Block all cookies</li>
              <li>Allow only essential cookies</li>
              <li>Delete existing cookies</li>
              <li>Receive notifications about new cookies</li>
            </ul>
            
            <h2>5. Third-party services</h2>
            <p>Our site may use third-party services that also set cookies:</p>
            <ul>
              <li>Google Analytics for traffic analysis</li>
              <li>YouTube for video playback</li>
              <li>Social networks for integration</li>
            </ul>
            
            <h2>6. Storage period</h2>
            <p>Different cookies have different storage periods:</p>
            <ul>
              <li><strong>Session cookies:</strong> Deleted when browser is closed</li>
              <li><strong>Persistent cookies:</strong> Stored until expiration or user deletion</li>
            </ul>
            
            <h2>7. Contact information</h2>
            <p>For questions about cookie usage, contact: info@thesim.com</p>
          `
        }
    }
  }

  const content = getCookiesContent()

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
