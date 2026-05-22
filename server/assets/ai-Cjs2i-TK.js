import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { u as useAuth, t as toast } from "./router-C2dGhf-y.js";
import { c as createLucideIcon } from "./createLucideIcon-DlByY22N.js";
import { T as Trash2 } from "./trash-2-BlPK7cIS.js";
import { U as User } from "./user-BQYz2rMJ.js";
import { L as LoaderCircle } from "./loader-circle-Frk16I11.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$3 = [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
];
const Bot = createLucideIcon("bot", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
      key: "1miecu"
    }
  ]
];
const Paperclip = createLucideIcon("paperclip", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
const STORAGE_KEY = "cosumar_ai_messages";
function AIAssistantPage() {
  const {
    apiFetch
  } = useAuth();
  const [query, setQuery] = reactExports.useState("");
  const [isTyping, setIsTyping] = reactExports.useState(false);
  const scrollRef = reactExports.useRef(null);
  const [appData, setAppData] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved messages", e);
        }
      }
    }
    return [{
      id: 1,
      role: "bot",
      content: "Bonjour ! Je suis votre assistant IA COSUMAR. Je peux vous aider à analyser les rendements, trouver des informations sur les agriculteurs ou générer des rapports de campagne. Que puis-je faire pour vous aujourd'hui ?"
    }];
  });
  const clearHistory = () => {
    const defaultMsg = [{
      id: 1,
      role: "bot",
      content: "Bonjour ! Je suis votre assistant IA COSUMAR. Je peux vous aider à analyser les rendements, trouver des informations sur les agriculteurs ou générer des rapports de campagne. Que puis-je faire pour vous aujourd'hui ?"
    }];
    setMessages(defaultMsg);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Historique de conversation effacé");
  };
  reactExports.useEffect(() => {
    const fetchContextData = async () => {
      try {
        const [statsRes, farmersRes, productionRes, paymentsRes, logsRes] = await Promise.all([apiFetch("/stats/dashboard"), apiFetch("/farmers"), apiFetch("/production"), apiFetch("/payments"), apiFetch("/logs")]);
        const [stats, farmers, production, payments, logs] = await Promise.all([statsRes.json(), farmersRes.json(), productionRes.json(), paymentsRes.json(), logsRes.json()]);
        setAppData({
          stats,
          farmers,
          production,
          payments,
          logs
        });
      } catch (err) {
        console.error("Failed to fetch AI context data:", err);
      }
    };
    fetchContextData();
  }, [apiFetch]);
  reactExports.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const generateAIResponse = async (userQuery) => {
    const lowerQuery = userQuery.toLowerCase();
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    let response = "";
    if (!appData) {
      response = "Je suis en train de charger les dernières données de COSUMAR. Veuillez patienter un instant...";
    } else {
      if (lowerQuery.includes("rendement") || lowerQuery.includes("production")) {
        const prod = appData.stats.totalProduction || "2,500";
        const harvested = appData.stats.totalHarvested || "120";
        response = `Le rendement total actuel est de ${prod} tonnes. Nous avons récolté ${harvested} tonnes jusqu'à présent cette saison.`;
      } else if (lowerQuery.includes("agriculteur") || lowerQuery.includes("fermier")) {
        const count = appData.stats.totalFarmers || appData.farmers.length;
        const topFarmer = appData.farmers[0]?.name || "Ahmed Bennani";
        response = `Nous avons ${count} agriculteurs actifs. L'un des plus importants est ${topFarmer} dans la région de ${appData.farmers[0]?.region || "Doukkala"}.`;
      } else if (lowerQuery.includes("paiement") || lowerQuery.includes("argent")) {
        const pending = appData.stats.pendingPayments || "45,000";
        response = `Le montant total des paiements en attente s'élève à ${pending} DH. Les derniers virements sont en cours de traitement.`;
      } else if (lowerQuery.includes("sécurité") || lowerQuery.includes("brute force") || lowerQuery.includes("attaque")) {
        const criticalLogs = appData.logs.filter((l) => l.status === "critical");
        if (criticalLogs.length > 0) {
          response = `ALERTE : J'ai détecté ${criticalLogs.length} incident(s) de sécurité critique(s). Le dernier concerne : ${criticalLogs[0].details}.`;
        } else {
          response = "Aucun incident de sécurité majeur n'a été détecté récemment. Le système est stable.";
        }
      } else if (lowerQuery.includes("bonjour") || lowerQuery.includes("salut")) {
        response = "Bonjour ! Je suis connecté aux données en temps réel de COSUMAR. Je peux vous renseigner sur la production, les agriculteurs, les paiements ou la sécurité.";
      } else {
        response = "Je peux vous donner des détails précis sur les " + appData.stats.totalFarmers + " agriculteurs, les " + appData.stats.totalProduction + " tonnes de production, ou les " + appData.stats.pendingPayments + " DH de paiements. Que voulez-vous savoir exactement ?";
      }
    }
    setMessages((prev) => [...prev, {
      id: Date.now(),
      role: "bot",
      content: response
    }]);
    setIsTyping(false);
  };
  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim() || isTyping) return;
    const userQuery = query.trim();
    const newMsg = {
      id: Date.now(),
      role: "user",
      content: userQuery
    };
    setMessages((prev) => [...prev, newMsg]);
    setQuery("");
    await generateAIResponse(userQuery);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[calc(100vh-4rem)] flex flex-col max-w-5xl mx-auto animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex justify-between items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-foreground flex items-center gap-2", children: [
          "Assistant IA ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-gold" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Interrogez les données de production en langage naturel" })
      ] }),
      messages.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: clearHistory, className: "flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-xl", title: "Effacer l'historique", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
        "Effacer"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth", children: [
        messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm ${msg.role === "bot" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`, children: msg.role === "bot" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted/30 border border-border text-foreground rounded-tl-none"}`, children: msg.content })
        ] }, msg.id)),
        isTyping && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 max-w-[80%] animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 shrink-0 rounded-xl bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-2xl bg-muted/30 border border-border flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "L'IA analyse les données..." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-muted/20 border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSend, className: "relative flex items-end gap-2 bg-background border border-border rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "p-2.5 text-muted-foreground hover:text-primary transition-colors rounded-xl hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Posez une question sur les rendements, les agriculteurs...", className: "flex-1 bg-transparent border-0 focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 text-sm", rows: 1, disabled: isTyping, onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: !query.trim() || isTyping, className: "p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-3 text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60", children: "Moteur IA COSUMAR v1.0" })
      ] })
    ] })
  ] });
}
export {
  AIAssistantPage as component
};
