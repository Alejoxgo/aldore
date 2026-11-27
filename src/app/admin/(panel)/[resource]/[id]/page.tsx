import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getResource } from "@/lib/resources";
import ResourceForm from "@/components/admin/ResourceForm";
import Flash from "@/components/admin/Flash";
import RelatedRecords from "@/components/admin/RelatedRecords";

type Props = { params: Promise<{ resource: string; id: string }>; searchParams: Promise<{ error?: string; ok?: string }> };

export default async function EditResource({ params, searchParams }: Props) {
  const { resource, id } = await params;
  const res = getResource(resource);
  const numId = Number(id);
  if (!res || !Number.isInteger(numId)) notFound();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = await (prisma as any)[res.model].findUnique({ where: { id: numId } });
  if (!item) notFound();
  const { error, ok } = await searchParams;
  const publicUrl = res.model === "service" ? `/servicios/${item.slug}` : res.model === "product" ? `/productos/${item.slug}` : null;
  return (
    <div className="max-w-3xl">
      <Link href={`/admin/${res.key}`} className="text-sm text-slate-500 hover:text-brand-700">← {res.label}</Link>
      <div className="mb-6 mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink-900">Editar: {item[res.titleField]}</h1>
        {publicUrl && <Link href={publicUrl} target="_blank" className="text-sm font-medium text-brand-600">Ver en el sitio ↗</Link>}
      </div>
      <Flash ok={ok} error={error} />
      <ResourceForm res={res} item={item} />
      <RelatedRecords model={res.model} id={numId} />
    </div>
  );
}
