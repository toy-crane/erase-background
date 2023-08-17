import { AmplitudeProvider } from "@/lib/amplitude";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import SiteHeader from "@/components/site-header";

export const metadata = {
  title: "배경화면 깔끔하게 지우기",
  description: "배경화면을 깔끔하게 지우고, 투명 배경으로 만들어보세요!",
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
