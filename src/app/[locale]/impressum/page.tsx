import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Filled, LegalLayout } from "@/components/legal/LegalLayout";
import type { AppLocale } from "@/i18n/routing";
import { readSiteData } from "@/lib/data/store";
import { pageMetadata } from "@/lib/site";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as AppLocale;
  const data = await readSiteData();
  const t = await getTranslations({ locale: loc, namespace: "legal" });
  return pageMetadata({
    locale: loc,
    path: "/impressum",
    title: `${t("imprint")} — ${data.settings.studioName}`,
    description: `${t("imprint")} ${data.settings.studioName}`,
    settings: data.settings,
  });
}

export default async function ImpressumPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const de = locale === "de";
  const t = await getTranslations("legal");
  const s = (await readSiteData()).settings;
  const ph = de ? "bitte im Dashboard ergänzen" : "add in dashboard";

  return (
    <LegalLayout eyebrow={t("imprint")} title={de ? "Impressum" : "Imprint (Impressum)"}>
      <h2>{de ? "Angaben gemäß § 5 DDG" : "Information pursuant to § 5 DDG"}</h2>
      <p>
        {s.studioName}
        <br />
        <Filled value={s.legalName} placeholder={de ? "Vor- und Nachname(n)" : "Full legal name(s)"} />
        <br />
        <span className="whitespace-pre-line">
          <Filled value={s.legalAddress} placeholder={de ? "Straße, PLZ Ort" : "Street, postcode city"} />
        </span>
        <br />
        {de ? "Deutschland" : "Germany"}
      </p>

      <h2>{de ? "Kontakt" : "Contact"}</h2>
      <p>
        E-Mail: <a href={`mailto:${s.email}`}>{s.email}</a>
        {s.phone ? (
          <>
            <br />
            {de ? "Telefon" : "Phone"}: <a href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a>
          </>
        ) : null}
      </p>

      {s.vatId ? (
        <>
          <h2>{de ? "Umsatzsteuer-ID" : "VAT ID"}</h2>
          <p>
            {de
              ? "Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:"
              : "VAT identification number pursuant to § 27 a of the German VAT Act:"}
            <br />
            {s.vatId}
          </p>
        </>
      ) : null}

      <h2>
        {de
          ? "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV"
          : "Responsible for content pursuant to § 18 (2) MStV"}
      </h2>
      <p>
        <Filled value={s.legalName} placeholder={ph} />
        <br />
        <span className="whitespace-pre-line">
          <Filled value={s.legalAddress} placeholder={ph} />
        </span>
      </p>

      <h2>{de ? "Verbraucherstreitbeilegung" : "Consumer dispute resolution"}</h2>
      <p>
        {de
          ? "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
          : "We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board."}
      </p>

      <h2>{de ? "Urheberrecht" : "Copyright"}</h2>
      <p>
        {de
          ? `Alle Fotografien auf dieser Website sind urheberrechtlich geschützt und dürfen ohne schriftliche Zustimmung von ${s.studioName} nicht vervielfältigt, bearbeitet oder verbreitet werden.`
          : `All photographs on this website are protected by copyright and may not be reproduced, edited or distributed without written permission from ${s.studioName}.`}
      </p>
    </LegalLayout>
  );
}
