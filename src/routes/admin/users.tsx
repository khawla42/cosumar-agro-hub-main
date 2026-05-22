import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { UserPlus, Edit, Key, Search, X, Loader2 } from "lucide-react";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
}

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Gestion Utilisateurs — COSUMAR" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const { user, apiFetch } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "employe", password: "" });
  
  // States for Edit and Reset Password
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<SystemUser | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const [usersList, setUsersList] = useState<SystemUser[]>([]);

  useEffect(() => {
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
    navigate({ to: "/auth/select-role" });
    return null;
  }

  const filtered = usersList.filter((u) =>
    !search || (u.name && u.name.toLowerCase().includes(search.toLowerCase())) || (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const roleLabels: Record<string, string> = { admin: "Admin", employe: "Employé", client: "Agriculteur" };

  return (
    <>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion des Utilisateurs</h1>
            <p className="text-muted-foreground mt-1">Créer et gérer les comptes utilisateurs</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="h-4 w-4" /> Nouveau compte
          </button>
        </div>

        <div className="bg-card rounded-xl border border-border">
          <div className="p-5 border-b border-border">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Utilisateur</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Rôle</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Statut</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Dernière connexion</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                      <span className="text-sm text-muted-foreground">Chargement des utilisateurs...</span>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-sm text-foreground">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {roleLabels[u.role] || u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${u.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                          {u.status === "active" ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground font-mono">
                        {u.lastLogin || 'Jamais'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditingUser(u)} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Modifier">
                            <Edit className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                          </button>
                          <button onClick={() => setResetPasswordUser(u)} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Réinitialiser mot de passe">
                            <Key className="h-4 w-4 text-muted-foreground hover:text-amber-500 transition-colors" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
            <div className="bg-card rounded-2xl border border-border p-8 w-full max-w-md animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Créer un compte</h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nom complet</label>
                  <input type="text" value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input type="email" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Rôle</label>
                  <select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="employe">Employé</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Mot de passe</label>
                  <input type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  {settings?.security_strict_pwd && <p className="text-[10px] text-muted-foreground mt-1">Min. 8 caractères, majuscule, minuscule, chiffre et symbole.</p>}
                </div>
                <button
                  onClick={() => {
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
                      lastLogin: new Date().toISOString()
                    }]);
                    setNewUser({ name: "", email: "", role: "employe", password: "" });
                    setShowModal(false);
                    alert("Utilisateur créé avec succès !");
                  }}
                  className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Créer le compte
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
            <div className="bg-card rounded-2xl border border-border p-8 w-full max-w-md animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Modifier l'utilisateur</h2>
                <button onClick={() => setEditingUser(null)} className="p-1 rounded-lg hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nom complet</label>
                  <input type="text" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Rôle</label>
                    <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="employe">Employé</option>
                      <option value="admin">Administrateur</option>
                      <option value="client">Agriculteur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Statut</label>
                    <select value={editingUser.status} onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as "active" | "inactive" })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUsersList(usersList.map(u => u.id === editingUser.id ? editingUser : u));
                    setEditingUser(null);
                    alert("Utilisateur modifié avec succès !");
                  }}
                  className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors mt-4"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Modal */}
        {resetPasswordUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
            <div className="bg-card rounded-2xl border border-border p-8 w-full max-w-md animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Réinitialiser le mot de passe</h2>
                <button onClick={() => setResetPasswordUser(null)} className="p-1 rounded-lg hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Définissez un nouveau mot de passe pour <strong>{resetPasswordUser.name}</strong>.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nouveau mot de passe</label>
                  <input type="password" placeholder="Saisir le nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  {settings?.security_strict_pwd && <p className="text-[10px] text-muted-foreground mt-1">Min. 8 caractères, majuscule, minuscule, chiffre et symbole.</p>}
                </div>
                <button
                  onClick={() => {
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
                  }}
                  className="w-full rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
                >
                  Confirmer la réinitialisation
                </button>
              </div>
            </div>
          </div>
        )}
      </>
  );
}