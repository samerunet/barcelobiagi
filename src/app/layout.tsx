import type { Metadata } from "next";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: "E-commerce Website UI Design",
  description: "Barcelo Biagi storefront experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
