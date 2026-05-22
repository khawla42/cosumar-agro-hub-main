import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { u as useAuth, a as useNavigate, L as Link } from "./router-C2dGhf-y.js";
import { S as StatCard } from "./StatCard-DkBOwhP1.js";
import { c as cosumarLogo } from "./cosumar-logo-BFmipKES.js";
import { L as LoaderCircle } from "./loader-circle-Frk16I11.js";
import { U as User } from "./user-BQYz2rMJ.js";
import { L as LogOut } from "./log-out-DVMrXd0D.js";
import { S as Sprout } from "./sprout-D5xbx29P.js";
import { C as ChartColumn } from "./chart-column-Cz9F7Ik0.js";
import { c as createLucideIcon } from "./createLucideIcon-DlByY22N.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
      key: "1ptgy4"
    }
  ],
  [
    "path",
    {
      d: "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",
      key: "1sl1rz"
    }
  ]
];
const Droplets = createLucideIcon("droplets", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
function ClientDashboard() {
  const {
    user,
    logout,
    apiFetch,
    isLoading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = reactExports.useState(null);
  const [payments, setPayments] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [formData, setFormData] = reactExports.useState({
    cultivatedQty: "",
    harvestedQty: "",
    quality: "Bonne",
    landStatus: "Irriguée"
  });
  const [submitted, setSubmitted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!authLoading && (!user || user.role !== "client")) {
      navigate({
        to: "/auth/login",
        search: {
          role: "client"
        }
      });
    }
  }, [user, authLoading, navigate]);
  reactExports.useEffect(() => {
    if (user) {
      Promise.all([fetchFarmerStats(), fetchFarmerPayments()]).finally(() => setLoading(false));
    }
  }, [user]);
  const fetchFarmerStats = async () => {
    try {
      const response = await apiFetch(`/farmer-stats/${user?.id}`);
      const data = await response.json();
      setStats(data);
      setFormData((prev) => ({
        ...prev,
        cultivatedQty: data.landArea.toString()
      }));
    } catch (error) {
      console.error("Error fetching farmer stats:", error);
    }
  };
  const fetchFarmerPayments = async () => {
    try {
      const response = await apiFetch(`/farmer-payments/${user?.id}`);
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching farmer payments:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiFetch(`/submit-production`, {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          cultivatedQty: formData.cultivatedQty,
          harvestedQty: formData.harvestedQty
        })
      });
      if (response.ok) {
        setSubmitted(true);
        fetchFarmerStats();
        setTimeout(() => setSubmitted(false), 3e3);
        setFormData((prev) => ({
          ...prev,
          harvestedQty: ""
        }));
      }
    } catch (error) {
      console.error("Error submitting production:", error);
    }
  };
  if (authLoading || user && loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  if (!user || user.role !== "client") {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-card border-b border-border sticky top-0 z-40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cosumarLogo, alt: "COSUMAR", className: "h-8 w-8 object-contain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-heading text-lg font-bold text-primary", children: "COSUMAR" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: user.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: logout, className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
          "Déconnexion"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 animate-fade-in-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-foreground", children: [
          "Bienvenue, ",
          user.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Gérez vos données agricoles" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Surface Cultivée", value: `${stats?.landArea || 0} ha`, icon: Sprout }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Récolte Totale", value: `${stats?.totalHarvested || 0} T`, icon: ChartColumn }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Culture", value: stats?.cropType || "Betterave", icon: Star }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Irrigation", value: "Active", icon: Droplets, subtitle: "Système goutte à goutte" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 lg:p-8 animate-fade-in-up animation-delay-200 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground mb-6", children: "Saisir vos données agricoles" }),
        submitted && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-3 rounded-lg bg-success/10 text-success text-sm font-medium", children: "✓ Données enregistrées avec succès" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "grid sm:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Quantité cultivée (hectares)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: formData.cultivatedQty, onChange: (e) => setFormData((p) => ({
              ...p,
              cultivatedQty: e.target.value
            })), placeholder: "Ex: 45", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Quantité récoltée (tonnes)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: formData.harvestedQty, onChange: (e) => setFormData((p) => ({
              ...p,
              harvestedQty: e.target.value
            })), placeholder: "Ex: 38", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Qualité de production" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: formData.quality, onChange: (e) => setFormData((p) => ({
              ...p,
              quality: e.target.value
            })), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Excellente" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Bonne" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Moyenne" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Faible" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Statut du terrain" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: formData.landStatus, onChange: (e) => setFormData((p) => ({
              ...p,
              landStatus: e.target.value
            })), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Irriguée" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Non irriguée" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors", children: "Enregistrer les données" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden animate-fade-in-up animation-delay-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-border bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Historique de vos Paiements" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Suivi de vos règlements et factures" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/50 uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold", children: "Méthode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold text-right", children: "Montant" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold", children: "Statut" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: payments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-6 py-12 text-center text-muted-foreground italic", children: "Aucun historique de paiement disponible." }) }) : payments.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-muted-foreground", children: new Date(p.date).toLocaleDateString("fr-FR") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: p.method || "Virement" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right font-bold text-foreground", children: [
              Number(p.amount).toLocaleString(),
              " MAD"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2.5 py-1 rounded-full text-xs font-medium ${p.status === "Payé" || p.status === "completed" ? "bg-success/10 text-success" : p.status === "En attente" || p.status === "pending" ? "bg-amber-500/10 text-amber-500" : "bg-destructive/10 text-destructive"}`, children: p.status === "completed" ? "Payé" : p.status === "pending" ? "En attente" : p.status }) })
          ] }, p.id)) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  ClientDashboard as component
};
