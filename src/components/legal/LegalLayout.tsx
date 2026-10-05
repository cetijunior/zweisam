import { Reveal } from "@/components/motion/primitives";

/** Plain, readable layout for Impressum / Datenschutz. */
export function LegalLayout({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <Reveal>
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-muted">{eyebrow}</p>
        <h1 className="mt-5 font-[family-name:var(--font-syne)] text-[clamp(2.2rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.03em]">
          {title}
        </h1>
      </Reveal>
      <div className="legal-prose mt-12">{children}</div>
    </section>
  );
}

/** Shows a value, or a visible placeholder so missing legal details are obvious before launch. */
export function Filled({ value, placeholder }: { value: string; placeholder: string }) {
  if (value.trim()) return <>{value}</>;
  return <span className="bg-accent/15 px-1 text-accent">[{placeholder}]</span>;
}
