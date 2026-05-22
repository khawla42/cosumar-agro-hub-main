import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { E as EMPLOYEES } from "./mock-data-BDQZ8--q.js";
import { U as Users } from "./users-b0TKxeqs.js";
import { c as createLucideIcon } from "./createLucideIcon-DlByY22N.js";
import { B as Briefcase } from "./briefcase-C-FNnkty.js";
import { X } from "./x-DVhXpGUG.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode$1);
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = createLucideIcon("user-x", __iconNode);
function EmployeesPage() {
  const [employeesList, setEmployeesList] = reactExports.useState(EMPLOYEES);
  const [search, setSearch] = reactExports.useState("");
  const [filterDept, setFilterDept] = reactExports.useState("");
  const [showModal, setShowModal] = reactExports.useState(false);
  const [editingEmployee, setEditingEmployee] = reactExports.useState(null);
  const [newEmployee, setNewEmployee] = reactExports.useState({
    name: "",
    email: "",
    role: "opérateur",
    department: "Production",
    status: "Actif",
    performance: 80
  });
  const activeCount = employeesList.filter((e) => e.status === "Actif").length;
  const onLeaveCount = employeesList.filter((e) => e.status === "Congé").length;
  const inactiveCount = employeesList.filter((e) => e.status === "Inactif").length;
  const filteredEmployees = employeesList.filter((e) => {
    const matchesSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !filterDept || e.department === filterDept;
    return matchesSearch && matchesDept;
  });
  const handleCreateEmployee = () => {
    const id = (employeesList.length + 1).toString();
    setEmployeesList([...employeesList, {
      ...newEmployee,
      id
    }]);
    setNewEmployee({
      name: "",
      email: "",
      role: "opérateur",
      department: "Production",
      status: "Actif",
      performance: 80
    });
    setShowModal(false);
    alert("Employé ajouté avec succès !");
  };
  const handleUpdateEmployee = () => {
    if (editingEmployee) {
      setEmployeesList(employeesList.map((e) => e.id === editingEmployee.id ? editingEmployee : e));
      setEditingEmployee(null);
      alert("Employé modifié avec succès !");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 animate-fade-in-up", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Employés" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Gestion du personnel et des accès internes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowModal(true), className: "bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors", children: "Ajouter un employé" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-5 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-primary/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "text-primary w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Effectif Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold", children: employeesList.length })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-5 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-success/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "text-success w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Actifs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-success", children: activeCount })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-5 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-amber-500/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "text-amber-500 w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "En Congé" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-amber-500", children: onLeaveCount })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-5 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-destructive/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "text-destructive w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Inactifs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-destructive", children: inactiveCount })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: "Liste du Personnel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Rechercher...", value: search, onChange: (e) => setSearch(e.target.value), className: "px-3 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filterDept, onChange: (e) => setFilterDept(e.target.value), className: "px-3 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Tous les départements" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Direction", children: "Direction" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Production", children: "Production" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Logistique", children: "Logistique" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Finances", children: "Finances" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/50 uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium", children: "Nom" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium", children: "Rôle" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium", children: "Département" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium", children: "Performance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium", children: "Statut" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: filteredEmployees.map((employee) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-card hover:bg-muted/50 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-medium text-foreground", children: employee.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-muted-foreground", children: employee.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${employee.role === "admin" ? "bg-primary/20 text-primary" : employee.role === "manager" ? "bg-blue-500/20 text-blue-500" : "bg-muted text-muted-foreground"}`, children: employee.role }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: employee.department }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full ${employee.performance >= 90 ? "bg-success" : employee.performance >= 75 ? "bg-primary" : "bg-amber-500"}`, style: {
              width: `${employee.performance}%`
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              employee.performance,
              "%"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2.5 py-1 rounded-full text-xs font-medium ${employee.status === "Actif" ? "bg-success/20 text-success" : employee.status === "Congé" ? "bg-amber-500/20 text-amber-500" : "bg-destructive/20 text-destructive"}`, children: employee.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingEmployee(employee), className: "text-primary hover:underline text-sm font-medium", children: "Éditer" }) })
        ] }, employee.id)) })
      ] }) })
    ] }),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-8 w-full max-w-md animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Ajouter un employé" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowModal(false), className: "p-1 rounded-lg hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5 text-muted-foreground" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Nom complet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newEmployee.name, onChange: (e) => setNewEmployee({
            ...newEmployee,
            name: e.target.value
          }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: newEmployee.email, onChange: (e) => setNewEmployee({
            ...newEmployee,
            email: e.target.value
          }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Rôle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newEmployee.role, onChange: (e) => setNewEmployee({
              ...newEmployee,
              role: e.target.value
            }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "opérateur", children: "Opérateur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "manager", children: "Manager" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Admin" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Département" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newEmployee.department, onChange: (e) => setNewEmployee({
              ...newEmployee,
              department: e.target.value
            }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Direction", children: "Direction" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Production", children: "Production" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Logistique", children: "Logistique" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Finances", children: "Finances" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Statut" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newEmployee.status, onChange: (e) => setNewEmployee({
            ...newEmployee,
            status: e.target.value
          }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Actif", children: "Actif" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Congé", children: "Congé" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactif", children: "Inactif" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCreateEmployee, className: "w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors mt-2", children: "Créer l'employé" })
      ] })
    ] }) }),
    editingEmployee && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-8 w-full max-w-md animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Modifier l'employé" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingEmployee(null), className: "p-1 rounded-lg hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5 text-muted-foreground" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Nom complet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: editingEmployee.name, onChange: (e) => setEditingEmployee({
            ...editingEmployee,
            name: e.target.value
          }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: editingEmployee.email, onChange: (e) => setEditingEmployee({
            ...editingEmployee,
            email: e.target.value
          }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Rôle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: editingEmployee.role, onChange: (e) => setEditingEmployee({
              ...editingEmployee,
              role: e.target.value
            }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "opérateur", children: "Opérateur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "manager", children: "Manager" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Admin" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Département" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: editingEmployee.department, onChange: (e) => setEditingEmployee({
              ...editingEmployee,
              department: e.target.value
            }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Direction", children: "Direction" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Production", children: "Production" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Logistique", children: "Logistique" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Finances", children: "Finances" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Statut" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: editingEmployee.status, onChange: (e) => setEditingEmployee({
              ...editingEmployee,
              status: e.target.value
            }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Actif", children: "Actif" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Congé", children: "Congé" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactif", children: "Inactif" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Performance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", max: "100", value: editingEmployee.performance, onChange: (e) => setEditingEmployee({
              ...editingEmployee,
              performance: parseInt(e.target.value) || 0
            }), className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleUpdateEmployee, className: "w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors mt-4", children: "Enregistrer les modifications" })
      ] })
    ] }) })
  ] });
}
export {
  EmployeesPage as component
};
