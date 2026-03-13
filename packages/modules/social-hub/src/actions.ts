"use server";

import { SocialPostRequest, SocialPostResponse } from "types";
import { fetchScheduledPosts, scheduleNewPost } from "./services/schedule";

export async function getPostsAction(): Promise<SocialPostResponse[]> {
  try {
    return await fetchScheduledPosts();
  } catch (error) {
    console.error("Failed to fetch social posts", error);
    return [];
  }
}

export async function createPostAction(request: SocialPostRequest): Promise<SocialPostResponse[]> {
  try {
    const posts = await scheduleNewPost(request);

    // In a real app, you would revalidate the panel path to trigger RSC refresh
    // revalidatePath('/marka/sosyal-medya');

    return posts;
  } catch (error) {
    console.error("Failed to schedule post", error);
    throw new Error("Failed to schedule post.");
  }
}
