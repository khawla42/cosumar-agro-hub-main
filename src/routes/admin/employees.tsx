import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EMPLOYEES, Employee } from "@/lib/mock-data";
import { Users, UserCheck, UserX, Briefcase, X } from "lucide-react";

export const Route = createFileRoute("/admin/employees")({
  head: () => ({ meta: [{ title: "Employés — COSUMAR" }] }),
  component: EmployeesPage,
});

function EmployeesPage() {
  const [employeesList, setEmployeesList] = useState<Employee[]>(EMPLOYEES);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    email: "",
    role: "opérateur",
    department: "Production",
    status: "Actif",
    performance: 80
  });

  const activeCount = employeesList.filter(e => e.status === "Actif").length;
  const onLeaveCount = employeesList.filter(e => e.status === "Congé").length;
  const inactiveCount = employeesList.filter(e => e.status === "Inactif").length;

  const filteredEmployees = employeesList.filter(e => {
    const matchesSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !filterDept || e.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const handleCreateEmployee = () => {
    const id = (employeesList.length + 1).toString();
    setEmployeesList([...employeesList, { ...newEmployee, id } as Employee]);
    setNewEmployee({ name: "", email: "", role: "opérateur", department: "Production", status: "Actif", performance: 80 });
    setShowModal(false);
    alert("Employé ajouté avec succès !");
  };

  const handleUpdateEmployee = () => {
    if (editingEmployee) {
      setEmployeesList(employeesList.map(e => e.id === editingEmployee.id ? editingEmployee : e));
      setEditingEmployee(null);
      alert("Employé modifié avec succès !");
    }
  };

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg"><Users className="text-primary w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Effectif Total</p>
              <h3 className="text-2xl font-bold">{employeesList.length}</h3>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg"><UserCheck className="text-success w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Actifs</p>
              <h3 className="text-2xl font-bold text-success">{activeCount}</h3>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg"><Briefcase className="text-amber-500 w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">En Congé</p>
              <h3 className="text-2xl font-bold text-amber-500">{onLeaveCount}</h3>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-lg"><UserX className="text-destructive w-6 h-6" /></div>
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
                  <th className="px-6 py-4 font-medium">Performance</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="bg-card hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{employee.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{employee.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        employee.role === 'admin' ? 'bg-primary/20 text-primary' :
                        employee.role === 'manager' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{employee.department}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              employee.performance >= 90 ? 'bg-success' : 
                              employee.performance >= 75 ? 'bg-primary' : 
                              'bg-amber-500'
                            }`}
                            style={{ width: `${employee.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">{employee.performance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        employee.status === 'Actif' ? 'bg-success/20 text-success' :
                        employee.status === 'Congé' ? 'bg-amber-500/20 text-amber-500' :
                        'bg-destructive/20 text-destructive'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setEditingEmployee(employee)} className="text-primary hover:underline text-sm font-medium">Éditer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Ajout Employé */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
            <div className="bg-card rounded-2xl border border-border p-8 w-full max-w-md animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Ajouter un employé</h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nom complet</label>
                  <input type="text" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input type="email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Rôle</label>
                    <select value={newEmployee.role} onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value as any })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="opérateur">Opérateur</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Département</label>
                    <select value={newEmployee.department} onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="Direction">Direction</option>
                      <option value="Production">Production</option>
                      <option value="Logistique">Logistique</option>
                      <option value="Finances">Finances</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Statut</label>
                  <select value={newEmployee.status} onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value as any })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="Actif">Actif</option>
                    <option value="Congé">Congé</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
                <button
                  onClick={handleCreateEmployee}
                  className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors mt-2"
                >
                  Créer l'employé
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Édition Employé */}
        {editingEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
            <div className="bg-card rounded-2xl border border-border p-8 w-full max-w-md animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Modifier l'employé</h2>
                <button onClick={() => setEditingEmployee(null)} className="p-1 rounded-lg hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nom complet</label>
                  <input type="text" value={editingEmployee.name} onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input type="email" value={editingEmployee.email} onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Rôle</label>
                    <select value={editingEmployee.role} onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value as any })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="opérateur">Opérateur</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Département</label>
                    <select value={editingEmployee.department} onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="Direction">Direction</option>
                      <option value="Production">Production</option>
                      <option value="Logistique">Logistique</option>
                      <option value="Finances">Finances</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Statut</label>
                    <select value={editingEmployee.status} onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value as any })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="Actif">Actif</option>
                      <option value="Congé">Congé</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Performance</label>
                    <input type="number" min="0" max="100" value={editingEmployee.performance} onChange={(e) => setEditingEmployee({ ...editingEmployee, performance: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <button
                  onClick={handleUpdateEmployee}
                  className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors mt-4"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        )}
      </>
  );
}