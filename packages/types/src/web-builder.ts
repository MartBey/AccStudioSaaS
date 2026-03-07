export interface BuilderTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
}

export interface WebBuilderRequest {
  brandDetails: string;
  colors: { primary: string; secondary: string };
  templateId: string;
}

export interface WebBuilderResponse {
  id: string;
  previewUrl: string;
  status: 'building' | 'published';
  createdAt: Date;
  mockHtml: string;
}
