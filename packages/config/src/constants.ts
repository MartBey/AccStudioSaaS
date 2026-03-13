export const ROLES = {
  BRAND: "BRAND",
  AGENCY: "AGENCY",
  FREELANCER: "FREELANCER",
  ADMIN: "ADMIN",
} as const;

export const PLANS = {
  FREE: "FREE",
  PRO: "PRO",
  ENTERPRISE: "ENTERPRISE",
} as const;

export const ROUTES = {
  MARKETING: {
    HOME: "/",
    PRICING: "/pricing",
    ABOUT: "/about",
  },
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    PROJECTS: "/dashboard/projects",
    SETTINGS: "/dashboard/settings",
  },
} as const;
