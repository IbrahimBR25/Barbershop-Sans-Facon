import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { Monogram } from "@/components/ui/icons";
import { isAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Connexion" };

async function RedirectIfLoggedIn() {
  if (await isAdmin()) redirect("/admin");
  return null;
}

export default function LoginPage() {
  return (
    <main className="glow-top flex flex-1 items-center">
      <Suspense fallback={null}>
        <RedirectIfLoggedIn />
      </Suspense>
      <div className="container-x max-w-md py-16 text-center">
        <Monogram />
        <p className="eyebrow mt-6">Espace gérant</p>
        <h1 className="mt-4 text-5xl">Sans Façon</h1>
        <LoginForm />
      </div>
    </main>
  );
}
