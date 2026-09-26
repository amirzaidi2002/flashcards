import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
}

/**
 * Consistent, responsive width/padding wrapper used around every page's
 * content so all major pages render inside the same visual rhythm.
 */
export function PageContainer({ children }: PageContainerProps) {
  return <div className="page-container">{children}</div>
}
