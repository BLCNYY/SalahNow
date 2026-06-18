import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Salah[Now]",
  description: "Privacy policy for Salah[Now].",
};

const lastUpdated = "June 18, 2026";
const contactEmail = "hi@blcnyy.dev";

const sections = [
  {
    title: "Information Salah[Now] Uses",
    body: [
      "Salah[Now] uses your selected location, and optionally your device location if you choose to grant location permission, to show prayer times and find the nearest supported city.",
      "The app stores your selected location, favorites, language, calendar preference, and display settings locally on your device so the app can remember them between launches.",
      "If you contact support, we receive the email address and message content you send so we can respond.",
    ],
  },
  {
    title: "How Information Is Used",
    body: [
      "Location information is used only to provide app functionality, including prayer-time calculations, location search, current-location setup, and related display features.",
      "Salah[Now] does not use your location for advertising, tracking, profiling, or selling data.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "To retrieve prayer times, Salah[Now] may send a selected city, country, coordinates, or prayer-time provider identifier to prayer-time services such as AlAdhan or Diyanet/eMushaf endpoints.",
      "Those services receive the request needed to return prayer-time data. Salah[Now] does not send your name, email address, contacts, photos, or payment information with those requests.",
    ],
  },
  {
    title: "No Tracking Or Advertising",
    body: [
      "Salah[Now] does not include third-party advertising SDKs.",
      "Salah[Now] does not track you across apps or websites owned by other companies.",
      "The initial App Store release does not include accounts, subscriptions, or in-app purchases.",
    ],
  },
  {
    title: "Data Retention And Control",
    body: [
      "Preferences stored on your device remain there until you change them, delete them, or uninstall the app.",
      "You can deny or revoke location permission in iOS Settings. The app will still let you search for and select a location manually.",
      "Support emails are retained only as needed to handle your request and maintain support records.",
    ],
  },
  {
    title: "Children",
    body: [
      "Salah[Now] is a general prayer-time utility and is not designed to collect personal information from children.",
    ],
  },
  {
    title: "Changes",
    body: [
      "This policy may be updated when Salah[Now] changes. The updated date above will change when the policy is revised.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-background px-6 py-12 text-foreground sm:px-10">
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-4">
          <Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href="/">
            Salah[Now]
          </Link>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            This policy explains how Salah[Now] handles information in the iOS app and web app.
          </p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section className="space-y-3" key={section.title}>
              <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
              <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="text-xl font-semibold tracking-tight">Contact</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            If you have questions about this privacy policy, email{" "}
            <a className="text-foreground underline underline-offset-4" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
