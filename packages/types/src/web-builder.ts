export interface ThemeConfig {
  primary: string;
  font: string;
}

export interface BuilderTemplate {
  name: string;
  content: string; // Craft.js JSON
  theme?: ThemeConfig;
  thumbnail?: string;
}

export interface Site {
  id: string;
  name: string;
  domain?: string | null;
  content?: any;
  themeConfig?: any; // Site-wide theme settings
  createdAt: Date;
  updatedAt: Date;
}

// Legacy compatibility
export interface WebBuilderRequest {
  brandDetails: string;
  colors: {
    primary: string;
    secondary: string;
  };
  templateId?: string;
  description?: string;
}

export interface WebBuilderResponse {
  id: string;
  previewUrl: string;
  html?: string;
  css?: string;
  mockHtml?: string;
  status?: string;
  createdAt?: Date;
  siteStructure?: any;
}
