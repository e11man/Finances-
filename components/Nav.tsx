"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projection", label: "Projection" },
  { href: "/settings", label: "Settings" },
  { href: "/support", label: "Support" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-surface shadow mb-6">
      <div className="flex items-center gap-6 px-4 py-3 max-w-6xl mx-auto">
        <span className="font-bold text-primary">FinPlan</span>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "text-sm hover:text-primary", 
              pathname?.startsWith(link.href) ? "font-medium text-primary" : "text-gray-600"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}