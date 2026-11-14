export function PageLoading() {
  return (
    <div aria-busy className="animate-pulse space-y-4">
      <div className="h-9 w-64 bg-panel" />
      <div className="h-40 w-full bg-panel" />
      <div className="h-40 w-full bg-panel" />
      <p className="sr-only">Chargement…</p>
    </div>
  );
}

export function PageTitle({ title, hint }: { title: string; hint?: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h1 className="text-4xl font-light sm:text-[2.6rem]">{title}</h1>
      {hint && <p className="mt-2 text-[0.9375rem] text-sand">{hint}</p>}
    </div>
  );
}
