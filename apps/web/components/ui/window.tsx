import { cn } from '@/lib/utils'
import { ComponentPropsWithoutRef, ElementType } from 'react'

type Props<T extends ElementType> = {
  as?: T
} & ComponentPropsWithoutRef<T>

export function Window<T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...props
}: Props<T>) {
  const Component = as || 'div'
  return (
    <Component
      {...props}
      className={cn(
        'border-2 border-muted-primary bg-background shadow-(--window-shadow) animate-window',
        'flex flex-col w-full',
        className
      )}
    >
      {children}
    </Component>
  )
}
