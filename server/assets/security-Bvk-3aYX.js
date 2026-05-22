import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { u as useAuth } from "./router-C2dGhf-y.js";
import { L as LoaderCircle } from "./loader-circle-Frk16I11.js";
import { S as Shield } from "./shield-D7bPpCZF.js";
import { T as TriangleAlert } from "./triangle-alert-Tp-JCQ7K.js";
import { K as Key } from "./key-DMYfVPCP.js";
import { c as createLucideIcon } from "./createLucideIcon-DlByY22N.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["path", { d: "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4", key: "1nerag" }],
  ["path", { d: "M14 13.12c0 2.38 0 6.38-1 8.88", key: "o46ks0" }],
  ["path", { d: "M17.29 21.02c.12-.6.43-2.3.5-3.02", key: "ptglia" }],
  ["path", { d: "M2 12a10 10 0 0 1 18-6", key: "ydlgp0" }],
  ["path", { d: "M2 16h.01", key: "1gqxmh" }],
  ["path", { d: "M21.8 16c.2-2 .131-5.354 0-6", key: "drycrb" }],
  ["path", { d: "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2", key: "1tidbn" }],
  ["path", { d: "M8.65 22c.21-.66.45-1.32.57-2", key: "13wd9y" }],
  ["path", { d: "M9 6.8a6 6 0 0 1 9 5.2v2", key: "1fr1j5" }]
];
const FingerprintPattern = createLucideIcon("fingerprint-pattern", __iconNode$1);
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode);
function SecurityPage() {
  const {
    apiFetch
  } = useAuth();
  const [logs, setLogs] = reactExports.useState([]);
  const [settings, setSettings] = reactExports.useState({
    security_captcha: true,
    security_strict_pwd: true,
    security_session_exp: true,
    security_ip_block: true
  });
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    Promise.all([fetchLogs(), fetchSettings()]).finally(() => setLoading(false));
  }, []);
  const fetchLogs = async () => {
    try {
      const response = await apiFetch(`/logs`);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };
  const fetchSettings = async () => {
    try {
      const response = await apiFetch(`/settings`);
      const data = await response.json();
      if (Object.keys(data).length > 0) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };
  const toggleSetting = async (key) => {
    const newValue = !settings[key];
    setSettings((prev) => ({
      ...prev,
      [key]: newValue
    }));
    try {
      await apiFetch(`/settings/update`, {
        method: "POST",
        body: JSON.stringify({
          key,
          value: newValue
        })
      });
    } catch (error) {
      console.error("Error updating setting:", error);
      setSettings((prev) => ({
        ...prev,
        [key]: !newValue
      }));
    }
  };
  const failedLogins = logs.filter((l) => l.status === "failed");
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  const SecuritySwitch = ({
    label,
    description,
    checked,
    onChange
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-sm", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: onChange, className: `w-10 h-5 rounded-full relative cursor-pointer transition-colors ${checked ? "bg-primary" : "bg-muted"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${checked ? "right-0.5" : "left-0.5"}` }) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Sécurité" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Gestion des accès et surveillance du système" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 bg-primary/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "text-primary w-5 h-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "État du système" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-success font-medium flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-success animate-pulse" }),
          "Sécurisé"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 bg-destructive/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "text-destructive w-5 h-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Alertes (24h)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-destructive", children: failedLogins.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 bg-blue-500/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "text-blue-500 w-5 h-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Rôles Actifs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: "3" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 bg-amber-500/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "text-amber-500 w-5 h-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "CAPTCHA" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: settings.security_captcha ? "Activé" : "Désactivé" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FingerprintPattern, { className: "w-5 h-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: "Tentatives de connexion échouées" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 flex-1 overflow-auto max-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          failedLogins.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-lg bg-destructive/5 border border-destructive/10 flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: log.action }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(log.timestamp).toLocaleString("fr-FR") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
              "Utilisateur : ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: log.userName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
              "Adresse IP : ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono bg-muted px-1 py-0.5 rounded text-xs", children: log.ipAddress })
            ] })
          ] }, log.id)),
          failedLogins.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: "Aucune alerte récente." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: "Paramètres de sécurité globaux" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SecuritySwitch, { label: "Protection CAPTCHA", description: "Ajoute un code de vérification visuel sur la page de connexion.", checked: settings.security_captcha, onChange: () => toggleSetting("security_captcha") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SecuritySwitch, { label: "Politique de mots de passe stricts", description: "Minimum 8 caractères, incluant symboles et chiffres.", checked: settings.security_strict_pwd, onChange: () => toggleSetting("security_strict_pwd") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SecuritySwitch, { label: "Expiration des sessions", description: "Déconnexion automatique après 3 minutes d'inactivité.", checked: settings.security_session_exp, onChange: () => toggleSetting("security_session_exp") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SecuritySwitch, { label: "Blocage d'adresse IP", description: "Bloquer l'IP après 5 tentatives échouées consécutives.", checked: settings.security_ip_block, onChange: () => toggleSetting("security_ip_block") })
        ] })
      ] })
    ] })
  ] });
}
export {
  SecurityPage as component
};
