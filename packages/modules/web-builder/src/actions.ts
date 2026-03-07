"use server";

import { WebBuilderRequest, WebBuilderResponse } from "types";
import { createLandingPage } from "./services/build";

export async function buildSiteAction(request: WebBuilderRequest): Promise<WebBuilderResponse> {
  try {
    const site = await createLandingPage(request);
    return site;
  } catch (error) {
    console.error("Failed to build landing page", error);
    throw new Error("Failed to generate site.");
  }
}
