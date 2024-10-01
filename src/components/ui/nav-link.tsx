import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react" // You may need to import ReactNode

interface NavLinkProps {
  href: string
  exact?: boolean
  children: ReactNode
  className?: string
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  exact,
  children,
  className,
  ...props
}) => {
  const asPath = usePathname()
  const active = "font-semibold text-primary active group"
  const isActive = exact ? asPath === href : asPath?.startsWith(href)
  if (isActive) {
    className = `${className || ""} ${active}`.trim() // Make sure to handle className being undefined
  }

  return (
    <Link
      className={cn(
        "hover:underline cursor-pointer text-gray-600 hover:text-primary",
        className
      )}
      {...props}
      href={href}
    >
      {children}
    </Link>
  )
}