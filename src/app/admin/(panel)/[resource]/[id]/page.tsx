import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getResource } from "@/lib/resources";
import ResourceForm from "@/components/admin/ResourceForm";
import Flash from "@/components/admin/Flash";
import RelatedRecords from "@/components/admin/RelatedRecords";
import PuertaShare from "@/components/admin/PuertaShare";
import ShareLinks from "@/components/admin/ShareLinks";

type Props = { params: Promise<{ resource: string; id: string }>; searchParams: Promise<{ error?: string; ok?: string }> };

export default async function EditResource({ params, searchParams }: Props) {
  await requireAdmin();
  const { resource, id } = await params;
  const res = getResource(resource);
  const numId = Number(id);
  if (!res || !Number.isInteger(numId)) notFound();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = await (prisma as any)[res.model].findUnique({ where: { id: numId } });
  if (!item) notFound();
  const { error, ok } = await searchParams;
  const publicUrl = res.model === "service" ? `/servicios/${item.slug}` : res.model === "product" ? `/productos/${item.slug}` : res.model === "linkPage" ? `/p/${item.slug}` : res.model === "post" ? `/blog/${item.slug}` : res.model === "queue" ? `/t/${item.slug}` : res.model === "menuBoard" ? `/menu/${item.slug}` : null;
  return (
    <div className="max-w-3xl">
      <Link href={`/admin/${res.key}`} className="text-sm text-slate-500 hover:text-brand-700">← {res.label}</Link>
      <div className="mb-6 mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ink-900">Editar: {item[res.titleField]}</h1>
        {publicUrl && <Link href={publicUrl} target="_blank" className="text-sm font-medium text-brand-600">Ver en el sitio ↗</Link>}
      </div>
      <Flash ok={ok} error={error} />
      {res.model === "linkPage" && <PuertaShare slug={item.slug} views={item.views} clicks={item.clicks} />}
      {res.model === "client" && item.portalToken && (
        <ShareLinks
          title="Portal del cliente"
          links={[{ label: "Envíale este enlace: ve sus proyectos, pagos y servicios. No necesita contraseña.", path: `/portal/${item.portalToken}`, private: true }]}
        />
      )}
      {res.model === "queue" && (
        <ShareLinks
          title={`Turnos · turno actual ${item.prefix}${item.currentNumber} · ${item.lastNumber} dados hoy`}
          qrFor={`/t/${item.slug}`}
          qrName={`turnos-${item.slug}`}
          links={[
            { label: "Para los clientes (el QR lleva aquí)", path: `/t/${item.slug}`, help: "Imprime el QR en la entrada o en el mostrador." },
            { label: "Para quien atiende: botón «Llamar siguiente»", path: `/t/${item.slug}/atender?k=${item.staffKey}`, private: true, help: "Ábrelo en el celular o computador de recepción." },
            { label: "Pantalla para TV o tablet", path: `/t/${item.slug}/pantalla` },
          ]}
        />
      )}
      {res.model === "menuBoard" && (
        <ShareLinks
          title="Menú del día"
          qrFor={`/menu/${item.slug}`}
          qrName={`menu-${item.slug}`}
          links={[
            { label: "Página pública del menú (el QR lleva aquí)", path: `/menu/${item.slug}` },
            { label: "Para el restaurante: cambiar el menú desde el celular", path: `/menu/${item.slug}/editar?k=${item.staffKey}`, private: true, help: "Envíaselo al dueño o al administrador del restaurante." },
          ]}
        />
      )}
      <ResourceForm res={res} item={item} />
      <RelatedRecords model={res.model} id={numId} />
    </div>
  );
}
