export type SocialPlatform = "instagram" | "linkedin" | "twitter" | "facebook";
export type PostStatus = "draft" | "scheduled" | "published" | "failed";

export interface SocialPostRequest {
  content: string;
  platforms: SocialPlatform[];
  scheduledFor?: Date;
  mediaUrls?: string[];
}

export interface SocialPostResponse {
  id: string;
  content: string;
  platform: SocialPlatform;
  scheduledFor: Date;
  status: PostStatus;
  mediaUrls: string[];
  createdAt: Date;
}
