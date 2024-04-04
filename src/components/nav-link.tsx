import { ComponentProps } from "react"

interface NavLinkProps extends ComponentProps<'a'> {
  children: string
}

export function NavLink({ children, ...restProps }: NavLinkProps) {
  return (
    <a {...restProps} className="font-medium text-sm">
      {children}
    </a>
  )
}