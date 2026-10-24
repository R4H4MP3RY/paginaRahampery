import Link from "next/link";
import { PostForm } from "@/components/admin/post-form";
import { requireAdmin } from "@/lib/auth";

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <Link href="/admin/blog" className="text-muted-foreground text-sm hover:underline">
          ← Blog
        </Link>
        <h1 className="text-2xl font-semibold">Nuevo artículo</h1>
      </div>
      <PostForm />
    </div>
  );
}
