"use client";

import PusherClient from "pusher-js";

let pusherInstance: PusherClient | null = null;

export function getPusherClient(): PusherClient | null {
  if (typeof window === "undefined") return null;

  if (pusherInstance) return pusherInstance;

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu";

  if (!key) {
    console.warn("NEXT_PUBLIC_PUSHER_KEY tanımlı değil. Real-time mesajlaşma devre dışı.");
    return null;
  }

  pusherInstance = new PusherClient(key, {
    cluster,
    forceTLS: true,
  });

  return pusherInstance;
}

// Kanal ismi yardımcısı
export function getProjectChannel(projectId: string) {
  return `project-${projectId}`;
}

// Event isimleri
export const PUSHER_EVENTS = {
  NEW_MESSAGE: "new-message",
  TYPING: "client-typing",
  STOP_TYPING: "client-stop-typing",
} as const;
