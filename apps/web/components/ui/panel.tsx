import { cn } from '@/lib/utils'
import { type ComponentPropsWithoutRef, type ElementType } from 'react'

type Props<T extends ElementType> = {
  as?: T
} & ComponentPropsWithoutRef<T>

export function Panel<T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...props
}: Props<T>) {
  const Component = as || 'div'
  return (
    <Component
      className={cn('border border-muted-primary p-2', className)}
      {...props}
    >
      {children}
    </Component>
  )
}
