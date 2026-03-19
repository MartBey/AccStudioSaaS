import { BookOpen, ChevronRight, Clock, Eye, Heart, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

import { getBlogPosts } from "@/app/_actions/blog-actions";

export const dynamic = "force-dynamic";

const categoryLabels: Record<string, string> = {
  GENEL: "Genel",
  TEKNIK: "Teknoloji & Yazılım",
  KARIYER: "Kariyer & Gelişim",
  HABERLER: "Platform Haberleri",
};

const categoryGradients: Record<string, string> = {
  GENEL: "from-blue-400 to-indigo-500",
  TEKNIK: "from-cyan-400 to-blue-500",
  KARIYER: "from-emerald-400 to-teal-500",
  HABERLER: "from-amber-400 to-orange-500",
};

export default async function ToplulukPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || undefined;
  const page = Number(resolvedParams.page) || 1;
  const { posts, totalPages } = await getBlogPosts({ category, page });

  const featuredPost = page === 1 && !category && posts.length > 0 ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030014] text-white">
      {/* Background Elements */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none fixed left-[-10%] top-[-20%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-600 to-blue-600 opacity-20 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 opacity-15 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        {/* Hero Section */}
        <div
          className="mx-auto mb-16 max-w-3xl text-center"
          style={{ animation: "fadeInUp 0.8s ease out" }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-blue-300 backdrop-blur-md">
            <Sparkles className="h-4 w-4" /> Yeni nesil ekosisteme katılın
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-6xl">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Bilgi & Deneyim
            </span>{" "}
            Paylaşım Merkezi
          </h1>
          <p className="text-lg font-light text-gray-400 md:text-xl">
            Sektör profesyonellerinden ilham veren makaleler, rehberler ve platform duyuruları.
          </p>
        </div>

        {/* Categories */}
        <div
          className="mb-16 flex flex-wrap items-center justify-center gap-3"
          style={{ animation: "fadeInUp 0.8s ease 0.1s both" }}
        >
          <Link
            href="/topluluk"
            className={`rounded-full border px-6 py-2.5 text-sm font-medium backdrop-blur-md transition-all duration-300 ${
              !category
                ? "border-white/20 bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                : "border-white/5 bg-white/[0.02] text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            Tümü
          </Link>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Link
              key={key}
              href={`/topluluk?category=${key}`}
              className={`rounded-full border px-6 py-2.5 text-sm font-medium backdrop-blur-md transition-all duration-300 ${
                category === key
                  ? "border-white/20 bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  : "border-white/5 bg-white/[0.02] text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-16 text-center backdrop-blur-xl">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-600" />
            <h3 className="mb-2 text-xl font-medium text-gray-300">Henüz içerik yok</h3>
            <p className="mb-6 text-gray-500">Bu kategoride henüz makale yayınlanmamış.</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              İlk Yazan Sen Ol <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <Link
                href={`/topluluk/${featuredPost.slug}`}
                className="group mb-12 block"
                style={{ animation: "fadeInUp 0.8s ease 0.2s both" }}
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-blue-900/20 md:flex">
                  <div className="relative h-[300px] overflow-hidden md:h-[400px] md:w-3/5">
                    {featuredPost.coverImage ? (
                      <img
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-900/50 to-purple-900/50">
                        <BookOpen className="h-20 w-20 text-white/20" />
                      </div>
                    )}
                    <div className="absolute left-6 top-6">
                      <span
                        className={`rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md`}
                      >
                        <TrendingUp className="mr-1.5 inline h-3 w-3" /> Haftanın Öne Çıkanı
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-8 md:w-2/5 md:p-12">
                    <div className="mb-4 flex items-center gap-3">
                      <span
                        className={`bg-gradient-to-r bg-clip-text text-xs font-bold uppercase tracking-wider text-transparent ${categoryGradients[featuredPost.category] || "from-gray-400 to-gray-300"}`}
                      >
                        {categoryLabels[featuredPost.category] || featuredPost.category}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-gray-600" />
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" /> {featuredPost.readingTime} dk okuma
                      </span>
                    </div>
                    <h2 className="mb-4 line-clamp-3 text-3xl font-bold drop-shadow-md transition-colors group-hover:text-blue-400">
                      {featuredPost.title}
                    </h2>
                    <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-gray-400 md:text-base">
                      {featuredPost.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {featuredPost.authorImage ? (
                          <img
                            src={featuredPost.authorImage}
                            alt=""
                            className="h-10 w-10 rounded-full border border-white/20"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white">
                            {featuredPost.authorName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-200">
                            {featuredPost.authorName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(featuredPost.createdAt).toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "long",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Posts Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post: any, i: number) => (
                <Link
                  key={post.id}
                  href={`/topluluk/${post.slug}`}
                  className="group block"
                  style={{ animation: `fadeInUp 0.8s ease ${0.3 + i * 0.1}s both` }}
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-xl">
                    <div className="relative h-48 overflow-hidden">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                          <BookOpen className="h-10 w-10 text-white/10" />
                        </div>
                      )}
                      <div className="absolute left-4 top-4">
                        <span
                          className={`rounded-full border border-white/10 bg-black/50 bg-gradient-to-r bg-clip-text px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-transparent backdrop-blur-md ${categoryGradients[post.category] || "from-gray-400 to-gray-300"}`}
                        >
                          {categoryLabels[post.category] || post.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-grow flex-col p-6">
                      <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {post.readingTime} dk
                        </span>
                        <span className="h-1 w-1 rounded-full bg-gray-600" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                      </div>
                      <h2 className="mb-3 line-clamp-2 text-xl font-bold transition-colors group-hover:text-blue-400">
                        {post.title}
                      </h2>
                      <p className="mb-6 line-clamp-3 flex-grow text-sm text-gray-400">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                          {post.authorImage ? (
                            <img src={post.authorImage} alt="" className="h-6 w-6 rounded-full" />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                              {post.authorName.charAt(0)}
                            </div>
                          )}
                          <span className="max-w-[100px] truncate text-sm font-medium text-gray-300">
                            {post.authorName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                          <span className="flex items-center gap-1 transition-colors hover:text-white">
                            <Eye className="h-3.5 w-3.5" /> {post.viewCount}
                          </span>
                          <span className="flex items-center gap-1 transition-colors hover:text-pink-400">
                            <Heart className="h-3.5 w-3.5" /> {post.likeCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="mt-16 flex justify-center gap-2"
            style={{ animation: "fadeInUp 0.8s ease 0.6s both" }}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/topluluk?${category ? `category=${category}&` : ""}page=${p}`}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium backdrop-blur-md transition-all duration-300 ${
                  p === page
                    ? "border-transparent bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                    : "border-white/10 bg-white/[0.02] text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {p}
              </Link>
            ))}
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
