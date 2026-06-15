import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { StatCard } from "@/components/StatCard";
import {
  Users,
  BarChart3,
  CreditCard,
  Truck,
  Search,
  Loader2,
  Activity,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/employe/")({
  head: () => ({ meta: [{ title: "Tableau de Bord — Employé COSUMAR" }] }),
  component: EmployeDashboardIndex,
});

function EmployeDashboardIndex() {
  const { apiFetch } = useAuth();
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [farmers, setFarmers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [productionData, setProductionData] = useState<any[]>([]);
  const [qualityData, setQualityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmersRes, statsRes] = await Promise.all([
          apiFetch("/farmers"),
          apiFetch("/dashboard-stats"),
        ]);

        const farmersList = await farmersRes.json();
        const dashboardStats = await statsRes.json();

        setFarmers(Array.isArray(farmersList) ? farmersList : []);
        setStats(dashboardStats);
        setProductionData(
          Array.isArray(dashboardStats?.productionChart) ? dashboardStats.productionChart : [],
        );

        setQualityData([
          { name: "Excellente", value: 35, fill: "oklch(0.45 0.12 150)" },
          { name: "Bonne", value: 40, fill: "oklch(0.65 0.15 85)" },
          { name: "Moyenne", value: 18, fill: "oklch(0.55 0.15 200)" },
          { name: "Faible", value: 7, fill: "oklch(0.65 0.2 30)" },
        ]);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setFarmers([]);
        setProductionData([]);
        setLoading(false);
      }
    };
    fetchData();
  }, [apiFetch]);

  const regions = [...new Set((Array.isArray(farmers) ? farmers : []).map((f) => f.region))];
  const filtered = (Array.isArray(farmers) ? farmers : []).filter((f) => {
    if (search && !f.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterRegion !== "all" && f.region !== filterRegion) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const farmersSafe = Array.isArray(farmers) ? farmers : [];
  // Utiliser les stats globales du backend si disponibles, sinon calculer à partir de la liste
  const totalCultivated =
    stats?.totalCultivated || farmersSafe.reduce((acc, f) => acc + (f.cultivatedQty || 0), 0);

  const formatNum = (val: any) => {
    return (Number(val) || 0).toLocaleString("fr-FR", {
      maximumFractionDigits: 1,
    });
  };

  const paidCount =
    stats?.totalPaid !== undefined
      ? stats.totalPaid
      : farmersSafe.filter((f) => f.paymentStatus === "Payé").length;
  const deliveredCount =
    stats?.deliveredCount !== undefined
      ? stats.deliveredCount
      : farmersSafe.filter((f) => f.deliveryStatus === "Livré").length;
  const totalDeliveries =
    stats?.totalDeliveries !== undefined ? stats.totalDeliveries : farmersSafe.length;

  return (
    <>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord — Employé</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Suivi des agriculteurs et des activités en temps réel
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Agriculteurs"
          value={stats?.totalFarmers || farmersSafe.length}
          icon={Users}
          trend={{ value: 5, label: "ce mois" }}
        />
        <StatCard title="Total Cultivé" value={`${formatNum(totalCultivated)} ha`} icon={BarChart3} />
        <StatCard
          title="Paiements Effectués"
          value={`${paidCount > 0 ? paidCount.toLocaleString() : "0"} MAD`}
          icon={CreditCard}
        />
        <StatCard title="Livraisons" value={`${deliveredCount}/${totalDeliveries}`} icon={Truck} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-foreground">Production Mensuelle</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" /> Cultivé
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-chart-2" /> Récolté
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 100)" vertical={false} />
              <XAxis dataKey="month" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis fontSize={12} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "oklch(0.95 0.01 100)" }} />
              <Bar
                dataKey="cultivated"
                fill="oklch(0.45 0.12 150)"
                radius={[4, 4, 0, 0]}
                name="Cultivé"
                barSize={30}
              />
              <Bar
                dataKey="harvested"
                fill="oklch(0.65 0.15 85)"
                radius={[4, 4, 0, 0]}
                name="Récolté"
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Activités Récentes
          </h3>
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
            {stats?.recentLogs?.map((log: any) => (
              <div
                key={log.id}
                className="flex gap-3 items-start p-2 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
              >
                <div
                  className={`mt-1 p-1.5 rounded-lg shrink-0 ${
                    log.status === "success"
                      ? "bg-success/10 text-success"
                      : log.status === "critical"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-warning/10 text-warning"
                  }`}
                >
                  <Clock className="h-3 w-3" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{log.userName}</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                    {log.action}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">{log.timestamp}</p>
                </div>
              </div>
            ))}
            {(!stats?.recentLogs || stats.recentLogs.length === 0) && (
              <div className="py-10 text-center text-xs text-muted-foreground">
                Aucune activité récente détectée.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground mb-4">Aperçu des Agriculteurs</h3>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un agriculteur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-input bg-background text-sm"
            >
              <option value="all">Toutes les régions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Agriculteur
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Région
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Cultivé
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Paiement
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Livraison
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr
                  key={f.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-sm text-foreground">{f.name || "Inconnu"}</div>
                    <div className="text-xs text-muted-foreground">{f.cin || "N/A"}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{f.region || "N/A"}</td>
                  <td className="px-5 py-4 text-sm text-foreground text-right">
                    {f.cultivatedQty || 0} ha
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={f.paymentStatus || "En attente"} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={f.deliveryStatus || "En cours"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function QualityBadge({ quality }: { quality: string }) {
  const colors: Record<string, string> = {
    Excellente: "bg-success/10 text-success",
    Bonne: "bg-chart-2/20 text-chart-2",
    Moyenne: "bg-warning/10 text-warning",
    Faible: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colors[quality] || ""}`}
    >
      {quality}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Payé: "bg-success/10 text-success",
    Livré: "bg-success/10 text-success",
    "En attente": "bg-warning/10 text-warning",
    "En cours": "bg-chart-3/20 text-chart-3",
    "Non payé": "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || ""}`}
    >
      {status}
    </span>
  );
}
