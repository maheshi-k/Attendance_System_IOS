import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

type NotFoundProps = {
  homePath?: string;
  homeLabel?: string;
};

function NotFound({
  homePath = "/dashboard",
  homeLabel = "Dashboard",
}: NotFoundProps) {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <p className="text-8xl font-bold tracking-tight text-[var(--secondary-action)]">
          404
        </p>
        <h1 className="mt-5 text-3xl font-semibold text-[var(--text-primary-dark)]">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[var(--text-primary-light)]">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-dashed)] px-5 py-2.5 font-medium text-[var(--text-primary-dark)] transition hover:bg-[var(--surface-input)]"
          >
            <ArrowLeft size={18} />
            Go back
          </button>
          <button
            type="button"
            onClick={() => navigate(homePath)}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--secondary-action)] px-5 py-2.5 font-medium text-white transition hover:bg-[var(--secondary-action-hover)]"
          >
            <Home size={18} />
            {homeLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
