import { redirect } from "next/navigation";

import BlogEditor from "@/app/_components/blog-editor";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function FreelancerBlogYazPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return <BlogEditor />;
}
