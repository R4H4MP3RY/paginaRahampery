import type { MetadataRoute } from "next";
import { insurancePages } from "@/content/seguros";
import { servicePages } from "@/content/servicios";
import { getPublishedPosts } from "@/lib/blog";
import { offeredInsurances, site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${site.url}${path}`;
  const posts = await getPublishedPosts(1000);
  const insurances = insurancePages.filter((p) => offeredInsurances.some((i) => i.slug === p.slug));

  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...servicePages.map((p) => ({
      url: url(`/servicios/${p.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: url("/seguros"), changeFrequency: "monthly", priority: 0.9 },
    ...insurances.map((p) => ({
      url: url(`/seguros/${p.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: url("/blog"), changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({
      url: url(`/blog/${p.slug}`),
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: url("/aviso-de-privacidad"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
