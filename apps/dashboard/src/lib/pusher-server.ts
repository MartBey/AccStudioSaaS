import PusherServer from "pusher";

let pusherInstance: PusherServer | null = null;

export function getPusherServer(): PusherServer {
  if (pusherInstance) return pusherInstance;
  
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.PUSHER_CLUSTER || "eu";

  if (!appId || !key || !secret) {
    throw new Error(
      "Pusher ortam değişkenleri eksik. .env dosyasına PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET ekleyin."
    );
  }

  pusherInstance = new PusherServer({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  });

  return pusherInstance;
}

// Pusher kanalı oluşturmak için yardımcı
export function getProjectChannel(projectId: string) {
  return `project-${projectId}`;
}

// Event isimleri
export const PUSHER_EVENTS = {
  NEW_MESSAGE: "new-message",
  TYPING: "client-typing",
  STOP_TYPING: "client-stop-typing",
} as const;
