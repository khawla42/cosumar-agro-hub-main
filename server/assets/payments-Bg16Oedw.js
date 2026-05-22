import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { u as useAuth } from "./router-C2dGhf-y.js";
import { L as LoaderCircle } from "./loader-circle-Frk16I11.js";
import { P as Plus } from "./plus-CNuPyjxx.js";
import { W as Wallet, A as ArrowUpRight, D as DollarSign } from "./wallet-ZvPtiLn9.js";
import { C as CreditCard } from "./credit-card-T9hW7jbN.js";
import { S as Search } from "./search-CPNsxbBk.js";
import { T as Trash2 } from "./trash-2-BlPK7cIS.js";
import { X } from "./x-DVhXpGUG.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-DlByY22N.js";
function PaymentsPage() {
  const {
    apiFetch
  } = useAuth();
  const [payments, setPayments] = reactExports.useState([]);
  const [farmers, setFarmers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [filterMethod, setFilterMethod] = reactExports.useState("all");
  const [showModal, setShowModal] = reactExports.useState(false);
  const [newPayment, setNewPayment] = reactExports.useState({
    farmerId: "",
    amount: "",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    method: "Virement",
    status: "pending"
  });
  reactExports.useEffect(() => {
    Promise.all([fetchPayments(), fetchFarmers()]).finally(() => setLoading(false));
  }, []);
  const fetchPayments = async () => {
    try {
      const response = await apiFetch(`/payments`);
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };
  const fetchFarmers = async () => {
    try {
      const response = await apiFetch(`/farmers`);
      const data = await response.json();
      setFarmers(data);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    }
  };
  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      const response = await apiFetch("/payments/add", {
        method: "POST",
        body: JSON.stringify(newPayment)
      });
      if (response.ok) {
        setShowModal(false);
        setNewPayment({
          farmerId: "",
          amount: "",
          date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          method: "Virement",
          status: "pending"
        });
        fetchPayments();
      }
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };
  const handleDeletePayment = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce paiement ?")) return;
    try {
      const response = await apiFetch(`/payments/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchPayments();
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };
  const filtered = payments.filter((p) => {
    const matchSearch = !search || p.farmerName?.toLowerCase().includes(search.toLowerCase()) || p.id?.toString().includes(search);
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchMethod = filterMethod === "all" || p.method === filterMethod;
    return matchSearch && matchStatus && matchMethod;
  });
  const totalAmount = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const paidAmount = payments.filter((p) => p.status === "completed" || p.status === "Payé").reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const pendingAmount = payments.filter((p) => p.status === "pending" || p.status === "En attente" || p.status === "En attente").reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8 animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Paiements" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Gestion financière et suivi des factures" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowModal(true), className: "flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Nouveau paiement"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-6 flex flex-col justify-between shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-primary/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "text-primary w-6 h-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center text-sm text-success bg-success/10 px-2 py-1 rounded-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-4 h-4 mr-1" }),
            " +12%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Montant Total Facturé" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-bold text-foreground", children: [
            totalAmount.toLocaleString(),
            " MAD"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-6 flex flex-col justify-between shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-start mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-success/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "text-success w-6 h-6" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Montant Réglé" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-bold text-success", children: [
            paidAmount.toLocaleString(),
            " MAD"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-6 flex flex-col justify-between shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-start mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-amber-500/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "text-amber-500 w-6 h-6" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "En Attente de Paiement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-bold text-amber-500", children: [
            pendingAmount.toLocaleString(),
            " MAD"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 border-b border-border bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[240px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Rechercher par agriculteur ou ID...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Tous les statuts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "completed", children: "Payé" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "En attente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "failed", children: "Échoué" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filterMethod, onChange: (e) => setFilterMethod(e.target.value), className: "px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Toutes méthodes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Virement", children: "Virement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Chèque", children: "Chèque" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Espèces", children: "Espèces" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/50 uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold", children: "ID Facture" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold", children: "Agriculteur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold", children: "Méthode" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold", children: "Montant" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold", children: "Statut" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-6 py-12 text-center text-muted-foreground italic", children: "Aucune transaction ne correspond à vos critères." }) }) : filtered.map((payment) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-card hover:bg-muted/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 font-mono text-xs text-muted-foreground", children: [
            "#",
            payment.id
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-medium text-foreground", children: payment.farmerName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-muted-foreground", children: new Date(payment.date).toLocaleDateString("fr-FR") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: payment.method || "Virement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 font-bold text-foreground", children: [
            Number(payment.amount).toLocaleString(),
            " MAD"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2.5 py-1 rounded-full text-xs font-medium ${payment.status === "Payé" || payment.status === "completed" ? "bg-success/10 text-success" : payment.status === "En attente" || payment.status === "pending" ? "bg-amber-500/10 text-amber-500" : "bg-destructive/10 text-destructive"}`, children: payment.status === "completed" ? "Payé" : payment.status === "pending" ? "En attente" : payment.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDeletePayment(payment.id), className: "p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all", title: "Supprimer la ligne", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }) })
        ] }, payment.id)) })
      ] }) })
    ] }),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-border flex justify-between items-center bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-foreground", children: "Nouvelle Transaction" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowModal(false), className: "p-1 hover:bg-muted rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5 text-muted-foreground" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddPayment, className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Agriculteur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, value: newPayment.farmerId, onChange: (e) => setNewPayment({
            ...newPayment,
            farmerId: e.target.value
          }), className: "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Sélectionner un agriculteur" }),
            farmers.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f.id, children: f.name }, f.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Montant (MAD)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", required: true, placeholder: "0.00", value: newPayment.amount, onChange: (e) => setNewPayment({
              ...newPayment,
              amount: e.target.value
            }), className: "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", required: true, value: newPayment.date, onChange: (e) => setNewPayment({
              ...newPayment,
              date: e.target.value
            }), className: "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Méthode de paiement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newPayment.method, onChange: (e) => setNewPayment({
            ...newPayment,
            method: e.target.value
          }), className: "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Virement", children: "Virement" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Chèque", children: "Chèque" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Espèces", children: "Espèces" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Statut initial" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newPayment.status, onChange: (e) => setNewPayment({
            ...newPayment,
            status: e.target.value
          }), className: "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "En attente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "completed", children: "Payé" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "failed", children: "Échoué" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowModal(false), className: "flex-1 px-4 py-2.5 rounded-lg border border-border font-semibold text-sm hover:bg-muted transition-colors", children: "Annuler" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm", children: "Confirmer" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  PaymentsPage as component
};
