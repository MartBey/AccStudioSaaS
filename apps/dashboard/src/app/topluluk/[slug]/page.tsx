import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/app/_actions/blog-actions";
import { Metadata } from "next";
import { Eye, Clock, Calendar, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import LikeButton from "./_components/like-button";

export const dynamic = "force-dynamic";

const categoryLabels: Record<string, string> = { GENEL: "Genel", TEKNIK: "Teknoloji & Yazılım", KARIYER: "Kariyer & Gelişim", HABERLER: "Sektör Haberleri" };
const categoryGradients: Record<string, string> = {
  GENEL: "from-blue-400 to-indigo-500",
  TEKNIK: "from-cyan-400 to-blue-500",
  KARIYER: "from-emerald-400 to-teal-500",
  HABERLER: "from-amber-400 to-orange-500",
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Makale Bulunamadı" };
  return {
    title: `${post.title} | AccStudio Topluluk`,
    description: post.excerpt || post.content.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return notFound();

  const gradient = categoryGradients[post.category] || "from-gray-400 to-gray-300";

  return (
    <div className="min-h-screen bg-[#030014] text-white overflow-hidden relative selection:bg-blue-500/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] opacity-20 blur-[150px] pointer-events-none z-0 bg-gradient-to-b from-indigo-600 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        
        {/* Navigation */}
        <div style={{ animation: "fadeInUp 0.8s ease out" }}>
          <Link href="/topluluk" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md mb-8">
            <ArrowLeft className="h-4 w-4" /> Topluluk&apos;a Dön
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12" style={{ animation: "fadeInUp 0.8s ease 0.1s both" }}>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/10 text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
              {categoryLabels[post.category] || post.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-400"><Clock className="w-4 h-4" /> {post.readingTime} dk okuma</span>
            <span className="flex items-center gap-1.5 text-sm text-gray-400"><Eye className="w-4 h-4" /> {post.viewCount} Okunma</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-white/10">
            <div className="flex items-center gap-4">
              {post.authorImage ? (
                <img src={post.authorImage} alt="" className="w-12 h-12 rounded-full border-2 border-white/10" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg border-2 border-white/10">
                  {post.authorName.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-lg text-gray-100 flex items-center gap-2">
                  {post.authorName}
                  {post.authorVitrinSlug && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 uppercase tracking-widest">
                      Freelancer
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {new Date(post.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <LikeButton postId={post.id} initialCount={post.likeCount} />
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-16 shadow-2xl shadow-black/50 border border-white/10" style={{ animation: "fadeInUp 0.8s ease 0.2s both" }}>
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-80" />
          </div>
        )}

        {/* Article Body */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 md:p-14 backdrop-blur-xl mb-16 shadow-2xl" style={{ animation: "fadeInUp 0.8s ease 0.3s both" }}>
          
          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-10">
              {post.tags.split(",").map((tag: string) => (
                <span key={tag.trim()} className="px-3 py-1 rounded-md text-sm font-medium bg-white/5 text-gray-300 border border-white/10">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Prose Content */}
          <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:text-gray-100 prose-a:text-blue-400">
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }} />
          </div>

        </div>

        {/* Author Footer Card */}
        {post.authorVitrinSlug && (
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-3xl p-8 backdrop-blur-xl mb-12" style={{ animation: "fadeInUp 0.8s ease 0.4s both" }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 shrink-0">
                {post.authorImage ? (
                  <img src={post.authorImage} alt="" className="w-full h-full rounded-full border-4 border-indigo-500/30 object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                    {post.authorName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2">{post.authorName}</h3>
                <p className="text-gray-300 text-sm mb-4 max-w-md mx-auto md:mx-0">
                  Bu makale {post.authorName} tarafından yazılmıştır. Yazarın tüm yeteneklerini, projelerini ve daha fazlasını vitrin profilinde keşfedin.
                </p>
                <Link href={`/vitrin/${post.authorVitrinSlug}`} className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all border border-white/20">
                  <User className="w-4 h-4" /> Yazar Vitrinini Ziyaret Et
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
}
