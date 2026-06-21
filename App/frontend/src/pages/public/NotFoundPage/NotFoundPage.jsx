import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 px-4 py-20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Decorative blurred accent blobs */}
      <div className="pointer-events-none absolute -top-24 -left-32 h-[28rem] w-[28rem] rounded-full bg-[var(--color-primary)]/5 blur-3xl dark:bg-[var(--color-primary)]/10" />
      <div className="pointer-events-none absolute -bottom-24 -right-32 h-[28rem] w-[28rem] rounded-full bg-[var(--color-secondary)]/5 blur-3xl dark:bg-[var(--color-secondary)]/10" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:bg-[var(--color-primary)]/20">
          <svg
            className="h-10 w-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7.5" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
            <line x1="8" y1="8" x2="14" y2="14" />
            <line x1="14" y1="8" x2="8" y2="14" />
          </svg>
        </div>

        {/* Big 404 */}
        <h1 className="text-8xl font-extrabold leading-none text-[var(--color-primary)] sm:text-9xl">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-slate-100">
          Lo sentimos, esta página no existe
        </h2>

        <p className="mt-3 max-w-md text-gray-600 dark:text-slate-400">
          Es posible que el enlace esté roto o que la página se haya movido.
          Verificá la dirección o volvé al inicio.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 font-medium text-white shadow-sm transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
