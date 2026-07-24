import * as icons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

interface IconProps extends LucideProps {
  name: string
}

// Renders a Lucide icon by name; falls back to a neutral square.
export function Icon({ name, ...props }: IconProps) {
  const Cmp = (icons as unknown as Record<string, React.ComponentType<LucideProps>>)[name]
  const Fallback = icons.Square
  const C = Cmp ?? Fallback
  return <C {...props} />
}
