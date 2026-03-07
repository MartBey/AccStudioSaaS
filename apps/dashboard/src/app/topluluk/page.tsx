import { getBlogPosts } from "@/app/_actions/blog-actions";
import Link from "next/link";
import { BookOpen, Eye, Heart, Clock, Sparkles, TrendingUp, ChevronRight } from "lucide-react";

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

export default async function ToplulukPage({ searchParams }: { searchParams: { category?: string; page?: string } }) {
  const category = searchParams.category || undefined;
  const page = Number(searchParams.page) || 1;
  const { posts, totalPages } = await getBlogPosts({ category, page });

  const featuredPost = page === 1 && !category && posts.length > 0 ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen bg-[#030014] text-white overflow-hidden relative">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none bg-gradient-to-br from-purple-600 to-blue-600" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] pointer-events-none bg-gradient-to-br from-cyan-500 to-blue-500" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto" style={{ animation: "fadeInUp 0.8s ease out" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-300 mb-6 backdrop-blur-md">
            <Sparkles className="h-4 w-4" /> Yeni nesil ekosisteme katılın
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
              Bilgi & Deneyim
            </span> Paylaşım Merkezi
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-light">
            Sektör profesyonellerinden ilham veren makaleler, rehberler ve platform duyuruları.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16" style={{ animation: "fadeInUp 0.8s ease 0.1s both" }}>
          <Link 
            href="/topluluk"
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md border ${
              !category 
                ? "bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                : "bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            Tümü
          </Link>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Link
              key={key}
              href={`/topluluk?category=${key}`}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md border ${
                category === key 
                  ? "bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                  : "bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-16 text-center backdrop-blur-xl">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">Henüz içerik yok</h3>
            <p className="text-gray-500 mb-6">Bu kategoride henüz makale yayınlanmamış.</p>
            <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity">
              İlk Yazan Sen Ol <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <Link href={`/topluluk/${featuredPost.slug}`} className="block mb-12 group" style={{ animation: "fadeInUp 0.8s ease 0.2s both" }}>
                <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl hover:bg-white/[0.05] transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-900/20 md:flex">
                  <div className="md:w-3/5 h-[300px] md:h-[400px] relative overflow-hidden">
                    {featuredPost.coverImage ? (
                      <img src={featuredPost.coverImage} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-white/20" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg`}>
                        <TrendingUp className="w-3 h-3 inline mr-1.5" /> Haftanın Öne Çıkanı
                      </span>
                    </div>
                  </div>
                  <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${categoryGradients[featuredPost.category] || "from-gray-400 to-gray-300"}`}>
                        {categoryLabels[featuredPost.category] || featuredPost.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {featuredPost.readingTime} dk okuma</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 line-clamp-3 group-hover:text-blue-400 transition-colors drop-shadow-md">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-400 mb-8 line-clamp-3 leading-relaxed text-sm md:text-base">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                        {featuredPost.authorImage ? (
                          <img src={featuredPost.authorImage} alt="" className="w-10 h-10 rounded-full border border-white/20" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white border border-white/20">
                            {featuredPost.authorName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-200">{featuredPost.authorName}</p>
                          <p className="text-xs text-gray-500">{new Date(featuredPost.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post: any, i: number) => (
                <Link key={post.id} href={`/topluluk/${post.slug}`} className="group block" style={{ animation: `fadeInUp 0.8s ease ${0.3 + i * 0.1}s both` }}>
                  <div className="h-full bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl hover:bg-white/[0.04] transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl flex flex-col">
                    <div className="h-48 relative overflow-hidden">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-white/10" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md border border-white/10 text-transparent bg-clip-text bg-gradient-to-r ${categoryGradients[post.category] || "from-gray-400 to-gray-300"}`}>
                          {categoryLabels[post.category] || post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3 text-[11px] text-gray-400 font-medium">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readingTime} dk</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        <span>{new Date(post.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}</span>
                      </div>
                      <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                        <div className="flex items-center gap-2">
                          {post.authorImage ? (
                            <img src={post.authorImage} alt="" className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                              {post.authorName.charAt(0)}
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-300 truncate max-w-[100px]">{post.authorName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                          <span className="flex items-center gap-1 hover:text-white transition-colors"><Eye className="w-3.5 h-3.5" /> {post.viewCount}</span>
                          <span className="flex items-center gap-1 hover:text-pink-400 transition-colors"><Heart className="w-3.5 h-3.5" /> {post.likeCount}</span>
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
          <div className="flex justify-center gap-2 mt-16" style={{ animation: "fadeInUp 0.8s ease 0.6s both" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link
                key={p}
                href={`/topluluk?${category ? `category=${category}&` : ""}page=${p}`}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300 backdrop-blur-md border ${
                  p === page 
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
                    : "bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
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
