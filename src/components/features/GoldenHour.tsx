"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useMounted } from "@/lib/useMounted";

const BERLIN = { lat: 52.52, lng: 13.405 };
const RAD = Math.PI / 180;
const STEP = 2 * 60_000;
const HORIZON = 30 * 3600_000;

/** Sun altitude in degrees over Berlin (low-precision solar position, as in suncalc). */
function sunAltitude(ms: number) {
  const d = ms / 86_400_000 - 10_957.5;
  const M = RAD * (357.5291 + 0.98560028 * d);
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const L = M + C + RAD * 102.9372 + Math.PI;
  const e = RAD * 23.4397;
  const dec = Math.asin(Math.sin(e) * Math.sin(L));
  const ra = Math.atan2(Math.sin(L) * Math.cos(e), Math.cos(L));
  const H = RAD * (280.16 + 360.9856235 * d) + RAD * BERLIN.lng - ra;
  const phi = RAD * BERLIN.lat;
  return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H)) / RAD;
}

type Window = { start: number; end: number; evening: boolean };

/** Golden hour = sun between -4° and 6°; returns the windows in the next 30 hours. */
export function goldenWindows(now: number) {
  const out: Window[] = [];
  let open: number | null = null;
  for (let t = now; t <= now + HORIZON; t += STEP) {
    const alt = sunAltitude(t);
    const inGold = alt >= -4 && alt <= 6;
    if (inGold && open === null) open = t;
    if (!inGold && open !== null) {
      out.push({ start: open, end: t, evening: sunAltitude(open) > alt });
      open = null;
    }
  }
  return out;
}

function tone(alt: number) {
  if (alt < -6) return "bg-ink/80";
  if (alt < -4) return "bg-[#4a5d7a]";
  if (alt <= 6) return "bg-[#d9a25f]";
  return "bg-[#efe3cf]";
}

/** Live "best light today" card: next golden hour in Berlin with a countdown and a 24h light strip. */
export function GoldenHour({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("golden");
  const locale = useLocale();
  const mounted = useMounted();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const fmt = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" });
  const day = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "Europe/Berlin" });

  const windows = mounted ? goldenWindows(now) : [];
  const next = windows[0];
  const live = next ? next.start <= now : false;
  const mins = next ? Math.max(0, Math.round(((live ? next.end : next.start) - now) / 60_000)) : 0;
  const countdown = mins >= 60 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : `${mins} min`;
  const cells = mounted ? Array.from({ length: 48 }, (_, i) => sunAltitude(now + i * 30 * 60_000)) : [];

  return (
    <div className={`border border-line bg-paper-elevated ${compact ? "p-5" : "p-6 md:p-8"}`}>
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          {live ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d9a25f] opacity-70" /> : null}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d9a25f]" />
        </span>
        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-muted">{t("eyebrow")}</p>
      </div>

      {next ? (
        <>
          <p className={`mt-4 font-[family-name:var(--font-instrument)] italic leading-tight ${compact ? "text-2xl" : "text-3xl md:text-4xl"}`}>
            {live ? t("now", { time: countdown }) : t("next", { time: countdown })}
          </p>
          <p className="mt-2 text-sm text-ink-soft tabular-nums">
            {next.evening ? t("evening") : t("morning")} · {day.format(next.start)} {fmt.format(next.start)}–{fmt.format(next.end)}
          </p>
        </>
      ) : (
        <p className="mt-4 h-[4.5rem] text-sm text-muted">{t("loading")}</p>
      )}

      <div className="mt-6" aria-hidden>
        <div className="flex h-2 overflow-hidden rounded-full">
          {cells.map((alt, i) => (
            <span key={i} className={`flex-1 ${tone(alt)}`} />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[0.62rem] uppercase tracking-[0.18em] text-muted">
          <span>{t("nowLabel")}</span>
          <span>+12 h</span>
          <span>+24 h</span>
        </div>
      </div>

      {!compact ? (
        <ul className="mt-6 space-y-1.5 border-t border-line pt-5 text-sm tabular-nums text-ink-soft">
          {windows.slice(0, 3).map((w) => (
            <li key={w.start} className="flex justify-between gap-4">
              <span>{w.evening ? t("evening") : t("morning")} · {day.format(w.start)}</span>
              <span>{fmt.format(w.start)}–{fmt.format(w.end)}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-5 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}
