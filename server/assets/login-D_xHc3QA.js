import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { b as Route, u as useAuth, a as useNavigate, L as Link } from "./router-C2dGhf-y.js";
import { c as cosumarLogo } from "./cosumar-logo-BFmipKES.js";
import { c as createLucideIcon } from "./createLucideIcon-DlByY22N.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
function LoginPage() {
  const {
    role
  } = Route.useSearch();
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [captchaInput, setCaptchaInput] = reactExports.useState("");
  const [captchaData, setCaptchaData] = reactExports.useState(null);
  const [settings, setSettings] = reactExports.useState(null);
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    fetchSettings();
  }, []);
  const fetchSettings = async () => {
    try {
      const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
      const response = await fetch(`http://${hostname}:5000/settings`);
      const data = await response.json();
      setSettings(data);
      if (data.security_captcha) {
        fetchCaptcha();
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
    }
  };
  const fetchCaptcha = async () => {
    try {
      setCaptchaData(null);
      const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
      const response = await fetch(`http://${hostname}:5000/auth/captcha`);
      const data = await response.json();
      console.log("Nouveau CAPTCHA reçu:", data.captcha);
      setCaptchaData(data.captcha);
    } catch (err) {
      console.error("Captcha fetch error:", err);
    }
  };
  const roleLabels = {
    admin: "Administrateur",
    employe: "Employé",
    client: "Agriculteur"
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }
    const currentRole = role;
    const result = await login(email, password, currentRole, captchaInput);
    if (result.success) {
      const routes = {
        admin: "/admin",
        employe: "/employe",
        client: "/client"
      };
      navigate({
        to: routes[currentRole]
      });
    } else {
      setError(result.message || "Email ou mot de passe incorrect");
      fetchCaptcha();
      setCaptchaInput("");
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cosumarLogo, alt: "COSUMAR", className: "h-10 w-10 object-contain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-heading text-xl font-bold text-primary", children: "COSUMAR" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-foreground", children: [
        "Connexion — ",
        roleLabels[role]
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground text-sm", children: "Entrez vos identifiants pour accéder à votre espace" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-lg bg-destructive/10 text-destructive text-sm", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "votre@email.com", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Mot de passe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        settings?.security_captcha && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground", children: "Vérification de sécurité" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-muted h-12 rounded-lg flex items-center justify-center font-mono font-bold tracking-[0.5em] text-lg select-none italic border border-border shadow-inner relative overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10 transform -rotate-3 skew-x-12 text-primary", children: captchaData || "..." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: fetchCaptcha, className: "p-3 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground", title: "Actualiser le code", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-5 w-5" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: captchaInput, onChange: (e) => setCaptchaInput(e.target.value.toUpperCase()), placeholder: "Entrez le code ci-dessus", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono uppercase" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50", children: loading ? "Connexion..." : "Se connecter" })
      ] }),
      role === "client" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-center text-sm text-muted-foreground", children: [
        "Pas encore de compte ?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/register", className: "text-primary font-medium hover:underline", children: "Créer un compte" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/select-role", className: "text-sm text-muted-foreground hover:text-primary", children: "← Changer de rôle" }) })
    ] })
  ] }) });
}
export {
  LoginPage as component
};
