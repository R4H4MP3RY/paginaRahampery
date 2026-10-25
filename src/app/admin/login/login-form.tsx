"use client";

import { useActionState, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { Turnstile } from "@/components/turnstile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type LoginState } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="email" className="text-sm">
          Correo
        </Label>
        <Input id="email" name="email" type="email" autoComplete="email" required className="h-11 text-base md:text-sm" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password" className="text-sm">
          Contraseña
        </Label>
        {/* Botón propio para ver la contraseña: Edge trae uno, pero Brave, Chrome y Firefox no.
            Se oculta el de Edge (::-ms-reveal) para que no aparezcan dos. */}
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="h-11 pr-12 text-base md:text-sm [&::-ms-reveal]:hidden"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full"
          >
            <HugeiconsIcon icon={showPassword ? ViewOffSlashIcon : ViewIcon} size={20} />
          </button>
        </div>
      </div>
      <Turnstile />
      {state.error && (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      )}
      <Button type="submit" size="xl" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
