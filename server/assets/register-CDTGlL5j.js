import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { u as useAuth, a as useNavigate, L as Link } from "./router-C2dGhf-y.js";
import { c as cosumarLogo } from "./cosumar-logo-BFmipKES.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function RegisterPage() {
  const {
    register
  } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = reactExports.useState({
    name: "",
    cin: "",
    email: "",
    password: "",
    confirm: "",
    region: "Doukkala"
  });
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
    } catch (err) {
      console.error("Settings fetch error:", err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!form.name || !form.cin || !form.email || !form.password) {
      setError("Veuillez remplir tous les champs obligatoires");
      setLoading(false);
      return;
    }
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }
    if (settings?.security_strict_pwd) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(form.password)) {
        setError("Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial.");
        setLoading(false);
        return;
      }
    } else {
      if (form.password.length < 2) {
        setError("Le mot de passe est trop court");
        setLoading(false);
        return;
      }
    }
    try {
      const success = await register({
        name: form.name,
        cin: form.cin,
        email: form.email,
        password: form.password,
        region: form.region
      });
      if (success) {
        navigate({
          to: "/client"
        });
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };
  const update = (field, value) => setForm((p) => ({
    ...p,
    [field]: value
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cosumarLogo, alt: "COSUMAR", className: "h-10 w-10 object-contain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-heading text-xl font-bold text-primary", children: "COSUMAR" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Créer un compte" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground text-sm", children: "Inscription réservée aux agriculteurs" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-lg bg-destructive/10 text-destructive text-sm", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Nom complet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.name, onChange: (e) => update("name", e.target.value), placeholder: "Votre nom complet", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "CIN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.cin, onChange: (e) => update("cin", e.target.value), placeholder: "AB123456", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Région" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.region, onChange: (e) => update("region", e.target.value), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Doukkala", children: "Doukkala" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Tadla", children: "Tadla" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Gharb", children: "Gharb" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Loukkos", children: "Loukkos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Moulouya", children: "Moulouya" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: form.email, onChange: (e) => update("email", e.target.value), placeholder: "votre@email.com", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Mot de passe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: form.password, onChange: (e) => update("password", e.target.value), placeholder: "••••••••", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Confirmer le mot de passe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: form.confirm, onChange: (e) => update("confirm", e.target.value), placeholder: "••••••••", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: "Créer mon compte" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-center text-sm text-muted-foreground", children: [
        "Déjà inscrit ?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/login", search: {
          role: "client"
        }, className: "text-primary font-medium hover:underline", children: "Se connecter" })
      ] })
    ] })
  ] }) });
}
export {
  RegisterPage as component
};
