import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { u as useAuth } from "./router-C2dGhf-y.js";
import { S as Search } from "./search-CPNsxbBk.js";
import { L as LoaderCircle } from "./loader-circle-Frk16I11.js";
import { M as MapPin } from "./map-pin-B4hS_bLA.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-DlByY22N.js";
function FarmersPage() {
  const {
    apiFetch
  } = useAuth();
  const [search, setSearch] = reactExports.useState("");
  const [filterRegion, setFilterRegion] = reactExports.useState("all");
  const [farmersList, setFarmersList] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    fetchFarmers();
  }, []);
  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/farmers`);
      const data = await response.json();
      setFarmersList(data);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    } finally {
      setLoading(false);
    }
  };
  const regions = [...new Set(farmersList.map((f) => f.region))];
  const filtered = farmersList.filter((f) => {
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterRegion !== "all" && f.region !== filterRegion) return false;
    return true;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Agriculteurs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Annuaire et gestion détaillée des agriculteurs" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border flex flex-wrap gap-4 justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-1 min-w-[300px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Rechercher un agriculteur...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filterRegion, onChange: (e) => setFilterRegion(e.target.value), className: "px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Toutes les régions" }),
            regions.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: r }, r))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
          filtered.length,
          " agriculteur",
          filtered.length !== 1 ? "s" : "",
          " trouvé",
          filtered.length !== 1 ? "s" : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-semibold", children: "Agriculteur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-semibold", children: "CIN / Contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-semibold", children: "Région" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-semibold text-right", children: "Surface" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-semibold", children: "Statut Terrain" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 5, className: "px-5 py-10 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Chargement des agriculteurs..." })
        ] }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-5 py-10 text-center text-sm text-muted-foreground", children: "Aucun agriculteur trouvé." }) }) : filtered.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/50 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold", children: f.name ? f.name.charAt(0) : "?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm text-foreground", children: f.name || "Nom inconnu" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                "ID: ",
                f.id
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: f.cin }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: f.phone || "+212 6XX-XXXXXX" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
            f.region
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-4 text-sm text-foreground text-right font-medium", children: [
            f.cultivatedQty || 0,
            " ha"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground", children: f.landStatus || "Betterave" }) })
        ] }, f.id)) })
      ] }) })
    ] })
  ] });
}
export {
  FarmersPage as component
};
