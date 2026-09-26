import type { ButtonHTMLAttributes, Ref } from 'react'
import { buttonClassName, type ButtonVariant } from '../../utils/buttonClassName'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  ref?: Ref<HTMLButtonElement>
}

/** Reusable button primitive with the application's standard visual language. */
export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ref,
  ...rest
}: ButtonProps) {
  return <button ref={ref} type={type} className={buttonClassName(variant, className)} {...rest} />
}
