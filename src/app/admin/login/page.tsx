import { LoginForm } from "./login-form";
import { Logo } from "@/components/logo";

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="bg-card grid w-full max-w-sm gap-6 rounded-card border p-8 shadow-rc-2">
        <div className="justify-self-center">
          <Logo className="h-11" />
        </div>
        <div className="grid gap-1 text-center">
          <h1 className="text-xl font-semibold">Panel de administración</h1>
          <p className="text-muted-foreground text-sm">Inicia sesión para continuar.</p>
        </div>
        {error === "no-autorizado" && (
          <p role="alert" className="text-destructive text-sm">
            Esta cuenta no tiene acceso al panel.
          </p>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
