import Link from "next/link";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "onDark" | "outlineOnDark";

const variants: Record<Variant, string> = {
  primary: "btn-copper",
  secondary: "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  onDark: "bg-bone text-ink hover:bg-white",
  outlineOnDark: "border border-white/30 text-white hover:border-white hover:bg-white hover:text-ink",
};

const sizes = {
  sm: "h-10 px-4 text-small",
  md: "h-12 px-6 text-body",
  lg: "h-14 px-7 text-body",
};

export const buttonClass = (variant: Variant = "primary", size: keyof typeof sizes = "md") =>
  `group inline-flex items-center justify-center gap-2.5 rounded-none font-semibold whitespace-nowrap transition-[color,background-color,border-color,transform] duration-200 ${variants[variant]} ${sizes[size]}`;

export function ButtonLink({
  href,
  children,
  icon,
  trailingIcon,
  variant = "primary",
  size = "md",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  icon?: string;
  trailingIcon?: string;
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <Link href={href} className={`${buttonClass(variant, size)} ${className}`}>
      {icon && <Icon name={icon} className="text-[20px]" />}
      <span>{children}</span>
      {trailingIcon && (
        <Icon name={trailingIcon} className="arrow-nudge text-[18px]" />
      )}
    </Link>
  );
}
