import { createFileRoute } from "@tanstack/react-router";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Trash2,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/deliveries")({
  head: () => ({ meta: [{ title: "Livraisons — Admin COSUMAR" }] }),
  component: AdminDeliveriesPage,
});

function AdminDeliveriesPage() {
  const { apiFetch } = useAuth();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchDeliveries().finally(() => setLoading(false));
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

  const deleteDelivery = async (id: string) => {
    if (!confirm("Voulez-vous supprimer cette livraison de l'historique ?")) return;
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

  const filtered = deliveries.filter((d) => {
    const matchesSearch =
      d.driverName?.toLowerCase().includes(search.toLowerCase()) ||
      d.id?.toString().includes(search) ||
      d.vehicle?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-foreground">Livraisons</h1>
        <p className="text-muted-foreground mt-1">
          Suivi des expéditions et gestion de la logistique
        </p>
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
        <div className="p-5 border-b border-border bg-muted/30 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une livraison..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-input rounded-lg px-3 py-2 bg-background outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_route">En cours</option>
              <option value="delivered">Livrées</option>
              <option value="retard">En retard</option>
              <option value="cancelled">Annulées</option>
            </select>
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
                    <button
                      onClick={() => deleteDelivery(d.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
    </div>
  );
}
