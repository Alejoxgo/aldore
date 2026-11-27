import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/resources";
import ResourceForm from "@/components/admin/ResourceForm";
import Flash from "@/components/admin/Flash";

type Props = { params: Promise<{ resource: string }>; searchParams: Promise<Record<string, string | undefined>> };

export default async function NewResource({ params, searchParams }: Props) {
  const res = getResource((await params).resource);
  if (!res) notFound();
  const { error, ...rest } = await searchParams;
  const initial = Object.fromEntries(Object.entries(rest).filter(([, v]) => typeof v === "string")) as Record<string, string>;
  return (
    <div className="max-w-3xl">
      <Link href={`/admin/${res.key}`} className="text-sm text-slate-500 hover:text-brand-700">← {res.label}</Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-ink-900">Nuevo {res.singular}</h1>
      <Flash error={error} />
      <ResourceForm res={res} initial={initial} />
    </div>
  );
}
