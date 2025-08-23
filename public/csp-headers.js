// Принудительная установка CSP заголовков
(function() {
  'use strict';
  
  // Создаем meta тег для CSP
  function createCSPMeta() {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; media-src 'self'; object-src 'none';";
    
    // Добавляем в head
    const head = document.getElementsByTagName('head')[0];
    if (head) {
      head.appendChild(meta);
    }
  }
  
  // Запускаем после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createCSPMeta);
  } else {
    createCSPMeta();
  }
})();
