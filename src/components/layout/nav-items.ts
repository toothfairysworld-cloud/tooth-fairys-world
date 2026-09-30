export interface NavItemDef {
  href: string;
  key:
    | "home"
    | "about"
    | "experience"
    | "cases"
    | "certificates"
    | "research"
    | "volunteering"
    | "blog"
    | "faq"
    | "resources"
    | "testimonials"
    | "contact";
}

/** Primary links visible in the desktop navbar */
export const primaryNavItems: NavItemDef[] = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/experience", key: "experience" },
  { href: "/cases", key: "cases" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
];

/** Secondary section pages accessible via the More dropdown */
export const moreNavItems: NavItemDef[] = [
  { href: "/certificates", key: "certificates" },
  { href: "/research", key: "research" },
  { href: "/volunteering", key: "volunteering" },
  { href: "/faq", key: "faq" },
  { href: "/resources", key: "resources" },
  { href: "/testimonials", key: "testimonials" },
];

/** Complete list of all section pages for mobile drawer and sitemaps */
export const navItems: NavItemDef[] = [
  ...primaryNavItems.slice(0, 4),
  ...moreNavItems,
  ...primaryNavItems.slice(4),
];
