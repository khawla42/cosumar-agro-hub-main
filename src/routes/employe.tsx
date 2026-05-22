import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/employe")({
  head: () => ({ meta: [{ title: "Espace Employé — COSUMAR" }] }),
  component: EmployeLayout,
});

function EmployeLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "employe")) {
      navigate({ to: "/auth/login", search: { role: "employe" } });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "employe") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}