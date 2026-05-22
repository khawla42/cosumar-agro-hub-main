import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { u as useAuth, a as useNavigate } from "./router-C2dGhf-y.js";
import { c as createLucideIcon } from "./createLucideIcon-DlByY22N.js";
import { S as Search } from "./search-CPNsxbBk.js";
import { L as LoaderCircle } from "./loader-circle-Frk16I11.js";
import { K as Key } from "./key-DMYfVPCP.js";
import { X } from "./x-DVhXpGUG.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
const SquarePen = createLucideIcon("square-pen", __iconNode$1);
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function AdminUsers() {
  const {
    user,
    apiFetch
  } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [showModal, setShowModal] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  const [settings, setSettings] = reactExports.useState(null);
  const [newUser, setNewUser] = reactExports.useState({
    name: "",
    email: "",
    role: "employe",
    password: ""
  });
  const [editingUser, setEditingUser] = reactExports.useState(null);
  const [resetPasswordUser, setResetPasswordUser] = reactExports.useState(null);
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [usersList, setUsersList] = reactExports.useState([]);
  reactExports.useEffect(() => {
    Promise.all([fetchUsers(), fetchSettings()]);
  }, []);
  const fetchSettings = async () => {
    try {
      const response = await apiFetch(`/settings`);
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      console.error("Settings fetch error:", err);
    }
  };
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/users`);
      const data = await response.json();
      setUsersList(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  if (!user || user.role !== "admin") {
    navigate({
      to: "/auth/select-role"
    });
    return null;
  }
  const filtered = usersList.filter((u) => !search || u.name && u.name.toLowerCase().includes(search.toLowerCase()) || u.email && u.email.toLowerCase().includes(search.toLowerCase()));
  const roleLabels = {
    admin: "Admin",
    employe: "Employé",
    client: "Agriculteur"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Gestion des Utilisateurs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Créer et gérer les comptes utilisateurs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowModal(true), className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
        " Nouveau compte"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Rechercher...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase", children: "Utilisateur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase", children: "Rôle" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase", children: "Statut" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase", children: "Dernière connexion" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 5, className: "px-5 py-10 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Chargement des utilisateurs..." })
        ] }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-5 py-10 text-center text-sm text-muted-foreground", children: "Aucun utilisateur trouvé." }) }) : filtered.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-muted/50 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm text-foreground", children: u.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: u.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary", children: roleLabels[u.role] || u.role }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${u.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`, children: u.status === "active" ? "Actif" : "Inactif" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-sm text-muted-foreground font-mono", children: u.lastLogin || "Jamais" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingUser(u), className: "p-2 rounded-lg hover:bg-muted transition-colors", title: "Modifier", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4 text-muted-foreground hover:text-primary transition-colors" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setResetPasswordUser(u), className: "p-2 rounded-lg hover:bg-muted transition-colors", title: "Réinitialiser mot de passe", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "h-4 w-4 text-muted-foreground hover:text-amber-500 transition-colors" }) })
          ] }) })
        ] }, u.id)) })
      ] }) })
    ] }),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-8 w-full max-w-md animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Créer un compte" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowModal(false), className: "p-1 rounded-lg hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5 text-muted-foreground" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Nom complet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newUser.name, onChange: (e) => setNewUser((p) => ({
            ...p,
            name: e.target.value
          })), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: newUser.email, onChange: (e) => setNewUser((p) => ({
            ...p,
            email: e.target.value
          })), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Rôle" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newUser.role, onChange: (e) => setNewUser((p) => ({
            ...p,
            role: e.target.value
          })), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "employe", children: "Employé" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Administrateur" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Mot de passe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: newUser.password, onChange: (e) => setNewUser((p) => ({
            ...p,
            password: e.target.value
          })), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" }),
          settings?.security_strict_pwd && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Min. 8 caractères, majuscule, minuscule, chiffre et symbole." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          if (settings?.security_strict_pwd) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(newUser.password)) {
              alert("Le mot de passe ne respecte pas la politique de sécurité.");
              return;
            }
          } else if (newUser.password.length < 2) {
            alert("Le mot de passe est trop court.");
            return;
          }
          const id = (usersList.length + 1).toString();
          setUsersList([...usersList, {
            id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: "active",
            lastLogin: (/* @__PURE__ */ new Date()).toISOString()
          }]);
          setNewUser({
            name: "",
            email: "",
            role: "employe",
            password: ""
          });
          setShowModal(false);
          alert("Utilisateur créé avec succès !");
        }, className: "w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors", children: "Créer le compte" })
      ] })
    ] }) }),
    editingUser && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-8 w-full max-w-md animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Modifier l'utilisateur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingUser(null), className: "p-1 rounded-lg hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5 text-muted-foreground" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Nom complet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: editingUser.name, onChange: (e) => setEditingUser({
            ...editingUser,
            name: e.target.value
          }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: editingUser.email, onChange: (e) => setEditingUser({
            ...editingUser,
            email: e.target.value
          }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Rôle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: editingUser.role, onChange: (e) => setEditingUser({
              ...editingUser,
              role: e.target.value
            }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "employe", children: "Employé" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Administrateur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "client", children: "Agriculteur" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Statut" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: editingUser.status, onChange: (e) => setEditingUser({
              ...editingUser,
              status: e.target.value
            }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: "Actif" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "inactive", children: "Inactif" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setUsersList(usersList.map((u) => u.id === editingUser.id ? editingUser : u));
          setEditingUser(null);
          alert("Utilisateur modifié avec succès !");
        }, className: "w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors mt-4", children: "Enregistrer les modifications" })
      ] })
    ] }) }),
    resetPasswordUser && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-8 w-full max-w-md animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Réinitialiser le mot de passe" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setResetPasswordUser(null), className: "p-1 rounded-lg hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5 text-muted-foreground" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: [
        "Définissez un nouveau mot de passe pour ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: resetPasswordUser.name }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Nouveau mot de passe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", placeholder: "Saisir le nouveau mot de passe", value: newPassword, onChange: (e) => setNewPassword(e.target.value), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" }),
          settings?.security_strict_pwd && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Min. 8 caractères, majuscule, minuscule, chiffre et symbole." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          if (settings?.security_strict_pwd) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(newPassword)) {
              alert("Le mot de passe ne respecte pas la politique de sécurité.");
              return;
            }
          } else if (newPassword.length < 2) {
            alert("Le mot de passe est trop court.");
            return;
          }
          setResetPasswordUser(null);
          setNewPassword("");
          alert("Mot de passe réinitialisé avec succès !");
        }, className: "w-full rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors", children: "Confirmer la réinitialisation" })
      ] })
    ] }) })
  ] });
}
export {
  AdminUsers as component
};
