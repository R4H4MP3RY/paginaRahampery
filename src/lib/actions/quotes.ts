"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logAdminEvent } from "@/lib/admin-log";
import { requireAdmin } from "@/lib/auth";
import { quoteStatuses } from "@/lib/quote-status";

const updateSchema = z.object({
  id: z.uuid(),
  status: z.enum(quoteStatuses),
  adminNotes: z.string().trim().max(4000),
});

export async function updateQuote(formData: FormData) {
  const { supabase, userId } = await requireAdmin();
  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    adminNotes: formData.get("adminNotes") ?? "",
  });
  if (!parsed.success) return;

  const { error } = await supabase
    .from("quote_requests")
    .update({ status: parsed.data.status, admin_notes: parsed.data.adminNotes || null })
    .eq("id", parsed.data.id);
  if (error) console.error("update quote", error.code, error.message);
  else await logAdminEvent("quote_updated", { userId, target: parsed.data.id, reason: parsed.data.status });
  revalidatePath("/admin");
}
