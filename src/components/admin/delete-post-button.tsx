"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/lib/actions/posts";

export function DeletePostButton({ id }: { id: string }) {
  return (
    <form
      action={deletePost}
      onSubmit={(e) => {
        if (!window.confirm("¿Eliminar este artículo? Esta acción no se puede deshacer.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="lg">
        <HugeiconsIcon icon={Delete02Icon} />
        Eliminar
      </Button>
    </form>
  );
}
