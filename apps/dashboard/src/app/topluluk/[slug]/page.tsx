import { ArrowLeft, Calendar, Clock, Eye, User } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getBlogPostBySlug } from "@/app/_actions/blog-actions";

import LikeButton from "./_components/like-button";

export const dynamic = "force-dynamic";

const categoryLabels: Record<string, string> = {
  GENEL: "Genel",
  TEKNIK: "Teknoloji & Yazılım",
  KARIYER: "Kariyer & Gelişim",
  HABERLER: "Sektör Haberleri",
};
const categoryGradients: Record<string, string> = {
  GENEL: "from-blue-400 to-indigo-500",
  TEKNIK: "from-cyan-400 to-blue-500",
  KARIYER: "from-emerald-400 to-teal-500",
  HABERLER: "from-amber-400 to-orange-500",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Makale Bulunamadı" };
  return {
    title: `${post.title} | AccStudio Topluluk`,
    description: post.excerpt || post.content.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return notFound();

  const gradient = categoryGradients[post.category] || "from-gray-400 to-gray-300";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030014] text-white selection:bg-blue-500/30">
      {/* Background Elements */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-[500px] w-full max-w-5xl -translate-x-1/2 bg-gradient-to-b from-indigo-600 to-transparent opacity-20 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-12">
        {/* Navigation */}
        <div style={{ animation: "fadeInUp 0.8s ease out" }}>
          <Link
            href="/topluluk"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Topluluk&apos;a Dön
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12" style={{ animation: "fadeInUp 0.8s ease 0.1s both" }}>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span
              className={`rounded-full border border-white/10 bg-white/10 bg-gradient-to-r bg-clip-text px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-transparent backdrop-blur-md ${gradient}`}
            >
              {categoryLabels[post.category] || post.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <Clock className="h-4 w-4" /> {post.readingTime} dk okuma
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <Eye className="h-4 w-4" /> {post.viewCount} Okunma
            </span>
          </div>

          <h1 className="mb-8 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 border-y border-white/10 py-6">
            <div className="flex items-center gap-4">
              {post.authorImage ? (
                <img
                  src={post.authorImage}
                  alt=""
                  className="h-12 w-12 rounded-full border-2 border-white/10"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/10 bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white">
                  {post.authorName.charAt(0)}
                </div>
              )}
              <div>
                <p className="flex items-center gap-2 text-lg font-semibold text-gray-100">
                  {post.authorName}
                  {post.authorVitrinSlug && (
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                      Freelancer
                    </span>
                  )}
                </p>
                <p className="flex items-center gap-1.5 text-sm uppercase tracking-widest text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />{" "}
                  {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
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
          <div
            className="relative mb-16 h-[400px] w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/50 md:h-[500px]"
            style={{ animation: "fadeInUp 0.8s ease 0.2s both" }}
          >
            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-80" />
          </div>
        )}

        {/* Article Body */}
        <div
          className="mb-16 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl md:p-14"
          style={{ animation: "fadeInUp 0.8s ease 0.3s both" }}
        >
          {post.tags && (
            <div className="mb-10 flex flex-wrap gap-2">
              {post.tags.split(",").map((tag: string) => (
                <span
                  key={tag.trim()}
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-gray-300"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Prose Content */}
          <div className="prose prose-invert prose-lg prose-p:leading-relaxed prose-headings:text-gray-100 prose-a:text-blue-400 max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }} />
          </div>
        </div>

        {/* Author Footer Card */}
        {post.authorVitrinSlug && (
          <div
            className="relative mb-12 overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-8 backdrop-blur-xl"
            style={{ animation: "fadeInUp 0.8s ease 0.4s both" }}
          >
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-indigo-500/20 blur-[80px]" />
            <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row">
              <div className="h-20 w-20 shrink-0">
                {post.authorImage ? (
                  <img
                    src={post.authorImage}
                    alt=""
                    className="h-full w-full rounded-full border-4 border-indigo-500/30 object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white shadow-xl">
                    {post.authorName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="mb-2 text-xl font-bold text-white">{post.authorName}</h3>
                <p className="mx-auto mb-4 max-w-md text-sm text-gray-300 md:mx-0">
                  Bu makale {post.authorName} tarafından yazılmıştır. Yazarın tüm yeteneklerini,
                  projelerini ve daha fazlasını vitrin profilinde keşfedin.
                </p>
                <Link
                  href={`/vitrin/${post.authorVitrinSlug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/20"
                >
                  <User className="h-4 w-4" /> Yazar Vitrinini Ziyaret Et
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
