import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { u as useAuth, a as useNavigate } from "./router-C2dGhf-y.js";
import { S as StatCard } from "./StatCard-DkBOwhP1.js";
import { P as PRODUCTION_DATA } from "./mock-data-BDQZ8--q.js";
import { L as LoaderCircle } from "./loader-circle-Frk16I11.js";
import { T as TriangleAlert } from "./triangle-alert-Tp-JCQ7K.js";
import { U as Users } from "./users-b0TKxeqs.js";
import { C as ChartColumn } from "./chart-column-Cz9F7Ik0.js";
import { C as CreditCard } from "./credit-card-T9hW7jbN.js";
import { ai as ResponsiveContainer, aj as CartesianGrid, ak as XAxis, al as YAxis, am as Tooltip } from "./CartesianChart-CjxWrusz.js";
import { A as AreaChart, a as Area } from "./AreaChart-Bv0x84oN.js";
import { A as Activity } from "./activity-CZteVqkA.js";
import { S as Shield } from "./shield-D7bPpCZF.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-DlByY22N.js";
import "./clsx-DgYk2OaC.js";
function AdminDashboard() {
  const {
    user,
    apiFetch,
    isLoading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const fetchStats = reactExports.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch(`/dashboard-stats`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err.message || "Une erreur est survenue lors du chargement des statistiques.");
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);
  reactExports.useEffect(() => {
    if (!authLoading && user && user.role === "admin") {
      fetchStats();
    }
  }, [authLoading, user, fetchStats]);
  if (authLoading || loading && !stats) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Chargement des données..." })
    ] }) });
  }
  if (!user || user.role !== "admin") {
    return null;
  }
  if (error && !stats) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-8 bg-destructive/5 rounded-2xl border border-destructive/10 max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-12 w-12 text-destructive mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-foreground mb-2", children: "Oups ! Quelque chose a mal tourné" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => fetchStats(), className: "px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors", children: "Réessayer" })
    ] }) });
  }
  const failedLogins = stats?.recentLogs ? stats.recentLogs.filter((l) => l.status === "failed" || l.status === "critical").length : 0;
  const recentLogs = stats?.recentLogs || [];
  const formatValue = (val) => {
    if (val === void 0 || val === null) return "0";
    const num = Number(val);
    return isNaN(num) ? "0" : num.toLocaleString();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Administration" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Vue d'ensemble du système" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Utilisateurs Totaux", value: formatValue(stats?.totalUsers), icon: Users, trend: {
        value: 12,
        label: "ce mois"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Production Totale", value: `${formatValue(stats?.totalProduction)} T`, icon: ChartColumn, trend: {
        value: 8,
        label: "vs mois dernier"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Paiements en attente", value: `${formatValue(stats?.pendingPayments)} MAD`, icon: CreditCard }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Alertes Sécurité", value: failedLogins, icon: TriangleAlert, subtitle: "Tentatives échouées" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 bg-card rounded-xl border border-border p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground mb-4", children: "Évolution de la Production" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: PRODUCTION_DATA, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "colorCult", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "oklch(0.45 0.12 150)", stopOpacity: 0.3 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "oklch(0.45 0.12 150)", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "oklch(0.92 0.01 100)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", fontSize: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { fontSize: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "cultivated", stroke: "oklch(0.45 0.12 150)", fill: "url(#colorCult)", name: "Cultivé" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "harvested", stroke: "oklch(0.65 0.15 85)", fill: "oklch(0.65 0.15 85 / 0.1)", name: "Récolté" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-foreground mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-primary" }),
          "Activité Récente"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: recentLogs.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-lg bg-muted/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-0.5 h-2 w-2 rounded-full ${log.status === "success" ? "bg-success" : "bg-destructive"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: log.userName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: log.action }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(log.timestamp).toLocaleString("fr-FR") })
          ] })
        ] }, log.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-3 gap-4", children: [{
      label: "Gérer Utilisateurs",
      desc: "Créer et modifier des comptes",
      icon: Users,
      to: "/admin/users"
    }, {
      label: "Voir les Journaux",
      desc: "Consulter l'activité du système",
      icon: Shield,
      to: "/admin/logs"
    }, {
      label: "Suivi Paiements",
      desc: "Gérer les paiements agriculteurs",
      icon: CreditCard,
      to: "/admin/payments"
    }].map((action) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
      to: action.to
    }), className: "flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(action.icon, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm text-foreground", children: action.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: action.desc })
      ] })
    ] }, action.label)) })
  ] });
}
export {
  AdminDashboard as component
};
