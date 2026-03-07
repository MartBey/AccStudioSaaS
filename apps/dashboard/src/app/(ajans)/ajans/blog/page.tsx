import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BlogEditor from "@/app/_components/blog-editor";

export const dynamic = "force-dynamic";

export default async function AjansBlogYazPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return <BlogEditor />;
}
