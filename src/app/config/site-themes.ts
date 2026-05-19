export type SiteThemePreset =
  | "industrial_navy"
  | "slb_blue"
  | "petrochina_red"
  | "anton_blue_red"
  | "jereh_orange"
  | "halliburton_red"
  | "baker_green"
  | "finance_blue"
  | "health_teal"
  | "premium_black_gold"
  | "tech_indigo_cyan"
  | "renewable_green"
  | "industrial_graphite_yellow";

export interface SiteTheme {
  label: string;
  cssVars: Record<string, string>;
}

export const defaultThemePreset: SiteThemePreset = "industrial_navy";

export const siteThemes: Record<SiteThemePreset, SiteTheme> = {
  industrial_navy: {
    label: "能源行业 - 工业深蓝橙（当前默认）",
    cssVars: {
      "--theme-brand": "#003865",
      "--theme-brand-hover": "#002845",
      "--theme-accent": "#E63E00",
      "--theme-accent-hover": "#C03400",
      "--theme-footer": "#002845",
      "--theme-table-head": "#D90D12",
      "--theme-breadcrumb": "#FED7AA",
      "--theme-breadcrumb-muted": "rgba(255, 237, 213, 0.72)",
    },
  },
  slb_blue: {
    label: "能源行业 - SLB 强蓝科技",
    cssVars: {
      "--theme-brand": "#0014DC",
      "--theme-brand-hover": "#000E9E",
      "--theme-accent": "#004CFF",
      "--theme-accent-hover": "#0037C2",
      "--theme-footer": "#000B66",
      "--theme-table-head": "#0014DC",
      "--theme-breadcrumb": "#DBEAFE",
      "--theme-breadcrumb-muted": "rgba(219, 234, 254, 0.72)",
    },
  },
  petrochina_red: {
    label: "能源行业 - 中石油红金",
    cssVars: {
      "--theme-brand": "#D70000",
      "--theme-brand-hover": "#A90000",
      "--theme-accent": "#F6A800",
      "--theme-accent-hover": "#C98600",
      "--theme-footer": "#8F0000",
      "--theme-table-head": "#D70000",
      "--theme-breadcrumb": "#FFE4E6",
      "--theme-breadcrumb-muted": "rgba(255, 228, 230, 0.72)",
    },
  },
  anton_blue_red: {
    label: "能源行业 - 安东深蓝红",
    cssVars: {
      "--theme-brand": "#0B1A78",
      "--theme-brand-hover": "#071154",
      "--theme-accent": "#C8002B",
      "--theme-accent-hover": "#9F0022",
      "--theme-footer": "#071154",
      "--theme-table-head": "#C8002B",
      "--theme-breadcrumb": "#DBEAFE",
      "--theme-breadcrumb-muted": "rgba(219, 234, 254, 0.72)",
    },
  },
  jereh_orange: {
    label: "能源行业 - 杰瑞橙青",
    cssVars: {
      "--theme-brand": "#0F5F72",
      "--theme-brand-hover": "#0A4654",
      "--theme-accent": "#F05A28",
      "--theme-accent-hover": "#C9471E",
      "--theme-footer": "#083B47",
      "--theme-table-head": "#F05A28",
      "--theme-breadcrumb": "#FFEDD5",
      "--theme-breadcrumb-muted": "rgba(255, 237, 213, 0.72)",
    },
  },
  halliburton_red: {
    label: "能源行业 - Halliburton 红黑",
    cssVars: {
      "--theme-brand": "#1F2328",
      "--theme-brand-hover": "#111418",
      "--theme-accent": "#D0021B",
      "--theme-accent-hover": "#A80016",
      "--theme-footer": "#15171A",
      "--theme-table-head": "#D0021B",
      "--theme-breadcrumb": "#FEE2E2",
      "--theme-breadcrumb-muted": "rgba(254, 226, 226, 0.72)",
    },
  },
  baker_green: {
    label: "能源行业 - Baker Hughes 绿青",
    cssVars: {
      "--theme-brand": "#003C3C",
      "--theme-brand-hover": "#002A2A",
      "--theme-accent": "#00A88E",
      "--theme-accent-hover": "#007F6B",
      "--theme-footer": "#002A2A",
      "--theme-table-head": "#007F6B",
      "--theme-breadcrumb": "#CCFBF1",
      "--theme-breadcrumb-muted": "rgba(204, 251, 241, 0.72)",
    },
  },
  finance_blue: {
    label: "跨行业 - 金融信任蓝",
    cssVars: {
      "--theme-brand": "#0B3A75",
      "--theme-brand-hover": "#072A55",
      "--theme-accent": "#2F80ED",
      "--theme-accent-hover": "#1D62B8",
      "--theme-footer": "#061F40",
      "--theme-table-head": "#0B3A75",
      "--theme-breadcrumb": "#DBEAFE",
      "--theme-breadcrumb-muted": "rgba(219, 234, 254, 0.72)",
    },
  },
  health_teal: {
    label: "跨行业 - 医疗洁净青",
    cssVars: {
      "--theme-brand": "#006D77",
      "--theme-brand-hover": "#004F56",
      "--theme-accent": "#38BDF8",
      "--theme-accent-hover": "#0EA5E9",
      "--theme-footer": "#003F45",
      "--theme-table-head": "#006D77",
      "--theme-breadcrumb": "#CCFBF1",
      "--theme-breadcrumb-muted": "rgba(204, 251, 241, 0.72)",
    },
  },
  premium_black_gold: {
    label: "跨行业 - 高端黑金",
    cssVars: {
      "--theme-brand": "#111827",
      "--theme-brand-hover": "#030712",
      "--theme-accent": "#C9A227",
      "--theme-accent-hover": "#9E7F1F",
      "--theme-footer": "#030712",
      "--theme-table-head": "#111827",
      "--theme-breadcrumb": "#FEF3C7",
      "--theme-breadcrumb-muted": "rgba(254, 243, 199, 0.72)",
    },
  },
  tech_indigo_cyan: {
    label: "跨行业 - 科技紫蓝",
    cssVars: {
      "--theme-brand": "#312E81",
      "--theme-brand-hover": "#1E1B4B",
      "--theme-accent": "#06B6D4",
      "--theme-accent-hover": "#0891B2",
      "--theme-footer": "#1E1B4B",
      "--theme-table-head": "#312E81",
      "--theme-breadcrumb": "#E0E7FF",
      "--theme-breadcrumb-muted": "rgba(224, 231, 255, 0.72)",
    },
  },
  renewable_green: {
    label: "跨行业 - 新能源绿",
    cssVars: {
      "--theme-brand": "#14532D",
      "--theme-brand-hover": "#052E16",
      "--theme-accent": "#22C55E",
      "--theme-accent-hover": "#16A34A",
      "--theme-footer": "#052E16",
      "--theme-table-head": "#14532D",
      "--theme-breadcrumb": "#DCFCE7",
      "--theme-breadcrumb-muted": "rgba(220, 252, 231, 0.72)",
    },
  },
  industrial_graphite_yellow: {
    label: "跨行业 - 工业石墨黄",
    cssVars: {
      "--theme-brand": "#2B2F33",
      "--theme-brand-hover": "#171A1D",
      "--theme-accent": "#F59E0B",
      "--theme-accent-hover": "#B45309",
      "--theme-footer": "#171A1D",
      "--theme-table-head": "#2B2F33",
      "--theme-breadcrumb": "#FEF3C7",
      "--theme-breadcrumb-muted": "rgba(254, 243, 199, 0.72)",
    },
  },
};

export function normalizeThemePreset(value: unknown): SiteThemePreset {
  return typeof value === "string" && value in siteThemes
    ? (value as SiteThemePreset)
    : defaultThemePreset;
}

export function getSiteTheme(value: unknown): SiteTheme {
  return siteThemes[normalizeThemePreset(value)];
}
