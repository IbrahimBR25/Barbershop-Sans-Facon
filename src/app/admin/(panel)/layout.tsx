import { AdminNav } from "@/components/admin/AdminNav";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      <main className="container-x flex-1 py-8 sm:py-10">{children}</main>
    </>
  );
}
