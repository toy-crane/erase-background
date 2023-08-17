import { AmplitudeProvider } from "@/lib/amplitude";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import SiteHeader from "@/components/site-header";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["배경화면 지우기", "배경화면", "누끼따기"],
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.links.blog,
    },
  ],
  creator: siteConfig.author,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@alwaysfun2183",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-icon-180x180.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AmplitudeProvider apiKey={process.env.AMPLITUDE_KEY as string}>
        <body
          className={cn("min-h-screen bg-background font-sans antialiased")}
        >
          <div className="relative flex min-h-screen flex-col">{children}</div>
        </body>
      </AmplitudeProvider>
    </html>
  );
}
