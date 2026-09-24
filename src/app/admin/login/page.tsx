import Image from "next/image";
import { LoginForm } from "./login-form";
import logo from "../../../../public/brand/logo.png";

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="bg-card grid w-full max-w-sm gap-6 rounded-2xl border p-8 shadow-sm">
        <Image src={logo} alt="Rahampery Contreras Coach Financiero" className="h-16 w-auto justify-self-center" />
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
