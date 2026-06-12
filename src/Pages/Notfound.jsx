import React from "react";
export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-68px)] bg-gradient-to-b from-emerald-50 to-white px-6 py-16">
      <section className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-lg shadow-emerald-950/5">
        <span className="mb-4 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          404
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The page you are looking for does not exist or is no longer available.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-950/10 transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        >
          Back to home
        </a>
      </section>
    </main>
  );
}
