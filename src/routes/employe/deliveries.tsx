import { createFileRoute } from "@tanstack/react-router";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/employe/deliveries")({
  head: () => ({ meta: [{ title: "Livraisons — Employé COSUMAR" }] }),
  component: DeliveriesPage,
});

function DeliveriesPage() {
  const { apiFetch } = useAuth();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [newDelivery, setNewDelivery] = useState({
    farmerId: "",
    vehicle: "",
    driverName: "",
    origin: "",
    destination: "Usine Centrale",
    eta: "",
    status: "en_route",
  });

  useEffect(() => {
    Promise.all([fetchDeliveries(), fetchFarmers()]).finally(() => setLoading(false));
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await apiFetch("/deliveries");
      if (!response.ok) {
        setDeliveries([]);
        return;
      }
      const data = await response.json();
      setDeliveries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setDeliveries([]);
    }
  };

  const fetchFarmers = async () => {
    try {
      const response = await apiFetch("/farmers");
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

  const handleAddDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelivery.farmerId) {
      toast.error("Veuillez sélectionner un agriculteur");
      return;
    }
    setSubmitting(true);
    try {
      const response = await apiFetch("/deliveries", {
        method: "POST",
        body: JSON.stringify(newDelivery),
      });
      if (response.ok) {
        toast.success("Livraison enregistrée avec succès");
        setShowModal(false);
        setNewDelivery({
          farmerId: "",
          vehicle: "",
          driverName: "",
          origin: "",
          destination: "Usine Centrale",
          eta: "",
          status: "en_route",
        });
        fetchDeliveries();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Error adding delivery:", error);
      toast.error("Erreur réseau lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await apiFetch(`/deliveries/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        toast.success(`Statut mis à jour : ${status}`);
        fetchDeliveries();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteDelivery = async (id: string) => {
    if (!confirm("Voulez-vous supprimer cette livraison ?")) return;
    try {
      const response = await apiFetch(`/deliveries/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Livraison supprimée");
        fetchDeliveries();
      }
    } catch (error) {
      console.error("Error deleting delivery:", error);
    }
  };

  const filtered = deliveries.filter(
    (d) =>
      d.driverName?.toLowerCase().includes(search.toLowerCase()) ||
      d.id?.toString().includes(search) ||
      d.vehicle?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Livraisons</h1>
          <p className="text-muted-foreground mt-1">
            Suivi des expéditions et gestion de la logistique
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Nouvelle livraison
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Truck className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Total Expéditions</span>
          </div>
          <span className="text-2xl font-bold">{deliveries.length}</span>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">En Cours</span>
          </div>
          <span className="text-2xl font-bold">
            {deliveries.filter((d) => d.status === "en_route").length}
          </span>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-success/10 rounded-lg text-success">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Livrées</span>
          </div>
          <span className="text-2xl font-bold">
            {deliveries.filter((d) => d.status === "delivered").length}
          </span>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
              <AlertCircle className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">En Retard</span>
          </div>
          <span className="text-2xl font-bold">
            {deliveries.filter((d) => d.status === "retard").length}
          </span>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border bg-muted/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une livraison..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Livraison</th>
                <th className="px-6 py-4 font-semibold">Chauffeur</th>
                <th className="px-6 py-4 font-semibold">Véhicule</th>
                <th className="px-6 py-4 font-semibold">Origine</th>
                <th className="px-6 py-4 font-semibold">Destination</th>
                <th className="px-6 py-4 font-semibold">Heure Estimée</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">LIV-{d.id}</td>
                  <td className="px-6 py-4 font-medium">{d.driverName}</td>
                  <td className="px-6 py-4 text-muted-foreground">{d.vehicle}</td>
                  <td className="px-6 py-4">{d.origin}</td>
                  <td className="px-6 py-4">{d.destination}</td>
                  <td className="px-6 py-4">{d.eta}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        d.status === "delivered"
                          ? "bg-success/10 text-success"
                          : d.status === "retard"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      {d.status === "delivered"
                        ? "Livré"
                        : d.status === "retard"
                          ? "Retard"
                          : "En cours"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        onChange={(e) => updateStatus(d.id, e.target.value)}
                        value={d.status}
                        className="text-xs border border-input rounded p-1 bg-background"
                      >
                        <option value="en_route">En cours</option>
                        <option value="delivered">Livré</option>
                        <option value="retard">Retard</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                      <button
                        onClick={() => deleteDelivery(d.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground italic">
                    Aucune livraison trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
              <h3 className="font-bold text-lg text-foreground">Nouvelle Livraison</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleAddDelivery} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Agriculteur (Optionnel)</label>
                <select
                  value={newDelivery.farmerId}
                  onChange={(e) => {
                    const farmer = farmers.find((f) => f.id.toString() === e.target.value);
                    setNewDelivery({
                      ...newDelivery,
                      farmerId: e.target.value,
                      origin: farmer?.region || "",
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Sélectionner un agriculteur</option>
                  {farmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.region})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Chauffeur</label>
                  <input
                    type="text"
                    required
                    value={newDelivery.driverName}
                    onChange={(e) => setNewDelivery({ ...newDelivery, driverName: e.target.value })}
                    placeholder="Nom du chauffeur"
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Véhicule</label>
                  <input
                    type="text"
                    required
                    value={newDelivery.vehicle}
                    onChange={(e) => setNewDelivery({ ...newDelivery, vehicle: e.target.value })}
                    placeholder="Ex: Camion A1"
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Origine</label>
                  <input
                    type="text"
                    required
                    value={newDelivery.origin}
                    onChange={(e) => setNewDelivery({ ...newDelivery, origin: e.target.value })}
                    placeholder="Région"
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Heure Estimée</label>
                  <input
                    type="time"
                    required
                    value={newDelivery.eta}
                    onChange={(e) => setNewDelivery({ ...newDelivery, eta: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Destination</label>
                <input
                  type="text"
                  required
                  value={newDelivery.destination}
                  onChange={(e) => setNewDelivery({ ...newDelivery, destination: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
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
                  {submitting ? "Enregistrement..." : "Confirmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
