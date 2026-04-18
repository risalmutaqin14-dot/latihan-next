import type { Metadata } from "next";
import Script from "next/script";
import I18nProvider from "../components/I18nProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://latihan.id"),
  title: "Latihan.id - Platform Edukasi Terintegrasi",
  description: "Solusi manajemen pendidikan terbaik untuk institusi Anda.",
  keywords: ["Latihan.id", "LMS", "Manajemen Sekolah", "Education Tech"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Latihan.id",
    description: "Solusi manajemen pendidikan terintegrasi.",
    url: "https://latihan.id",
    siteName: "Latihan.id",
    images: [
      {
        url: "/og-image.jpg", // Simpan di folder public
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '441263355307477');
            fbq('track', 'PageView');
          `}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-PGJDS23TJ2`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PGJDS23TJ2');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://www.facebook.com/tr?id=441263355307477&ev=PageView&noscript=1"
          />
        </noscript>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
