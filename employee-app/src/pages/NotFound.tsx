import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--primary)] px-6 text-center">
      <h1 className="text-8xl font-bold text-[var(--text-secondary)]">404</h1>

      <h2 className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">
        Page Not Found
      </h2>

      <p className="mt-2 max-w-md text-[var(--text-secondary)]">
        Sorry, the page you are looking for doesn't exist or may have been
        moved.
      </p>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 transition hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-lg bg-[var(--secondary)] px-5 py-2.5 text-white transition hover:opacity-90"
        >
          <Home size={18} />
          Dashboard
        </button>
      </div>
    </div>
  );
}

export default NotFound;
