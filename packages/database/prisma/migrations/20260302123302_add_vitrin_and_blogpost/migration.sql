-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('GENEL', 'TEKNIK', 'KARIYER', 'HABERLER');

-- CreateTable
CREATE TABLE "Vitrin" (
    "id" TEXT NOT NULL,
    "freelancerId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "headline" TEXT,
    "about" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'default',
    "showEarnings" BOOLEAN NOT NULL DEFAULT false,
    "showContact" BOOLEAN NOT NULL DEFAULT true,
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vitrin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "category" "BlogCategory" NOT NULL DEFAULT 'GENEL',
    "tags" TEXT,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vitrin_freelancerId_key" ON "Vitrin"("freelancerId");

-- CreateIndex
CREATE UNIQUE INDEX "Vitrin_slug_key" ON "Vitrin"("slug");

-- CreateIndex
CREATE INDEX "Vitrin_slug_idx" ON "Vitrin"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_authorId_idx" ON "BlogPost"("authorId");

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_published_category_idx" ON "BlogPost"("published", "category");
