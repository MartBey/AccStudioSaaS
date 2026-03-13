"use client";

import { MessageCircle, Send, User, Wifi, WifiOff } from "lucide-react";
import type { Channel } from "pusher-js";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Badge, Button, Card, CardContent, Input, toast } from "ui";

import { getProjectMessages, sendMessage } from "@/app/_actions/message-actions";
import { getProjectChannel, getPusherClient, PUSHER_EVENTS } from "@/lib/pusher-client";

interface MessageItem {
  id: string;
  content: string;
  senderName: string;
  senderId: string;
  senderImage: string | null;
  isOwn: boolean;
  createdAt: string;
}

interface ThreadItem {
  projectId: string;
  projectName: string;
  lastMessage: { content: string; senderName: string; createdAt: string } | null;
  totalMessages: number;
}

interface MesajlarClientProps {
  threads: ThreadItem[];
  rolePrefix: string;
}

export default function MesajlarClient({ threads }: MesajlarClientProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<Channel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedThread = threads.find((t) => t.projectId === selectedProject);

  // Otomatik scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Pusher bağlantısı ve kanal aboneliği
  useEffect(() => {
    if (!selectedProject) return;

    const pusher = getPusherClient();
    if (!pusher) return;

    // Bağlantı durumu
    pusher.connection.bind("connected", () => setIsConnected(true));
    pusher.connection.bind("disconnected", () => setIsConnected(false));
    setIsConnected(pusher.connection.state === "connected");

    // Kanala abone ol
    const channelName = getProjectChannel(selectedProject);
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    // Yeni mesaj geldiğinde
    channel.bind(PUSHER_EVENTS.NEW_MESSAGE, (data: Omit<MessageItem, "isOwn">) => {
      setMessages((prev) => {
        // Duplikasyon kontrolü
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, { ...data, isOwn: false }];
      });
      setTypingUser(null);
    });

    // Yazıyor göstergesi
    channel.bind(PUSHER_EVENTS.TYPING, (data: { userName: string }) => {
      setTypingUser(data.userName);
    });
    channel.bind(PUSHER_EVENTS.STOP_TYPING, () => {
      setTypingUser(null);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      channelRef.current = null;
    };
  }, [selectedProject]);

  // Mesajları yükle
  const loadMessages = useCallback(async (projectId: string) => {
    setSelectedProject(projectId);
    setLoadingMessages(true);
    try {
      const msgs = await getProjectMessages(projectId);
      setMessages(msgs);
    } catch {
      setMessages([]);
    }
    setLoadingMessages(false);
  }, []);

  // Mesaj gönder
  const handleSend = () => {
    if (!newMessage.trim() || !selectedProject) return;
    const content = newMessage;
    setNewMessage("");

    startTransition(async () => {
      const res = await sendMessage({ projectId: selectedProject, content });
      if (res.success) {
        // Pusher yoksa mesajları yeniden yükle
        if (!isConnected) {
          const msgs = await getProjectMessages(selectedProject);
          setMessages(msgs);
        }
      } else {
        toast.error(res.error || "Mesaj gönderilemedi.");
      }
    });
  };

  // Yazıyor bildirimi
  const handleTyping = () => {
    if (!channelRef.current) return;

    try {
      channelRef.current.trigger(PUSHER_EVENTS.TYPING, { userName: "Kullanıcı" });
    } catch {
      /* client events Pusher planına bağlı */
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      try {
        channelRef.current?.trigger(PUSHER_EVENTS.STOP_TYPING, {});
      } catch {
        /* silent */
      }
    }, 2000);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} dk önce`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat önce`;
    return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  };

  return (
    <div className="flex flex-col gap-4" style={{ height: "calc(100vh - 130px)" }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mesajlar</h1>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-200 bg-emerald-50 text-xs text-emerald-600"
            >
              <Wifi className="h-3 w-3" />
              Canlı
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5 text-xs text-muted-foreground">
              <WifiOff className="h-3 w-3" />
              Çevrimdışı
            </Badge>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        {/* Thread List */}
        <Card className="flex w-80 flex-shrink-0 flex-col">
          <CardContent className="flex-1 overflow-y-auto p-3">
            {threads.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <MessageCircle className="mx-auto mb-2 h-8 w-8 opacity-40" />
                Henüz mesaj yok
              </div>
            ) : (
              <div className="space-y-1">
                {threads.map((t) => (
                  <button
                    key={t.projectId}
                    onClick={() => loadMessages(t.projectId)}
                    className={`w-full rounded-lg p-3 text-left transition-colors ${
                      selectedProject === t.projectId
                        ? "border border-primary/20 bg-primary/10"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="truncate text-sm font-semibold">{t.projectName}</h3>
                      {t.totalMessages > 0 && (
                        <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                          {t.totalMessages}
                        </Badge>
                      )}
                    </div>
                    {t.lastMessage ? (
                      <div className="mt-1">
                        <p className="truncate text-xs text-muted-foreground">
                          <span className="font-medium">{t.lastMessage.senderName}:</span>{" "}
                          {t.lastMessage.content}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground/50">
                          {formatDate(t.lastMessage.createdAt)}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-muted-foreground/50">Henüz mesaj yok</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex min-w-0 flex-1 flex-col">
          {!selectedProject ? (
            <CardContent className="flex flex-1 items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="mx-auto mb-3 h-12 w-12 opacity-30" />
                <p>Mesajlaşmak için sol panelden bir proje seçin</p>
              </div>
            </CardContent>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="font-semibold">{selectedThread?.projectName}</h2>
                {isConnected && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    Canlı bağlantı
                  </span>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {loadingMessages ? (
                  <div className="py-8 text-center text-muted-foreground">Yükleniyor...</div>
                ) : messages.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    İlk mesajı gönderin!
                  </div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`flex ${m.isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] ${m.isOwn ? "order-1" : ""}`}>
                        {!m.isOwn && (
                          <p className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" /> {m.senderName}
                          </p>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2.5 ${
                            m.isOwn
                              ? "rounded-br-md bg-primary text-primary-foreground"
                              : "rounded-bl-md bg-muted"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                        </div>
                        <p
                          className={`mt-1 text-[10px] text-muted-foreground/50 ${m.isOwn ? "text-right" : ""}`}
                        >
                          {formatTime(m.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {/* Yazıyor göstergesi */}
                {typingUser && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground duration-300 animate-in fade-in">
                    <div className="flex gap-1">
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span>{typingUser} yazıyor...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2 border-t p-3">
                <Input
                  placeholder="Mesajınızı yazın..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={isPending || !newMessage.trim()}
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
