import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support – Salah[Now]",
};

export default function SupportPage() {
  const email = "hi@blcnyy.dev";
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=mailto:${email}`} />
      <main style={{ display: "flex", minHeight: "100dvh", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
        <p>
          Redirecting you to email…<br />
          If nothing happens, <a href={`mailto:${email}`}>email {email}</a>.
        </p>
      </main>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.href = "mailto:${email}";`,
        }}
      />
    </>
  );
}
