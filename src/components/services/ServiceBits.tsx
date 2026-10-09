import Image from "next/image";
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
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
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
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:grid-cols-12 md:px-8 md:py-16">
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
  image,
}: {
  href: string;
  name: string;
  short: string;
  image?: { src: string; alt: string };
}) {
  return (
    <Link
      href={href}
      className="group flex h-full items-center gap-4 border border-line bg-paper p-3 pr-5 transition-colors duration-500 hover:bg-paper-elevated sm:flex-col sm:items-stretch sm:gap-0 sm:p-0"
    >
      {image ? (
        <span className="relative block h-16 w-16 shrink-0 overflow-hidden bg-line sm:aspect-[4/3] sm:h-auto sm:w-full">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width:640px) 64px, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        </span>
      ) : null}
      <span className="flex flex-1 items-center justify-between gap-4 sm:flex-col sm:items-start sm:justify-start sm:p-6">
        <span className="min-w-0">
          <h3 className="font-[family-name:var(--font-syne)] text-base font-medium tracking-tight sm:text-lg">{name}</h3>
          <p className="mt-1 line-clamp-1 text-[0.8rem] text-ink-soft sm:mt-2 sm:line-clamp-none sm:text-sm sm:leading-relaxed">{short}</p>
        </span>
        <span aria-hidden className="text-ink transition-transform duration-500 group-hover:translate-x-1 sm:mt-auto sm:pt-6">
          →
        </span>
      </span>
    </Link>
  );
}
