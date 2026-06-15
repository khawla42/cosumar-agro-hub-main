import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Users, UserCheck, UserX, Briefcase, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/employees")({
  head: () => ({ meta: [{ title: "Employés — COSUMAR" }] }),
  component: EmployeesPage,
});

function EmployeesPage() {
  const { apiFetch } = useAuth();
  const [employeesList, setEmployeesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);
  const [newEmployee, setNewEmployee] = useState<any>({
    name: "",
    email: "",
    password: "",
    role: "employe",
    department: "Production",
    status: "active",
  });

  useEffect(() => {
    fetchEmployees().finally(() => setLoading(false));
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await apiFetch("/users"); // Route /users récupère tout le monde
      if (!response.ok) {
        setEmployeesList([]);
        return;
      }
      const data = await response.json();
      // Filtrer pour n'avoir que les employés et admins (pas les clients ici)
      setEmployeesList(Array.isArray(data) ? data.filter((u: any) => u.role !== "client") : []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployeesList([]);
    }
  };

  const handleCreateEmployee = async () => {
    // Vérification stricte des champs
    if (!newEmployee.name || !newEmployee.name.trim()) {
      toast.error("Le nom complet est obligatoire");
      return;
    }
    if (!newEmployee.email || !newEmployee.email.trim()) {
      toast.error("L'email est obligatoire");
      return;
    }
    if (!newEmployee.password || !newEmployee.password.trim()) {
      toast.error("Le mot de passe est obligatoire");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({
          name: newEmployee.name,
          email: newEmployee.email,
          password: newEmployee.password,
          role: newEmployee.role,
          department: newEmployee.department,
          status: newEmployee.status,
        }),
      });

      if (response.ok) {
        toast.success("Employé ajouté avec succès !");
        setShowModal(false);
        setNewEmployee({
          name: "",
          email: "",
          password: "",
          role: "employe",
          department: "Production",
          status: "active",
        });
        fetchEmployees();
      } else {
        const err = await response.json();
        toast.error(err.message || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Erreur de connexion");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEmployee = async () => {
    if (editingEmployee) {
      setSubmitting(true);
      try {
        const response = await apiFetch(`/settings/update-user`, {
          method: "POST",
          body: JSON.stringify(editingEmployee),
        });
        if (response.ok) {
          toast.success("Employé mis à jour");
          setEditingEmployee(null);
          fetchEmployees();
        }
      } catch (error) {
        console.error("Error updating employee:", error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const activeCount = employeesList.filter(
    (e) => e.status === "active" || e.status === "Actif",
  ).length;
  const inactiveCount = employeesList.filter(
    (e) => e.status === "inactive" || e.status === "Inactif",
  ).length;

  const filteredEmployees = employeesList.filter((e) => {
    const name = e.name || e.full_name || "";
    const matchesSearch =
      !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !filterDept || e.department === filterDept;
    return matchesSearch && matchesDept;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 animate-fade-in-up">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Employés</h1>
            <p className="text-muted-foreground mt-1">Gestion du personnel et des accès internes</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Ajouter un employé
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Users className="text-primary w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Effectif Total</p>
            <h3 className="text-2xl font-bold">{employeesList.length}</h3>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
          <div className="p-3 bg-success/10 rounded-lg">
            <UserCheck className="text-success w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Actifs</p>
            <h3 className="text-2xl font-bold text-success">{activeCount}</h3>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
          <div className="p-3 bg-destructive/10 rounded-lg">
            <UserX className="text-destructive w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Inactifs</p>
            <h3 className="text-2xl font-bold text-destructive">{inactiveCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold text-foreground">Liste du Personnel</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Tous les départements</option>
              <option value="Direction">Direction</option>
              <option value="Production">Production</option>
              <option value="Logistique">Logistique</option>
              <option value="Finances">Finances</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Nom</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Rôle</th>
                <th className="px-6 py-4 font-medium">Département</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="bg-card hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {employee.name || employee.full_name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{employee.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        employee.role === "admin"
                          ? "bg-primary/20 text-primary"
                          : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      {employee.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{employee.department || "N/A"}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditingEmployee(employee)}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Éditer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout Employé */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border p-8 w-full max-w-md animate-fade-in-up shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Ajouter un employé</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-muted">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Rôle</label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, role: e.target.value as any })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="employe">Employé</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Département
                  </label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Direction">Direction</option>
                    <option value="Production">Production</option>
                    <option value="Logistique">Logistique</option>
                    <option value="Finances">Finances</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Statut</label>
                <select
                  value={newEmployee.status}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, status: e.target.value as any })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
              <button
                onClick={handleCreateEmployee}
                disabled={submitting}
                className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors mt-2 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Création..." : "Créer l'employé"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Édition Employé */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border p-8 w-full max-w-md animate-fade-in-up shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Modifier l'employé</h2>
              <button
                onClick={() => setEditingEmployee(null)}
                className="p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={editingEmployee.name || editingEmployee.full_name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Rôle</label>
                  <select
                    value={editingEmployee.role}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, role: e.target.value as any })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="employe">Employé</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Département
                  </label>
                  <select
                    value={editingEmployee.department}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, department: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Direction">Direction</option>
                    <option value="Production">Production</option>
                    <option value="Logistique">Logistique</option>
                    <option value="Finances">Finances</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Statut</label>
                <select
                  value={editingEmployee.status}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, status: e.target.value as any })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
              <button
                onClick={handleUpdateEmployee}
                disabled={submitting}
                className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors mt-4 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
