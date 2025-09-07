// Полное подавление ошибок от расширений браузера
(function() {
  'use strict';
  
  const originalConsole = {
    error: console.error,
    warn: console.warn,
    log: console.log
  };

  const shouldSuppress = (message) => {
    if (!message) return false;
    const msg = message.toString();
    return (
      msg.includes('chrome-extension://') ||
      msg.includes('moz-extension://') ||
      msg.includes('safari-extension://') ||
      msg.includes('zmstat.com') ||
      msg.includes('gtmpx.com') ||
      msg.includes('Cannot read properties of null') ||
      msg.includes('message channel closed') ||
      msg.includes('Refused to load the script') ||
      msg.includes('Content Security Policy') ||
      msg.includes('CSP') ||
      msg.includes('Error handling response') ||
      msg.includes('Uncaught (in promise) Error') ||
      msg.includes('TypeError: Cannot read properties of null')
    );
  };

  // Переопределяем console методы
  console.error = function(...args) {
    if (shouldSuppress(args[0])) return;
    originalConsole.error.apply(console, args);
  };

  console.warn = function(...args) {
    if (shouldSuppress(args[0])) return;
    originalConsole.warn.apply(console, args);
  };

  console.log = function(...args) {
    if (shouldSuppress(args[0])) return;
    originalConsole.log.apply(console, args);
  };

  // Подавляем глобальные ошибки
  window.addEventListener('error', function(event) {
    if (shouldSuppress(event.message)) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);

  window.addEventListener('unhandledrejection', function(event) {
    if (shouldSuppress(event.reason)) {
      event.preventDefault();
      return false;
    }
  });

  // Подавляем CSP ошибки
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
            const src = node.src;
            if (src && (src.includes('zmstat.com') || src.includes('gtmpx.com'))) {
              node.remove();
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('🔇 Error suppressor loaded - расширения браузера заблокированы');
})();
