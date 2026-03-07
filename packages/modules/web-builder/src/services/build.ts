import { WebBuilderRequest, WebBuilderResponse } from "types";

export async function createLandingPage(request: WebBuilderRequest): Promise<WebBuilderResponse> {
  // Simulate heavy processing for compiling a template
  await new Promise(resolve => setTimeout(resolve, 3000));

  return {
    id: `site_${Math.random().toString(36).substring(7)}`,
    previewUrl: `https://${request.brandDetails.toLowerCase().replace(/[^a-z0-9]/g, '')}.accstudio.app/preview`,
    status: 'published',
    createdAt: new Date(),
    mockHtml: `
      <div style="background-color: ${request.colors.primary}; color: white; padding: 4rem; text-align: center;">
        <h1>${request.brandDetails} Kampanyası Yola Çıktı!</h1>
        <p>Seçtiğiniz ${request.templateId} tasarımı başarıyla uygulandı.</p>
      </div>
    `
  };
}
