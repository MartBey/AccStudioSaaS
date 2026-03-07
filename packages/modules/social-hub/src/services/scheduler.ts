export type SocialPlatform = "twitter" | "linkedin" | "instagram" | "facebook";

export interface PostSchedule {
  content: string;
  platforms: SocialPlatform[];
  scheduledAt: Date;
  mediaUrls?: string[];
}

export async function schedulePost(post: PostSchedule): Promise<{ id: string; status: "scheduled" | "failed" }> {
  // TODO: Implement actual social media API integrations
  return {
    id: "mock_post_123",
    status: "scheduled"
  };
}
