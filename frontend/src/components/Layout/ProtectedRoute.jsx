import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function ProtectedRoute() {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
          Loading...
        </div>
      </div>
    );
  }

  return <Outlet />;
}
