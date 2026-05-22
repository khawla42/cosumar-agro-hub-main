import { M as useRouter, U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { u as useAuth, L as Link } from "./router-C2dGhf-y.js";
import { c as cosumarLogo } from "./cosumar-logo-BFmipKES.js";
import { c as createLucideIcon } from "./createLucideIcon-DlByY22N.js";
import { U as Users } from "./users-b0TKxeqs.js";
import { C as ChartColumn } from "./chart-column-Cz9F7Ik0.js";
import { C as CreditCard } from "./credit-card-T9hW7jbN.js";
import { C as Calendar } from "./calendar-BWcmQtxU.js";
import { B as Bell } from "./bell-B6zrSvJq.js";
import { T as Truck } from "./truck-CzO1vvbx.js";
import { S as Shield } from "./shield-D7bPpCZF.js";
import { L as LogOut } from "./log-out-DVMrXd0D.js";
function useRouterState(opts) {
  const contextRouter = useRouter({ warn: opts?.router === void 0 });
  const router = opts?.router || contextRouter;
  {
    const state = router.stores.__store.get();
    return opts?.select ? opts.select(state) : state;
  }
}
const __iconNode$3 = [
  ["path", { d: "M12 6V2H8", key: "1155em" }],
  ["path", { d: "M15 11v2", key: "i11awn" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  [
    "path",
    {
      d: "M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z",
      key: "11gyqh"
    }
  ],
  ["path", { d: "M9 11v2", key: "1ueba0" }]
];
const BotMessageSquare = createLucideIcon("bot-message-square", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$2);
const __iconNode$1 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5"
    }
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }]
];
const Map = createLucideIcon("map", __iconNode);
const NAV_ITEMS = {
  admin: [
    { label: "Tableau de bord", to: "/admin", icon: LayoutDashboard },
    { label: "Utilisateurs", to: "/admin/users", icon: Users },
    { label: "Production", to: "/admin/production", icon: ChartColumn },
    { label: "Paiements", to: "/admin/payments", icon: CreditCard },
    { label: "Livraisons", to: "/admin/deliveries", icon: Truck },
    { label: "Journaux", to: "/admin/logs", icon: FileText },
    { label: "Sécurité", to: "/admin/security", icon: Shield },
    { label: "Employés", to: "/admin/employees", icon: Users }
  ],
  employe: [
    { label: "Tableau de bord", to: "/employe", icon: LayoutDashboard },
    { label: "Agriculteurs", to: "/employe/farmers", icon: Users },
    { label: "Production", to: "/employe/production", icon: ChartColumn },
    { label: "Paiements", to: "/employe/payments", icon: CreditCard },
    { label: "Carte Interactive", to: "/employe/map", icon: Map },
    { label: "Calendrier", to: "/employe/calendar", icon: Calendar },
    { label: "Notifications", to: "/employe/notifications", icon: Bell },
    { label: "Assistant IA", to: "/employe/ai", icon: BotMessageSquare }
  ],
  client: []
};
function DashboardSidebar() {
  const { user, logout } = useAuth();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  if (!user || user.role === "client") return null;
  const items = NAV_ITEMS[user.role];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex items-center gap-3 border-b border-sidebar-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cosumarLogo, alt: "COSUMAR", className: "h-9 w-9 object-contain" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-heading font-bold text-sm", children: "COSUMAR" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-sidebar-foreground/60 capitalize", children: user.role })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 p-3 space-y-1", children: items.map((item) => {
      const isActive = currentPath === item.to;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: item.to,
          className: `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-4 w-4" }),
            item.label
          ]
        },
        item.to
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-t border-sidebar-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: user.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-sidebar-foreground/60", children: user.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: logout,
          className: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-all w-full",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
            "Déconnexion"
          ]
        }
      )
    ] })
  ] });
}
export {
  DashboardSidebar as D
};
