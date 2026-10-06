import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Filled, LegalLayout } from "@/components/legal/LegalLayout";
import type { AppLocale } from "@/i18n/routing";
import { readSiteData, usingSupabase } from "@/lib/data/store";
import { inquiryEmailEnabled } from "@/lib/notify";
import { pageMetadata } from "@/lib/site";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as AppLocale;
  const data = await readSiteData();
  const t = await getTranslations({ locale: loc, namespace: "legal" });
  return pageMetadata({
    locale: loc,
    path: "/datenschutz",
    title: `${t("privacy")} — ${data.settings.studioName}`,
    description: `${t("privacy")} ${data.settings.studioName}`,
    settings: data.settings,
  });
}

export default async function DatenschutzPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const de = locale === "de";
  const t = await getTranslations("legal");
  const s = (await readSiteData()).settings;
  const ph = de ? "bitte im Dashboard ergänzen" : "add in dashboard";

  return (
    <LegalLayout eyebrow={t("privacy")} title={de ? "Datenschutzerklärung" : "Privacy policy"}>
      <h2>{de ? "1. Verantwortliche Stelle" : "1. Controller"}</h2>
      <p>
        {s.studioName}
        <br />
        <Filled value={s.legalName} placeholder={ph} />
        <br />
        <span className="whitespace-pre-line">
          <Filled value={s.legalAddress} placeholder={ph} />
        </span>
        <br />
        E-Mail: <a href={`mailto:${s.email}`}>{s.email}</a>
      </p>

      <h2>{de ? "2. Das Wichtigste in Kürze" : "2. The short version"}</h2>
      <p>
        {de
          ? "Wir nutzen keine Werbe- oder Marketing-Tools. Google Analytics wird nur geladen, wenn ihr im Cookie-Banner zustimmt; ohne Zustimmung setzen wir keine Cookies. Ansonsten verarbeiten wir nur die Daten, die technisch zum Ausliefern der Seite nötig sind, und die Angaben, die ihr uns über das Anfrageformular oder per E-Mail schickt."
          : "We use no advertising or marketing tools. Google Analytics only loads if you agree in the cookie banner; without consent we set no cookies. Otherwise we only process data technically required to deliver the site, and the details you send us through the inquiry form or by email."}
      </p>

      <h2>{de ? "3. Hosting und Server-Logfiles" : "3. Hosting and server log files"}</h2>
      <p>
        {de
          ? "Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA gehostet. Beim Aufruf werden automatisch technische Daten verarbeitet (z. B. IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browser und Betriebssystem), um die Website sicher und stabil auszuliefern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren Betrieb). Mit Vercel besteht ein Auftragsverarbeitungsvertrag; Übermittlungen in die USA erfolgen auf Grundlage des EU-US Data Privacy Framework bzw. von Standardvertragsklauseln."
          : "This website is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. When you visit, technical data is processed automatically (e.g. IP address, date and time, page requested, browser and operating system) to deliver the site securely and reliably. The legal basis is Art. 6(1)(f) GDPR (legitimate interest in secure operation). A data processing agreement is in place with Vercel; transfers to the USA are based on the EU-US Data Privacy Framework or standard contractual clauses."}
      </p>

      <h2>{de ? "4. Anfrageformular und E-Mail" : "4. Inquiry form and email"}</h2>
      <p>
        {de
          ? "Wenn ihr uns über das Formular oder per E-Mail kontaktiert, verarbeiten wir eure Angaben (Name, E-Mail-Adresse, Anlass, Datum, Nachricht), um eure Anfrage zu beantworten und ggf. ein Angebot zu erstellen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) sowie Art. 6 Abs. 1 lit. a DSGVO (eure Einwilligung). Wir löschen die Daten, sobald die Anfrage abgeschlossen ist und keine gesetzlichen Aufbewahrungspflichten mehr bestehen."
          : "When you contact us via the form or by email, we process your details (name, email address, occasion, date, message) to answer your inquiry and prepare an offer if requested. The legal basis is Art. 6(1)(b) GDPR (pre-contractual steps) and Art. 6(1)(a) GDPR (your consent). We delete the data once the inquiry is concluded and no statutory retention obligations remain."}
      </p>
      <p>
        {de
          ? "Wenn ihr eure Anfrage per WhatsApp sendet, wird sie über WhatsApp (WhatsApp Ireland Ltd. / Meta) übertragen; dafür gelten zusätzlich die Datenschutzbestimmungen von WhatsApp. Ihr könnt uns alternativ jederzeit per E-Mail schreiben."
          : "If you send your inquiry via WhatsApp, it is transmitted through WhatsApp (WhatsApp Ireland Ltd. / Meta), whose privacy policy also applies. You can always email us instead."}
      </p>
      {usingSupabase ? (
        <p>
          {de
            ? "Anfragen und Website-Inhalte werden bei Supabase Inc. (Rechenzentrum in der EU) als Auftragsverarbeiter gespeichert."
            : "Inquiries and website content are stored with Supabase Inc. (EU data centre) as a data processor."}
        </p>
      ) : null}
      {inquiryEmailEnabled ? (
        <p>
          {de
            ? "Zur Benachrichtigung über neue Anfragen nutzen wir den E-Mail-Dienst Resend (Resend Inc., USA) als Auftragsverarbeiter. Übermittlungen in die USA erfolgen auf Grundlage von Standardvertragsklauseln."
            : "To notify us of new inquiries we use the email service Resend (Resend Inc., USA) as a data processor. Transfers to the USA are based on standard contractual clauses."}
        </p>
      ) : null}

      <h2>{de ? "5. Schriftarten, Bilder und Video" : "5. Fonts, images and video"}</h2>
      <p>
        {de
          ? "Schriftarten, Bilder und das Video werden von unserem eigenen Server ausgeliefert. Es findet dabei keine Verbindung zu Google Fonts oder anderen Drittanbietern in eurem Browser statt."
          : "Fonts, images and the video are served from our own server. Your browser does not connect to Google Fonts or other third parties for them."}
      </p>

      <h2>{de ? "6. Links zu sozialen Netzwerken" : "6. Links to social networks"}</h2>
      <p>
        {de
          ? "Wir verlinken auf unsere Profile (z. B. Instagram, TikTok) und bieten einen WhatsApp-Link an. Es handelt sich um einfache Links — Daten werden erst übertragen, wenn ihr sie anklickt. Dann gelten die Datenschutzbestimmungen des jeweiligen Anbieters (Meta Platforms Ireland Ltd. bzw. TikTok Technology Ltd.)."
          : "We link to our profiles (e.g. Instagram, TikTok) and offer a WhatsApp link. These are plain links — no data is transferred until you click them. Then the privacy policy of the respective provider applies (Meta Platforms Ireland Ltd. or TikTok Technology Ltd.)."}
      </p>

      <h2>{de ? "7. Webanalyse mit Google Analytics" : "7. Web analytics with Google Analytics"}</h2>
      <p>
        {de
          ? "Nur mit eurer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG) nutzen wir Google Analytics 4 der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Dabei werden Cookies gesetzt und Nutzungsdaten (z. B. aufgerufene Seiten, Verweildauer, Gerätetyp, ungefährer Standort) pseudonymisiert ausgewertet; IP-Adressen werden gekürzt. Eine Übermittlung in die USA ist möglich und erfolgt auf Grundlage des EU-US Data Privacy Framework. Die Daten werden nach 14 Monaten gelöscht."
          : "Only with your consent (Art. 6(1)(a) GDPR, § 25(1) TDDDG) we use Google Analytics 4 by Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. It sets cookies and evaluates usage data (e.g. pages viewed, time on page, device type, approximate location) in pseudonymised form; IP addresses are truncated. Data may be transferred to the USA on the basis of the EU-US Data Privacy Framework. Data is deleted after 14 months."}
      </p>
      <p>
        {de
          ? "Ihr könnt eure Einwilligung jederzeit über „Cookie-Einstellungen“ im Seitenfuß widerrufen."
          : "You can withdraw your consent at any time via “Cookie settings” in the footer."}
      </p>

      <h2>{de ? "8. Eure Rechte" : "8. Your rights"}</h2>
      <p>
        {de
          ? "Ihr habt jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Eine erteilte Einwilligung könnt ihr jederzeit mit Wirkung für die Zukunft widerrufen. Schreibt uns dazu einfach eine E-Mail."
          : "You have the right at any time to access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and to object (Art. 21). You may withdraw consent at any time with effect for the future. Just send us an email."}
      </p>
      <p>
        {de
          ? "Außerdem habt ihr das Recht, euch bei einer Datenschutz-Aufsichtsbehörde zu beschweren, z. B. bei der Berliner Beauftragten für Datenschutz und Informationsfreiheit, Alt-Moabit 59–61, 10555 Berlin."
          : "You also have the right to lodge a complaint with a data protection authority, e.g. the Berlin Commissioner for Data Protection and Freedom of Information, Alt-Moabit 59–61, 10555 Berlin."}
      </p>

      <h2>{de ? "9. Fotos von euch" : "9. Photos of you"}</h2>
      <p>
        {de
          ? "Fotos aus Shootings veröffentlichen wir auf dieser Website oder in sozialen Netzwerken nur mit eurer ausdrücklichen Einwilligung. Ihr könnt diese jederzeit widerrufen — wir entfernen die Bilder dann."
          : "We only publish photos from sessions on this website or on social networks with your explicit consent. You can withdraw it at any time and we will remove the images."}
      </p>

      <p className="mt-12 text-xs text-muted">
        {t("updated")}: {de ? "Oktober 2026" : "October 2026"}
      </p>
    </LegalLayout>
  );
}
