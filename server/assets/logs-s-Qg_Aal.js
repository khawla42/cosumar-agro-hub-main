import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { u as useAuth, a as useNavigate } from "./router-C2dGhf-y.js";
import { L as LoaderCircle } from "./loader-circle-Frk16I11.js";
import { T as TriangleAlert } from "./triangle-alert-Tp-JCQ7K.js";
import { S as Search } from "./search-CPNsxbBk.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-DlByY22N.js";
function AdminLogs() {
  const {
    user,
    apiFetch
  } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [logsList, setLogsList] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    fetchLogs();
  }, []);
  const fetchLogs = async () => {
    try {
      const response = await apiFetch(`/logs`);
      const data = await response.json();
      setLogsList(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };
  if (!user || user.role !== "admin") {
    navigate({
      to: "/auth/select-role"
    });
    return null;
  }
  const filtered = logsList.filter((l) => {
    if (search && !l.userName.toLowerCase().includes(search.toLowerCase()) && !l.action.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    return true;
  });
  const suspiciousIPs = reactExports.useMemo(() => {
    const failedAttemptsByIP = {};
    const suspicious = [];
    for (const log of logsList) {
      if (log.status === "failed") {
        failedAttemptsByIP[log.ipAddress] = (failedAttemptsByIP[log.ipAddress] || 0) + 1;
        if (failedAttemptsByIP[log.ipAddress] >= 3 && !suspicious.includes(log.ipAddress)) {
          suspicious.push(log.ipAddress);
        }
      }
    }
    return suspicious;
  }, [logsList]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Journaux du Système" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Historique des actions et connexions" })
    ] }),
    suspiciousIPs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 animate-fade-in-up", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-destructive/20 bg-destructive/5 p-4 flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-destructive/10 rounded-lg shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-destructive" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-destructive", children: "Activité suspecte détectée" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-destructive/80 mt-1", children: [
          "De multiples tentatives de connexion échouées ont été détectées depuis les adresses IP suivantes :",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold ml-1", children: suspiciousIPs.join(", ") }),
          ". Veuillez vérifier les accès."
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Rechercher...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "px-3 py-2.5 rounded-lg border border-input bg-background text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Tous les statuts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "success", children: "Succès" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "failed", children: "Échoué" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "critical", children: "Critique" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase", children: "Utilisateur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase", children: "Rôle" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase", children: "Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase", children: "IP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase", children: "Statut" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-muted/50 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm text-foreground", children: l.userName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground capitalize", children: l.role })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-sm text-muted-foreground", children: l.action }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-sm text-muted-foreground font-mono", children: l.ipAddress }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-xs font-mono text-muted-foreground", children: l.timestamp }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${l.status === "success" ? "bg-success/10 text-success" : l.status === "critical" ? "bg-destructive text-white animate-pulse" : "bg-destructive/10 text-destructive"}`, children: l.status === "success" ? "Succès" : l.status === "critical" ? "CRITIQUE" : "Échoué" }) })
        ] }, l.id)) })
      ] }) })
    ] })
  ] });
}
export {
  AdminLogs as component
};
