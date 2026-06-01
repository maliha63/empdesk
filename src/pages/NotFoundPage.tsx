import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <p className="text-6xl font-bold font-mono text-surface-border">404</p>
      <p className="text-slate-400">Page not found.</p>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-brand-500 hover:underline"
      >
        ← Go back
      </button>
    </div>
  );
}