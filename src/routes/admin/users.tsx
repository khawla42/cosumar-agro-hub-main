import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { UserPlus, Edit, Key, Search, X, Loader2, Trash2 } from "lucide-react";

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
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "client",
    password: "",
    cin: "",
    phone: "",
    region: "Doukkala",
  });

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
      if (!response.ok) {
        setUsersList([]);
        return;
      }
      const data = await response.json();
      // Only show clients
      setUsersList(Array.isArray(data) ? data.filter(user => user.role === "client") : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsersList([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    navigate({ to: "/auth/select-role" });
    return null;
  }

  const filtered = usersList.filter(
    (u) =>
      !search ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())),
  );

  const roleLabels: Record<string, string> = {
    admin: "Admin",
    employe: "Employé",
    client: "Agriculteur",
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Agriculteurs</h1>
            <p className="text-muted-foreground mt-1">Créer et gérer les comptes agriculteurs</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="h-4 w-4" /> Nouvel agriculteur
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                  Utilisateur
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                  Rôle
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                  Statut
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                  Dernière connexion
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Chargement des utilisateurs...
                    </span>
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
                  <tr
                    key={u.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
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
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${u.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}
                      >
                        {u.status === "active" ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground font-mono">
                      {u.lastLogin || "Jamais"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                        </button>
                        <button
                          onClick={() => setResetPasswordUser(u)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Réinitialiser mot de passe"
                        >
                          <Key className="h-4 w-4 text-muted-foreground hover:text-amber-500 transition-colors" />
                        </button>
                        <button
                          onClick={async () => {
                            if (
                              window.confirm(
                                `Êtes-vous sûr de vouloir supprimer l'utilisateur ${u.name} ?`,
                              )
                            ) {
                              try {
                                const response = await apiFetch(`/users/${u.id}`, {
                                  method: "DELETE",
                                });
                                if (response.ok) {
                                  fetchUsers();
                                  alert("Utilisateur supprimé");
                                } else {
                                  alert("Erreur suppression");
                                }
                              } catch (err) {
                                alert("Erreur réseau");
                              }
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-xl border border-border p-5 w-full max-w-sm animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">Créer un compte Agriculteur</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-muted">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Numéro de téléphone</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+212 6 XX XX XX XX"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">CIN *</label>
                <input
                  type="text"
                  value={newUser.cin}
                  onChange={(e) => setNewUser((p) => ({ ...p, cin: e.target.value }))}
                  placeholder="AB123456"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Région *
                </label>
                <select
                  value={newUser.region}
                  onChange={(e) => setNewUser((p) => ({ ...p, region: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Doukkala">Doukkala</option>
                  <option value="Tadla">Tadla</option>
                  <option value="Gharb">Gharb</option>
                  <option value="Loukkos">Loukkos</option>
                  <option value="Moulouya">Moulouya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {settings?.security_strict_pwd && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Min. 8 caractères, majuscule, minuscule, chiffre et symbole.
                  </p>
                )}
              </div>
              <button
                onClick={async () => {
                  if (!newUser.name || !newUser.email || !newUser.password || !newUser.cin) {
                    alert("Veuillez remplir tous les champs obligatoires");
                    return;
                  }

                  if (settings?.security_strict_pwd) {
                    const passwordRegex =
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    if (!passwordRegex.test(newUser.password)) {
                      alert("Le mot de passe ne respecte pas la politique de sécurité.");
                      return;
                    }
                  } else if (newUser.password.length < 2) {
                    alert("Le mot de passe est trop court.");
                    return;
                  }

                  try {
                    const response = await apiFetch("/register", {
                      method: "POST",
                      body: JSON.stringify(newUser),
                    });

                    const data = await response.json();

                    if (response.ok) {
                      setNewUser({
                        name: "",
                        email: "",
                        role: "client",
                        password: "",
                        cin: "",
                        phone: "",
                        region: "Doukkala",
                      });
                      setShowModal(false);
                      fetchUsers();
                      alert("Agriculteur créé avec succès !");
                    } else {
                      alert(data.message || "Erreur lors de la création");
                    }
                  } catch (err) {
                    console.error("Error creating user:", err);
                    alert("Erreur réseau");
                  }
                }}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Créer le compte
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-xl border border-border p-5 w-full max-w-sm animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">Modifier l'agriculteur</h2>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Statut</label>
                <select
                  value={editingUser.status}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      status: e.target.value as "active" | "inactive",
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
              <button
                onClick={async () => {
                  try {
                    const response = await apiFetch(`/users/${editingUser.id}`, {
                      method: "PATCH",
                      body: JSON.stringify(editingUser),
                    });
                    if (response.ok) {
                      setEditingUser(null);
                      fetchUsers();
                      alert("Agriculteur modifié avec succès !");
                    } else {
                      alert("Erreur lors de la modification");
                    }
                  } catch (err) {
                    console.error("Error updating user:", err);
                    alert("Erreur réseau");
                  }
                }}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors mt-3"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-xl border border-border p-5 w-full max-w-sm animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">
                Réinitialiser le mot de passe
              </h2>
              <button
                onClick={() => setResetPasswordUser(null)}
                className="p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Définissez un nouveau mot de passe pour <strong>{resetPasswordUser.name}</strong>.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  placeholder="Saisir le nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {settings?.security_strict_pwd && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Min. 8 caractères, majuscule, minuscule, chiffre et symbole.
                  </p>
                )}
              </div>
              <button
                onClick={async () => {
                  if (settings?.security_strict_pwd) {
                    const passwordRegex =
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    if (!passwordRegex.test(newPassword)) {
                      alert("Le mot de passe ne respecte pas la politique de sécurité.");
                      return;
                    }
                  } else if (newPassword.length < 2) {
                    alert("Le mot de passe est trop court.");
                    return;
                  }

                  try {
                    const response = await apiFetch(
                      `/users/${resetPasswordUser.id}/reset-password`,
                      {
                        method: "POST",
                        body: JSON.stringify({ password: newPassword }),
                      },
                    );
                    if (response.ok) {
                      setResetPasswordUser(null);
                      setNewPassword("");
                      alert("Mot de passe réinitialisé avec succès !");
                    } else {
                      alert("Erreur lors de la réinitialisation");
                    }
                  } catch (err) {
                    console.error("Error resetting password:", err);
                    alert("Erreur réseau");
                  }
                }}
                className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors"
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
