"use client";

import { useActionState, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { savePost } from "@/lib/actions/posts";
import { slugify, type PostFormState, type PostRecord } from "@/lib/blog-schema";
import { uploadBlogImage } from "@/lib/upload-image";

const fieldCls = "h-10 bg-white text-base md:text-sm";

export function PostForm({ post, coverUrl }: { post?: PostRecord; coverUrl?: string | null }) {
  const [state, action, pending] = useActionState<PostFormState, FormData>(savePost, {});
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  // La URL se genera del título hasta que se edita a mano (o si el artículo ya existe).
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [cover, setCover] = useState<{ path: string; url: string } | null>(
    post?.cover_path && coverUrl ? { path: post.cover_path, url: coverUrl } : null,
  );
  const [coverError, setCoverError] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  // Campos controlados: React reinicia el formulario tras cada envío y así no se pierde lo escrito.
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [coverAlt, setCoverAlt] = useState(post?.cover_alt ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const coverInput = useRef<HTMLInputElement>(null);

  const err = (f: keyof NonNullable<PostFormState["errors"]>) => state.errors?.[f]?.[0];
  const isPublished = post?.status === "publicado";

  async function onCover(file: File | undefined) {
    if (!file) return;
    setCoverError(null);
    setUploadingCover(true);
    try {
      setCover(await uploadBlogImage(file));
    } catch (e) {
      setCoverError(e instanceof Error ? e.message : "No se pudo subir la imagen.");
    } finally {
      setUploadingCover(false);
      if (coverInput.current) coverInput.current.value = "";
    }
  }

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="coverPath" value={cover?.path ?? ""} />

      <div className="grid content-start gap-5">
        <Field id="title" label="Título" error={err("title")}>
          <Input
            id="title"
            name="title"
            required
            maxLength={160}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className="h-12 bg-white text-lg font-semibold md:text-lg"
          />
        </Field>

        <Field id="slug" label="URL del artículo" error={err("slug")}>
          <div className="flex items-center">
            <span className="text-muted-foreground bg-muted flex h-10 items-center rounded-l-md border border-r-0 px-2 text-sm">
              /blog/
            </span>
            <Input
              id="slug"
              name="slug"
              required
              maxLength={120}
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value) || e.target.value.toLowerCase());
              }}
              className={`${fieldCls} rounded-l-none`}
            />
          </div>
          {isPublished && (
            <p className="text-muted-foreground text-xs">Cambiar la URL de un artículo publicado rompe los enlaces que ya existan.</p>
          )}
        </Field>

        <Field id="excerpt" label="Resumen (aparece en el listado del blog)" error={err("excerpt")}>
          <Textarea
            id="excerpt"
            name="excerpt"
            maxLength={300}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="min-h-20 bg-white text-base md:text-sm"
          />
        </Field>

        <div className="grid gap-1.5">
          <span className="text-sm font-medium">Contenido</span>
          <RichTextEditor name="content" initialContent={post?.content_json as JSONContent | undefined} />
        </div>
      </div>

      <aside className="grid content-start gap-5">
        <div className="grid gap-3 rounded-xl border bg-white p-4">
          <p className="text-sm">
            Estado:{" "}
            <strong className={isPublished ? "text-brand-green-ink" : "text-brand-orange-ink"}>
              {isPublished ? "Publicado" : "Borrador"}
            </strong>
          </p>
          <Button type="submit" name="intent" value="guardar" variant="outline" size="lg" disabled={pending}>
            {post ? "Guardar cambios" : "Guardar borrador"}
          </Button>
          {isPublished ? (
            <Button type="submit" name="intent" value="despublicar" variant="ghost" size="lg" disabled={pending}>
              Despublicar
            </Button>
          ) : (
            <Button type="submit" name="intent" value="publicar" size="lg" disabled={pending}>
              Publicar
            </Button>
          )}
          {state.message && (
            <p role={state.ok ? "status" : "alert"} className={`text-sm ${state.ok ? "text-brand-green-ink" : "text-destructive"}`}>
              {state.message}
            </p>
          )}
        </div>

        <div className="grid gap-3 rounded-xl border bg-white p-4">
          <span className="text-sm font-medium">Imagen de portada</span>
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover.url} alt="" className="aspect-[1.91/1] w-full rounded-lg object-cover" />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="lg" disabled={uploadingCover} onClick={() => coverInput.current?.click()}>
              {uploadingCover ? "Subiendo…" : cover ? "Cambiar" : "Subir imagen"}
            </Button>
            {cover && (
              <Button type="button" variant="ghost" size="lg" onClick={() => setCover(null)}>
                Quitar
              </Button>
            )}
          </div>
          <input
            ref={coverInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => onCover(e.target.files?.[0])}
          />
          {coverError && <p className="text-destructive text-xs">{coverError}</p>}
          <p className="text-muted-foreground text-xs">Recomendado: 1200 × 630 px, máximo 5 MB.</p>
          <Field id="coverAlt" label="Descripción de la imagen" error={err("coverAlt")}>
            <Input
              id="coverAlt"
              name="coverAlt"
              maxLength={200}
              value={coverAlt}
              onChange={(e) => setCoverAlt(e.target.value)}
              className={fieldCls}
            />
          </Field>
        </div>

        <div className="grid gap-3 rounded-xl border bg-white p-4">
          <Field id="category" label="Categoría" error={err("category")}>
            <Input
              id="category"
              name="category"
              maxLength={60}
              list="categorias"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={fieldCls}
            />
            <datalist id="categorias">
              {["Finanzas personales", "Deudas", "Ahorro", "Inversiones", "Retiro", "Seguros", "Empresas"].map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </div>

        <div className="grid gap-3 rounded-xl border bg-white p-4">
          <span className="text-sm font-medium">SEO (Google)</span>
          <Field id="seoTitle" label={`Título para Google (${seoTitle.length}/70)`} error={err("seoTitle")}>
            <Input
              id="seoTitle"
              name="seoTitle"
              maxLength={70}
              placeholder={title}
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className={fieldCls}
            />
          </Field>
          <Field id="seoDescription" label={`Descripción para Google (${seoDescription.length}/170)`} error={err("seoDescription")}>
            <Textarea
              id="seoDescription"
              name="seoDescription"
              maxLength={170}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="min-h-20 bg-white text-base md:text-sm"
            />
          </Field>
          <p className="text-muted-foreground text-xs">Si los dejas vacíos se usan el título y el resumen.</p>
        </div>
      </aside>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      {children}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
