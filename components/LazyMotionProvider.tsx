'use client'

import { ReactNode, forwardRef } from 'react'

/**
 * Простая заглушка без Framer Motion для лучшей производительности
 */
export default function LazyMotionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

// Заглушка для m компонентов без анимаций с поддержкой refs
export const m = {
  div: forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => 
    <div ref={ref} {...props}>{children}</div>
  ),
  section: forwardRef<HTMLElement, any>(({ children, ...props }, ref) => 
    <section ref={ref} {...props}>{children}</section>
  ),
  button: forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => 
    <button ref={ref} {...props}>{children}</button>
  ),
  h1: forwardRef<HTMLHeadingElement, any>(({ children, ...props }, ref) => 
    <h1 ref={ref} {...props}>{children}</h1>
  ),
  h2: forwardRef<HTMLHeadingElement, any>(({ children, ...props }, ref) => 
    <h2 ref={ref} {...props}>{children}</h2>
  ),
  h3: forwardRef<HTMLHeadingElement, any>(({ children, ...props }, ref) => 
    <h3 ref={ref} {...props}>{children}</h3>
  ),
  p: forwardRef<HTMLParagraphElement, any>(({ children, ...props }, ref) => 
    <p ref={ref} {...props}>{children}</p>
  ),
  span: forwardRef<HTMLSpanElement, any>(({ children, ...props }, ref) => 
    <span ref={ref} {...props}>{children}</span>
  ),
}

// Заглушка для AnimatePresence
export const AnimatePresence = ({ children }: { children: ReactNode }) => <>{children}</>

