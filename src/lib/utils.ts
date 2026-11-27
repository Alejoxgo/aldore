export function lines(value: string | null | undefined): string[] {
  return (value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function paragraphs(value: string | null | undefined): string[] {
  return (value ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function whatsappLink(number: string, text?: string) {
  const n = number.replace(/[^0-9]/g, "");
  if (!n) return "";
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** Lee líneas "Texto | enlace" (menús y enlaces editables desde el panel). */
export function linkList(value: string | null | undefined): { label: string; href: string }[] {
  return lines(value)
    .map((l) => {
      const [label, ...rest] = l.split("|");
      return { label: label.trim(), href: rest.join("|").trim() || "#" };
    })
    .filter((l) => l.label);
}

export const isExternal = (href: string) => /^https?:\/\//.test(href);
