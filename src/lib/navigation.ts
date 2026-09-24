// Navigation configuration for the site
export interface NavLink {
  path: string;
  label: string;
  /** i18n key; when set it overrides `label` at render time. */
  labelKey?: string;
  primary?: boolean;
  /** External link: rendered as a plain <a> (new tab) instead of a router <Link>. */
  external?: boolean;
}

export const navigationConfig = {
  primary: [
    { path: "/", label: "Home", labelKey: "nav.home", primary: true },
    { path: "/project/behind-the-lens-photos", label: "Behind The Lens", primary: true },
    { path: "/project/in-the-rye-photos", label: "In The Rye - Photos", primary: true },
    { path: "/project/in-the-rye-videos", label: "In The Rye - Videos", primary: true },
    { path: "/project/same-as-you-photos", label: "Same As You", primary: true },
    { path: "/project/same-as-you-videos", label: "Same As You - Videos", primary: true },
    { path: "/project/behind-the-lens-videos", label: "Behind The Lens - Videos", primary: true },
    { path: "/services", label: "Services", labelKey: "nav.services", primary: true },
    { path: "/reservation", label: "Book a session", labelKey: "nav.booking", primary: true },
    { path: "/info", label: "Information", labelKey: "nav.info", primary: true },
    {
      path: "https://www.wayne-web.com",
      label: "Get your digital image developed",
      labelKey: "nav.growDigitalImage",
      primary: true,
      external: true,
    },
  ] as NavLink[],

  footer: [
    { path: "/", label: "Home", labelKey: "nav.home" },
    { path: "/services", label: "Services", labelKey: "nav.services" },
    { path: "/reservation", label: "Book a session", labelKey: "nav.booking" },
    { path: "/info", label: "Information", labelKey: "nav.info" },
  ] as NavLink[],

};

// Get all navigation links
export function getAllNavLinks(): NavLink[] {
  return navigationConfig.primary;
}

// Get primary navigation for header
export function getPrimaryNav(): NavLink[] {
  return navigationConfig.primary;
}

// Get footer navigation
export function getFooterNav(): NavLink[] {
  return navigationConfig.footer;
}