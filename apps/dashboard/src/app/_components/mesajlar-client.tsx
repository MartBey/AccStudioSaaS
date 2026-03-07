"use client";

import { useState, useRef, useEffect, useTransition, useCallback } from "react";
import { 
  Card, CardContent,
  Button, Input, Badge, toast,
} from "ui";
import { MessageCircle, Send, User, Wifi, WifiOff } from "lucide-react";
import { sendMessage, getProjectMessages } from "@/app/_actions/message-actions";
import { getPusherClient, getProjectChannel, PUSHER_EVENTS } from "@/lib/pusher-client";
import type { Channel } from "pusher-js";

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

  const selectedThread = threads.find(t => t.projectId === selectedProject);

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
      setMessages(prev => {
        // Duplikasyon kontrolü
        if (prev.some(m => m.id === data.id)) return prev;
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
    } catch { setMessages([]); }
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
    } catch { /* client events Pusher planına bağlı */ }
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      try {
        channelRef.current?.trigger(PUSHER_EVENTS.STOP_TYPING, {});
      } catch { /* silent */ }
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
            <Badge variant="outline" className="text-xs gap-1.5 text-emerald-600 border-emerald-200 bg-emerald-50">
              <Wifi className="h-3 w-3" />
              Canlı
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs gap-1.5 text-muted-foreground">
              <WifiOff className="h-3 w-3" />
              Çevrimdışı
            </Badge>
          )}
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Thread List */}
        <Card className="w-80 flex-shrink-0 flex flex-col">
          <CardContent className="p-3 flex-1 overflow-y-auto">
            {threads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                Henüz mesaj yok
              </div>
            ) : (
              <div className="space-y-1">
                {threads.map(t => (
                  <button
                    key={t.projectId}
                    onClick={() => loadMessages(t.projectId)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedProject === t.projectId ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm truncate">{t.projectName}</h3>
                      {t.totalMessages > 0 && (
                        <Badge variant="secondary" className="text-xs h-5 px-1.5">{t.totalMessages}</Badge>
                      )}
                    </div>
                    {t.lastMessage ? (
                      <div className="mt-1">
                        <p className="text-xs text-muted-foreground truncate">
                          <span className="font-medium">{t.lastMessage.senderName}:</span> {t.lastMessage.content}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50 mt-0.5">{formatDate(t.lastMessage.createdAt)}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground/50 mt-1">Henüz mesaj yok</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col min-w-0">
          {!selectedProject ? (
            <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Mesajlaşmak için sol panelden bir proje seçin</p>
              </div>
            </CardContent>
          ) : (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <h2 className="font-semibold">{selectedThread?.projectName}</h2>
                {isConnected && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Canlı bağlantı
                  </span>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMessages ? (
                  <div className="text-center text-muted-foreground py-8">Yükleniyor...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 text-sm">
                    İlk mesajı gönderin!
                  </div>
                ) : (
                  messages.map(m => (
                    <div key={m.id} className={`flex ${m.isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] ${m.isOwn ? "order-1" : ""}`}>
                        {!m.isOwn && (
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <User className="h-3 w-3" /> {m.senderName}
                          </p>
                        )}
                        <div className={`rounded-2xl px-4 py-2.5 ${
                          m.isOwn 
                            ? "bg-primary text-primary-foreground rounded-br-md" 
                            : "bg-muted rounded-bl-md"
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                        </div>
                        <p className={`text-[10px] text-muted-foreground/50 mt-1 ${m.isOwn ? "text-right" : ""}`}>
                          {formatTime(m.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Yazıyor göstergesi */}
                {typingUser && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground animate-in fade-in duration-300">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span>{typingUser} yazıyor...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t flex gap-2">
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
                <Button onClick={handleSend} disabled={isPending || !newMessage.trim()} size="icon" className="flex-shrink-0">
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
