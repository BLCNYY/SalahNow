import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://waqt.life"),
  title: "Waqt - Prayer Times",
  description: "Beautiful prayer times app with offline support. Real-time countdowns, multi-language support, and works offline as a PWA.",
  manifest: "/manifest.json",
  keywords: ["prayer times", "salat", "namaz", "islamic", "muslim", "adhan", "athan", "pwa", "offline"],
  authors: [{ name: "blcnyy" }],
  creator: "blcnyy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Waqt",
    title: "Waqt - Prayer Times",
    description: "Beautiful prayer times app with offline support. Real-time countdowns, multi-language support, and works offline as a PWA.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Waqt - Prayer Times App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Waqt - Prayer Times",
    description: "Beautiful prayer times app with offline support. Real-time countdowns, multi-language support, and works offline as a PWA.",
    images: ["/og-image.png"],
    creator: "@blcnyy",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Waqt",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

function ServiceWorkerRegistration() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `,
      }}
    />
  );
}
