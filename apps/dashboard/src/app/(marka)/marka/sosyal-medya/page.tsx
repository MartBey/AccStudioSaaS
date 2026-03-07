"use client";

import { useState, useEffect } from "react";
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardContent, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ui";
import { Calendar, Plus, Instagram, Linkedin, Twitter, ExternalLink, Clock, Send, CheckCircle2 } from "lucide-react";
import { getPostsAction, createPostAction } from "social-hub";
import { SocialPostResponse, SocialPlatform } from "types";

export default function SocialHubPage() {
  const [posts, setPosts] = useState<SocialPostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const data = await getPostsAction();
    setPosts(data);
    setLoading(false);
  };

  const handleSchedule = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    
    try {
      // Schedule exactly for tomorrow this time via the mock
      const scheduledDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      
      const newPosts = await createPostAction({
        content,
        platforms: [platform],
        scheduledFor: scheduledDate
      });
      
      // Update local state without waiting for a full refetch
      setPosts(prev => [...prev, ...newPosts].sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()));
      setContent("");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const getPlatformIcon = (plt: SocialPlatform) => {
    switch (plt) {
      case "instagram": return <Instagram className="h-5 w-5 text-pink-600" />;
      case "linkedin": return <Linkedin className="h-5 w-5 text-blue-600" />;
      case "twitter": return <Twitter className="h-5 w-5 text-sky-500" />;
      default: return <ExternalLink className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published": return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none"><CheckCircle2 className="w-3 h-3 mr-1"/>Yayınlandı</Badge>;
      case "scheduled": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none"><Clock className="w-3 h-3 mr-1"/>Zamanlandı</Badge>;
      default: return <Badge variant="outline">Taslak</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🗓️ Sosyal Medya Hub</h1>
        <p className="text-muted-foreground mt-2">
          Instagram, LinkedIn ve X içeriklerinizi tek bir ekranda planlayın ve yayınlayın.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column: Post Creator */}
        <Card className="md:col-span-4 h-fit border-t-4 border-t-blue-500 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Plus className="h-5 w-5" /> Yeni Gönderi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hedef Platform</label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as SocialPlatform)}>
                <SelectTrigger>
                  <SelectValue placeholder="Platform seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">X (Twitter)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">İçerik Metni</label>
              <Textarea
                placeholder="Bugün markanız için harika bir şeyler yazın..."
                className="min-h-[120px] resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <Button 
              className="w-full h-11 transition-all shadow hover:shadow-md"
              onClick={handleSchedule}
              disabled={submitting || !content.trim()}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Planlanıyor...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Zamanla (Yarın)
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right Column: Timeline / Grid */}
        <Card className="md:col-span-8 bg-muted/20 border-dashed border-2">
          <CardHeader className="border-b bg-card rounded-t-xl pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Yaklaşan Gönderiler
            </CardTitle>
            <Badge variant="secondary">
              {posts.filter(p => p.status === 'scheduled').length} Bekleyen
            </Badge>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-card animate-pulse rounded-lg border" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Yaklaşan veya geçmiş hiçbir gönderiniz bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="group relative flex gap-4 p-4 border rounded-xl bg-card hover:shadow-md hover:border-blue-200 transition-all">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {getPlatformIcon(post.platform)}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-sm capitalize">{post.platform}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {new Date(post.scheduledFor).toLocaleString('tr-TR', { 
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                            })}
                          </p>
                        </div>
                        {getStatusBadge(post.status)}
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {post.content}
                      </p>
                      
                      {/* Simüle Edilmiş Olası İmaj Önizlemesi */}
                      {post.mediaUrls && post.mediaUrls.length > 0 && (
                        <div className="pt-2">
                          <div className="w-full h-32 rounded-lg bg-cover bg-center border" style={{ backgroundImage: `url(${post.mediaUrls[0]})` }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
