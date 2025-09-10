'use client'

import { ReactNode } from 'react'

/**
 * Простая заглушка без Framer Motion для лучшей производительности
 */
export default function LazyMotionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

// Заглушка для m компонентов без анимаций
export const m = {
  div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
  p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}

