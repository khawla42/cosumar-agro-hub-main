import { createFileRoute } from "@tanstack/react-router";
import {
  CreditCard,
  DollarSign,
  Wallet,
  ArrowUpRight,
  Loader2,
  Search,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/employe/payments")({
  head: () => ({ meta: [{ title: "Paiements — Employé COSUMAR" }] }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const { apiFetch } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    farmerId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    method: "Virement",
    status: "pending",
  });

  useEffect(() => {
    Promise.all([fetchPayments(), fetchFarmers()]).finally(() => setLoading(false));
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await apiFetch(`/payments`);
      if (!response.ok) {
        setPayments([]);
        return;
      }
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    }
  };

  const fetchFarmers = async () => {
    try {
      const response = await apiFetch(`/farmers`);
      if (!response.ok) {
        setFarmers([]);
        return;
      }
      const data = await response.json();
      setFarmers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      setFarmers([]);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.farmerId) {
      toast.error("Veuillez sélectionner un agriculteur");
      return;
    }
    setSubmitting(true);
    try {
      const response = await apiFetch("/payments/add", {
        method: "POST",
        body: JSON.stringify(newPayment),
      });
      if (response.ok) {
        toast.success("Paiement enregistré avec succès");
        setShowModal(false);
        setNewPayment({
          farmerId: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          method: "Virement",
          status: "pending",
        });
        fetchPayments();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Erreur réseau lors de l'ajout");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce paiement ?")) return;
    try {
      const response = await apiFetch(`/payments/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Paiement supprimé");
        fetchPayments();
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleUpdatePaymentStatus = async (id: string, newStatus: string) => {
    try {
      const response = await apiFetch(`/payments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        toast.success("Statut du paiement mis à jour");
        fetchPayments();
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const filtered = (Array.isArray(payments) ? payments : []).filter((p) => {
    const matchSearch =
      !search ||
      p.farmerName?.toLowerCase().includes(search.toLowerCase()) ||
      p.id?.toString()?.includes(search);
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchMethod = filterMethod === "all" || p.method === filterMethod;
    return matchSearch && matchStatus && matchMethod;
  });

  const totalAmount = (Array.isArray(payments) ? payments : []).reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0,
  );
  const paidAmount = (Array.isArray(payments) ? payments : [])
    .filter((p) => p.status === "completed" || p.status === "Payé")
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const pendingAmount = (Array.isArray(payments) ? payments : [])
    .filter((p) => p.status === "pending" || p.status === "En attente")
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Paiements</h1>
          <p className="text-muted-foreground mt-1">Suivi financier des agriculteurs</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Nouveau paiement
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Wallet className="text-primary w-6 h-6" />
            </div>
            <span className="flex items-center text-sm text-success bg-success/10 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +12%
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Montant Total Facturé</p>
            <h3 className="text-2xl font-bold text-foreground">
              {totalAmount.toLocaleString()} MAD
            </h3>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <DollarSign className="text-success w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Montant Réglé</p>
            <h3 className="text-2xl font-bold text-success">{paidAmount.toLocaleString()} MAD</h3>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <CreditCard className="text-amber-500 w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">En Attente de Paiement</p>
            <h3 className="text-2xl font-bold text-amber-500">
              {pendingAmount.toLocaleString()} MAD
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border bg-muted/30">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par agriculteur ou ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px]"
            >
              <option value="all">Tous les statuts</option>
              <option value="completed">Payé</option>
              <option value="pending">En attente</option>
              <option value="failed">Échoué</option>
            </select>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px]"
            >
              <option value="all">Toutes méthodes</option>
              <option value="Virement">Virement</option>
              <option value="Chèque">Chèque</option>
              <option value="Espèces">Espèces</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Facture</th>
                <th className="px-6 py-4 font-semibold">Agriculteur</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Méthode</th>
                <th className="px-6 py-4 font-semibold">Montant</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground italic">
                    Aucune transaction ne correspond à vos critères.
                  </td>
                </tr>
              ) : (
                filtered.map((payment) => (
                  <tr key={payment.id} className="bg-card hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      #{payment.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">{payment.farmerName}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(payment.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4">{payment.method || "Virement"}</td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {Number(payment.amount).toLocaleString()} MAD
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={payment.status}
                        onChange={(e) => handleUpdatePaymentStatus(payment.id, e.target.value)}
                        className="px-2 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        style={{
                          backgroundColor: 
                            payment.status === "completed" || payment.status === "Payé" 
                              ? "rgb(22 163 74 / 0.1)" 
                              : payment.status === "pending" || payment.status === "En attente" 
                                ? "rgb(245 158 11 / 0.1)" 
                                : "rgb(239 68 68 / 0.1)",
                          color: 
                            payment.status === "completed" || payment.status === "Payé" 
                              ? "rgb(22 163 74)" 
                              : payment.status === "pending" || payment.status === "En attente" 
                                ? "rgb(245 158 11)" 
                                : "rgb(239 68 68)"
                        }}
                      >
                        <option value="pending">En attente</option>
                        <option value="completed">Payé</option>
                        <option value="failed">Échoué</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeletePayment(payment.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                        title="Supprimer la ligne"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouveau Paiement */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
              <h3 className="font-bold text-lg text-foreground">Nouvelle Transaction</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleAddPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Agriculteur
                </label>
                <select
                  required
                  value={newPayment.farmerId}
                  onChange={(e) => setNewPayment({ ...newPayment, farmerId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Sélectionner un agriculteur</option>
                  {farmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Montant (MAD)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Méthode de paiement
                </label>
                <select
                  value={newPayment.method}
                  onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Virement">Virement</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Espèces">Espèces</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Statut initial
                </label>
                <select
                  value={newPayment.status}
                  onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="pending">En attente</option>
                  <option value="completed">Payé</option>
                  <option value="failed">Échoué</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border font-semibold text-sm hover:bg-muted transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? "Traitement..." : "Confirmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
