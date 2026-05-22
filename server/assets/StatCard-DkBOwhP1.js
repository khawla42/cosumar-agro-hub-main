import { U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
function StatCard({ title, value, subtitle, icon: Icon, trend, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow ${className}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-medium", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-card-foreground mt-1", children: value }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: subtitle }),
      trend && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `text-xs mt-2 font-medium ${trend.value >= 0 ? "text-success" : "text-destructive"}`, children: [
        trend.value >= 0 ? "↑" : "↓",
        " ",
        Math.abs(trend.value),
        "% ",
        trend.label
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }) })
  ] }) });
}
export {
  StatCard as S
};
