import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { StatCard } from "@/components/StatCard";
import {
  Users,
  BarChart3,
  CreditCard,
  Shield,
  AlertTriangle,
  Activity,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState, useCallback } from "react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Administration — COSUMAR" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, apiFetch, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch(`/dashboard-stats`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      console.error("Error fetching stats:", err);
      setError(err.message || "Une erreur est survenue lors du chargement des statistiques.");
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    if (!authLoading && user && user.role === "admin") {
      fetchStats();
    }
  }, [authLoading, user, fetchStats]);

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

  if (authLoading || (loading && !stats)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-destructive/5 rounded-2xl border border-destructive/10 max-w-md">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">
            Oups ! Quelque chose a mal tourné
          </h3>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => fetchStats()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const failedLogins = Array.isArray(stats?.recentLogs)
    ? stats.recentLogs.filter((l: any) => l.status === "failed" || l.status === "critical").length
    : 0;
  const recentLogs = Array.isArray(stats?.recentLogs) ? stats.recentLogs : [];
  const productionChart = Array.isArray(stats?.productionChart) ? stats.productionChart : [];

  const formatValue = (val: any) => {
    if (val === undefined || val === null) return "0";
    const num = Number(val);
    return isNaN(num) ? "0" : num.toLocaleString();
  };

  return (
    <>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-foreground">Administration</h1>
        <p className="text-muted-foreground mt-1">Vue d'ensemble du système</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Utilisateurs Totaux"
          value={formatValue(stats?.totalUsers)}
          icon={Users}
          trend={{ value: 12, label: "ce mois" }}
        />
        <StatCard
          title="Production Totale"
          value={`${formatValue(stats?.totalProduction)} T`}
          icon={BarChart3}
          trend={{ value: 8, label: "vs mois dernier" }}
        />
        <StatCard
          title="Paiements en attente"
          value={`${formatValue(stats?.pendingPayments)} MAD`}
          icon={CreditCard}
        />
        <StatCard
          title="Alertes Sécurité"
          value={failedLogins}
          icon={AlertTriangle}
          subtitle="Tentatives échouées"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Évolution de la Production</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={productionChart}>
              <defs>
                <linearGradient id="colorCult" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.45 0.12 150)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.45 0.12 150)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 100)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="cultivated"
                stroke="oklch(0.45 0.12 150)"
                fill="url(#colorCult)"
                name="Cultivé"
              />
              <Area
                type="monotone"
                dataKey="harvested"
                stroke="oklch(0.65 0.15 85)"
                fill="oklch(0.65 0.15 85 / 0.1)"
                name="Récolté"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Activité Récente
          </h3>
          <div className="space-y-3">
            {recentLogs.map((log: any) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div
                  className={`mt-0.5 h-2 w-2 rounded-full ${log.status === "success" ? "bg-success" : "bg-destructive"}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{log.userName}</p>
                  <p className="text-xs text-muted-foreground">{log.action}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            label: "Gérer Utilisateurs",
            desc: "Créer et modifier des comptes",
            icon: Users,
            to: "/admin/users",
          },
          {
            label: "Voir les Journaux",
            desc: "Consulter l'activité du système",
            icon: Shield,
            to: "/admin/logs",
          },
          {
            label: "Suivi Paiements",
            desc: "Gérer les paiements agriculteurs",
            icon: CreditCard,
            to: "/admin/payments",
          },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate({ to: action.to })}
            className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
          >
            <div className="p-2.5 rounded-lg bg-primary/10">
              <action.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">{action.label}</h4>
              <p className="text-xs text-muted-foreground">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
