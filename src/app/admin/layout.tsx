import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Espace gérant", template: "%s — Espace gérant" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
