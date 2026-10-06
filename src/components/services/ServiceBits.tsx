import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/primitives";
import { whatsappUrl } from "@/lib/contact";
import { BERLIN_AREAS } from "@/lib/services";

/** WhatsApp-first call to action used at the end of service pages. */
export function ServiceCta({
  title,
  body,
  whatsapp,
  waText,
  waLabel,
  formLabel,
  formHref,
}: {
  title: string;
  body: string;
  whatsapp: string;
  waText: string;
  waLabel: string;
  formLabel: string;
  formHref: string;
}) {
  return (
    <section className="border-t border-line bg-paper-elevated">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <h2 className="max-w-2xl font-[family-name:var(--font-syne)] text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight tracking-tight">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">{body}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            {whatsapp ? (
              <a
                href={whatsappUrl(whatsapp, waText)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-6 text-sm font-medium text-white transition hover:brightness-105"
              >
                {waLabel}
              </a>
            ) : null}
            <a href={formHref} className="btn-line">
              {formLabel}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Every district we cover, as plain text so search engines can read it. */
export function AreasBlock({ title, body, prefix }: { title: string; body: string; prefix: string }) {
  return (
    <section className="border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-12 md:px-8 md:py-20">
        <div className="md:col-span-4">
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-medium tracking-tight">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{body}</p>
        </div>
        <ul className="flex flex-wrap gap-2 md:col-span-8">
          {BERLIN_AREAS.map((a) => (
            <li
              key={a}
              className="rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-soft"
            >
              <span className="sr-only">{prefix} </span>
              {a}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ServiceCard({
  href,
  name,
  short,
}: {
  href: string;
  name: string;
  short: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col border border-line bg-paper p-6 transition-colors duration-500 hover:bg-paper-elevated"
    >
      <h3 className="font-[family-name:var(--font-syne)] text-lg font-medium tracking-tight">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{short}</p>
      <span aria-hidden className="mt-auto pt-6 text-ink transition-transform duration-500 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
