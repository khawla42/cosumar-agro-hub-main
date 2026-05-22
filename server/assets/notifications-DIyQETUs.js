import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { u as useAuth, t as toast } from "./router-C2dGhf-y.js";
import { B as Button, C as Check, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter, I as Info } from "./button-D_M1Dp6_.js";
import { T as Trash2 } from "./trash-2-BlPK7cIS.js";
import { c as createLucideIcon } from "./createLucideIcon-DlByY22N.js";
import { B as Bell } from "./bell-B6zrSvJq.js";
import { T as TriangleAlert } from "./triangle-alert-Tp-JCQ7K.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./x-DVhXpGUG.js";
import "./clsx-DgYk2OaC.js";
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode);
function NotificationsPage() {
  const {
    apiFetch
  } = useAuth();
  const [activeTab, setActiveTab] = reactExports.useState("Toutes");
  const [notifications, setNotifications] = reactExports.useState([{
    id: 1,
    type: "urgent",
    title: "Alerte Météo - Fortes Pluies",
    message: "Des précipitations importantes sont prévues dans la région du Gharb dans les prochaines 48h. Veuillez conseiller aux agriculteurs de suspendre l'irrigation.",
    time: "Il y a 10 min",
    read: false,
    category: "Météo"
  }, {
    id: 2,
    type: "success",
    title: "Paiement Validé",
    message: "Le lot de paiements pour la coopérative Al Amal (Tadla) a été effectué avec succès.",
    time: "Il y a 1h",
    read: false,
    category: "Paiements"
  }, {
    id: 3,
    type: "warning",
    title: "Retard de Livraison",
    message: "Le camion L-405 a signalé une panne. Retard prévu de 2 heures pour la livraison à Sidi Bennour.",
    time: "Il y a 3h",
    read: true,
    category: "Logistique"
  }, {
    id: 4,
    type: "info",
    title: "Nouvelle Circulaire",
    message: "Les nouveaux barèmes de qualité pour la campagne 2026 sont maintenant disponibles dans le centre documentaire.",
    time: "Hier",
    read: true,
    category: "Système"
  }]);
  const [selectedActionNotif, setSelectedActionNotif] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const fetchSecurityAlerts = async () => {
      try {
        const response = await apiFetch("/logs");
        if (!response.ok) return;
        const logs = await response.json();
        const securityNotifs = logs.filter((l) => l.status === "critical").map((l, idx) => ({
          id: 1e3 + idx,
          type: "urgent",
          title: "Alerte Brute Force",
          message: l.details,
          time: l.timestamp,
          read: false,
          category: "Sécurité"
        }));
        if (securityNotifs.length > 0) {
          setNotifications((prev) => {
            const existingMessages = new Set(prev.map((n) => n.message));
            const uniqueNew = securityNotifs.filter((n) => !existingMessages.has(n.message));
            return [...uniqueNew, ...prev];
          });
        }
      } catch (err) {
        console.error("Failed to fetch security alerts:", err);
      }
    };
    fetchSecurityAlerts();
  }, [apiFetch]);
  const unreadCount = reactExports.useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const filteredNotifications = reactExports.useMemo(() => notifications.filter((notif) => {
    if (activeTab === "Non lues") return !notif.read;
    if (activeTab === "Urgentes") return notif.type === "urgent";
    return true;
  }), [notifications, activeTab]);
  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? {
      ...n,
      read: true
    } : n));
    toast.success("Notification marquée comme lue");
  };
  const markAllAsRead = () => {
    if (unreadCount === 0) return;
    setNotifications((prev) => prev.map((n) => ({
      ...n,
      read: true
    })));
    toast.success("Toutes les notifications ont été marquées comme lues");
  };
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.info("Notification supprimée");
  };
  const clearRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
    toast.info("Notifications lues effacées");
  };
  const handleTakeAction = (notif) => {
    setSelectedActionNotif(notif);
  };
  const confirmAction = () => {
    if (selectedActionNotif) {
      markAsRead(selectedActionNotif.id);
      setSelectedActionNotif(null);
      toast.success("Action enregistrée avec succès");
    }
  };
  const getIcon = (type) => {
    switch (type) {
      case "urgent":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-destructive" });
      case "success":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-success" });
      case "warning":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-warning" });
      case "info":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-5 w-5 text-primary" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-muted-foreground" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up max-w-4xl mx-auto pb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex flex-wrap justify-between items-end gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          "Centre de Notifications",
          unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm animate-pulse", children: unreadCount })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1.5", children: "Gérez vos alertes et communications en temps réel" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        notifications.some((n) => n.read) && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: clearRead, className: "text-muted-foreground hover:text-destructive", children: "Effacer les lues" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: markAllAsRead, disabled: unreadCount === 0, className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
          " Tout marquer comme lu"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border-b border-border bg-muted/30", children: ["Toutes", "Non lues", "Urgentes"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab(tab), className: `px-8 py-4 text-sm font-semibold transition-all relative ${activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`, children: [
        tab,
        activeTab === tab && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" })
      ] }, tab)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
        filteredNotifications.map((notif) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-6 flex gap-5 transition-all group ${!notif.read ? "bg-primary/5" : "hover:bg-muted/30"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-0.5 p-3 rounded-2xl h-fit transition-all ${!notif.read ? "bg-background shadow-md" : "bg-muted"}`, children: getIcon(notif.type) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-1.5 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: `font-bold text-base truncate ${!notif.read ? "text-foreground" : "text-muted-foreground"}`, children: notif.title }),
                notif.category && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: notif.category })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-muted-foreground whitespace-nowrap", children: notif.time }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteNotification(notif.id), className: "opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all", title: "Supprimer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm leading-relaxed mb-4 ${!notif.read ? "text-foreground/80" : "text-muted-foreground"}`, children: notif.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
              !notif.read ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => markAsRead(notif.id), className: "text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
                " Marquer comme lu"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-muted-foreground flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-success" }),
                " Lu"
              ] }),
              notif.type === "urgent" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleTakeAction(notif), className: "text-xs font-bold text-destructive hover:text-destructive/80 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" }),
                " Prendre action"
              ] })
            ] })
          ] })
        ] }, notif.id)),
        filteredNotifications.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-20 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex p-4 rounded-full bg-muted mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-8 w-8 text-muted-foreground/50" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-foreground", children: "Tout est à jour !" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Vous n'avez aucune notification dans cette catégorie." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selectedActionNotif, onOpenChange: (open) => !open && setSelectedActionNotif(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[500px] rounded-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-6 w-6 text-destructive" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-center text-xl", children: "Action Requise" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-center pt-2", children: [
          "Vous allez traiter l'alerte : ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
            '"',
            selectedActionNotif?.title,
            '"'
          ] }),
          ". Cette action sera enregistrée dans les journaux système."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 p-4 rounded-2xl text-sm italic text-muted-foreground mt-2 border border-border", children: [
        '"',
        selectedActionNotif?.message,
        '"'
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "sm:justify-center gap-2 mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setSelectedActionNotif(null), className: "rounded-xl px-8", children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: confirmAction, className: "rounded-xl px-8", children: "Confirmer l'intervention" })
      ] })
    ] }) })
  ] });
}
export {
  NotificationsPage as component
};
