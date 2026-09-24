import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Verifica en el servidor que haya sesión y que el usuario sea administrador.
// Se usa en cada página y acción del panel; no depende solo del proxy.
export const requireAdmin = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/admin/login");

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) redirect("/admin/login?error=no-autorizado");
  return { supabase, userId: data.claims.sub, email: data.claims.email as string | undefined };
});
