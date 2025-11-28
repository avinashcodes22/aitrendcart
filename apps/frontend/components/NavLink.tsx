"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type NavLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  to?: string;
  className?: string;
  activeClassName?: string;
  end?: boolean;
};

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, to, className, activeClassName, end, children, ...props }, ref) => {
    const pathname = usePathname();

    const target = href ?? to ?? "#";

    const isActive = end ? pathname === target : pathname.startsWith(target);

    return (
      <Link
        href={target}
        ref={ref}
        className={cn(className, isActive && activeClassName)}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";
