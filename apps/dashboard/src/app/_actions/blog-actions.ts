"use server";

import { prisma } from "database";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = slugify(base);
  let counter = 1;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${slugify(base)}-${counter}`;
    counter++;
  }
  return slug;
}

// Makale oluştur
export async function createBlogPost(data: {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string;
  coverImage?: string;
  published?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Oturum bulunamadı." };

  const slug = await uniqueSlug(data.title);

  try {
    const post = await prisma.blogPost.create({
      data: {
        authorId: session.user.id,
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt || data.content.substring(0, 160),
        category: (data.category?.toUpperCase() as any) || "GENEL",
        tags: data.tags || null,
        coverImage: data.coverImage || null,
        published: data.published ?? false,
      },
    });

    revalidatePath("/topluluk");
    return { success: true, slug: post.slug };
  } catch (error: unknown) {
    console.error("createBlogPost error:", error);
    return { error: "Makale oluşturulurken hata." };
  }
}

// Makale güncelle
export async function updateBlogPost(postId: string, data: {
  title?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  tags?: string;
  coverImage?: string;
  published?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Oturum bulunamadı." };

  try {
    await prisma.blogPost.update({
      where: { id: postId },
      data: {
        ...data,
        category: data.category ? (data.category.toUpperCase() as any) : undefined,
      },
    });

    revalidatePath("/topluluk");
    return { success: true };
  } catch (error: unknown) {
    console.error("updateBlogPost error:", error);
    return { error: "Güncelleme başarısız." };
  }
}

// Makaleleri getir (Public)
export async function getBlogPosts(options?: { category?: string; page?: number }) {
  const page = options?.page || 1;
  const limit = 12;
  const where: { published: boolean; category?: any } = { published: true };
  if (options?.category) where.category = options.category.toUpperCase() as any;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: {
        author: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts: posts.map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || p.content.substring(0, 160),
      category: p.category,
      tags: p.tags,
      coverImage: p.coverImage,
      authorName: p.author?.name || "Anonim",
      authorImage: p.author?.image,
      viewCount: p.viewCount,
      likeCount: p.likeCount,
      readingTime: Math.max(1, Math.ceil(p.content.split(/\s+/).length / 200)),
      createdAt: p.createdAt.toISOString(),
    })),
    total,
    totalPages: Math.ceil(total / limit),
  };
}

// Makale detay (slug ile, Public)
export async function getBlogPostBySlug(slug: string) {
  // View count artır
  try {
    await prisma.blogPost.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });
  } catch { /* post bulunamadıysa devam et */ }

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: { 
        select: { 
          name: true, image: true,
          profile: { include: { freelancer: { include: { vitrin: { select: { slug: true } } } } } },
        }
      },
    },
  });

  if (!post || !post.published) return null;

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags,
    coverImage: post.coverImage,
    authorName: post.author.name || "Anonim",
    authorImage: post.author.image,
    authorVitrinSlug: post.author.profile?.freelancer?.vitrin?.slug || null,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    readingTime: Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200)),
    createdAt: post.createdAt.toISOString(),
  };
}

// Like
export async function likeBlogPost(postId: string) {
  try {
    await prisma.blogPost.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    });
    revalidatePath("/topluluk");
    return { success: true };
  } catch {
    return { error: "İşlem başarısız." };
  }
}

// Kullanıcının kendi makaleleri
export async function getMyBlogPosts() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.blogPost.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}
