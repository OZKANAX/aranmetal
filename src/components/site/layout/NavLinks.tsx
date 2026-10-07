"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../ui/Icon";
import type { NavItem } from "./nav";

export function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  const roots = item.match ?? [item.href];
  return roots.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

const linkBase = "nav-line flex items-center gap-1 text-small font-medium transition-colors duration-200";

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="hidden xl:flex items-center self-stretch gap-8 2xl:gap-10">
      {items.map((item) => {
        const active = isActive(pathname, item);
        const state = active ? "text-white" : "text-on-navy-2 hover:text-white";

        if (!item.children) {
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`${linkBase} ${state}`}>
              {item.label}
            </Link>
          );
        }

        // Açılır menü: fareyle ve klavyeyle (focus-within) açılır
        return (
          <div key={item.label} className="group/dd relative flex self-stretch items-center">
            <Link href={item.href} aria-haspopup="true" aria-current={active ? "page" : undefined} className={`${linkBase} ${state}`}>
              {item.label}
              <Icon
                name="expand_more"
                className="text-[18px] text-steel transition-transform duration-300 ease-out-quint group-hover/dd:rotate-180 group-focus-within/dd:rotate-180"
              />
            </Link>
            <div className="invisible opacity-0 -translate-y-1 group-hover/dd:visible group-hover/dd:opacity-100 group-hover/dd:translate-y-0 group-focus-within/dd:visible group-focus-within/dd:opacity-100 group-focus-within/dd:translate-y-0 transition-[opacity,transform,visibility] duration-300 ease-out-quint absolute -left-5 top-full z-50">
              <ul className="min-w-64 bg-graphite-2 border border-graphite-rule py-2 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]">
                {item.children.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      className="group flex items-center justify-between gap-6 px-5 py-2.5 text-small text-on-navy-2 hover:text-white hover:bg-graphite-3 transition-colors"
                    >
                      {c.label}
                      <Icon name="arrow_forward" className="arrow-nudge text-[16px] text-steel opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
