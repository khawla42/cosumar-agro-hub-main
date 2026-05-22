import { U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { L as Link } from "./router-C2dGhf-y.js";
import { c as cosumarLogo } from "./cosumar-logo-BFmipKES.js";
import { S as Shield } from "./shield-D7bPpCZF.js";
import { B as Briefcase } from "./briefcase-C-FNnkty.js";
import { S as Sprout } from "./sprout-D5xbx29P.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-DlByY22N.js";
function SelectRole() {
  const roles = [{
    role: "admin",
    label: "Administrateur",
    desc: "Gestion complète du système",
    icon: Shield,
    color: "bg-primary"
  }, {
    role: "employe",
    label: "Employé",
    desc: "Suivi des agriculteurs et production",
    icon: Briefcase,
    color: "bg-chart-2"
  }, {
    role: "client",
    label: "Agriculteur",
    desc: "Gestion de vos données agricoles",
    icon: Sprout,
    color: "bg-success"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10 animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cosumarLogo, alt: "COSUMAR", className: "h-12 w-12 object-contain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-heading text-2xl font-bold text-primary", children: "COSUMAR" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Choisissez votre rôle" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Sélectionnez votre profil pour continuer" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: roles.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth/login", search: {
      role: r.role
    }, className: `flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all animate-fade-in-up animation-delay-${(i + 1) * 100}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-3 rounded-xl ${r.color}/10`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(r.icon, { className: `h-6 w-6 text-primary` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: r.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: r.desc })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "→" })
    ] }, r.role)) })
  ] }) });
}
export {
  SelectRole as component
};
