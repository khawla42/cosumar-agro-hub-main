import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Package, TrendingUp, Clock, Loader2, Edit2, X, Check, Sprout } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { io } from "socket.io-client";

const SOCKET_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : `http://${window.location.hostname}:5000`;

export const Route = createFileRoute("/employe/production")({
  head: () => ({ meta: [{ title: "Production — Employé COSUMAR" }] }),
  component: ProductionPage,
});

function ProductionPage() {
  const { apiFetch } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [production, setProduction] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ status: "", sugar_content: "" });

  useEffect(() => {
    fetchData();

    // Connexion WebSocket pour les mises à jour en temps réel
    const socket = io(SOCKET_URL);
    socket.on("production_updated", () => {
      fetchData(); // Recharger les données quand quelqu'un (agriculteur ou employé) modifie quelque chose
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, prodRes] = await Promise.all([
        apiFetch("/dashboard-stats"),
        apiFetch("/production"),
      ]);
      const statsData = await statsRes.json();
      const prodData = await prodRes.json();
      setStats(statsData);
      setProduction(prodData);
    } catch (error) {
      console.error("Error fetching production stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const response = await apiFetch(`/production/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: editData.status,
          sugar_content: parseFloat(editData.sugar_content) || 0,
          progress: editData.status === "validated" || editData.status === "Terminé" ? 100 : 0,
        }),
      });

      if (response.ok) {
        toast.success("Mise à jour réussie");
        setEditingId(null);
        fetchData();
      } else {
        const errData = await response.json();
        toast.error(errData.message || "Erreur de mise à jour");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Erreur réseau");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const productionData = stats?.productionChart || [];
  const totalHarvested = productionData.reduce(
    (acc: number, curr: any) => acc + (curr.harvested || 0),
    0,
  );
  const totalCultivated = productionData.reduce(
    (acc: number, curr: any) => acc + (curr.cultivated || 0),
    0,
  );

  const formatNum = (val: any) => {
    return (Number(val) || 0).toLocaleString("fr-FR", {
      maximumFractionDigits: 2,
    });
  };

  return (
    <>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-foreground">Production de Betterave</h1>
        <p className="text-muted-foreground mt-1">
          Suivi de la production agricole et des récoltes en temps réel
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Package className="text-primary w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Récolté (T)</p>
            <h3 className="text-2xl font-bold">{formatNum(stats?.totalProduction)}</h3>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-lg">
            <Clock className="text-amber-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">En Attente</p>
            <h3 className="text-2xl font-bold">{stats?.pendingCount || 0}</h3>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
          <div className="p-3 bg-success/10 rounded-lg">
            <Sprout className="text-success w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Surface Totale (ha)</p>
            <h3 className="text-2xl font-bold">{formatNum(stats?.totalCultivated)}</h3>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <BarChart3 className="text-blue-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rendement Moyen</p>
            <h3 className="text-2xl font-bold">82%</h3>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-1 gap-6 mb-8">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">
            Rendement de Production (Betterave)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={productionData}>
              <defs>
                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.45 0.12 150)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.45 0.12 150)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 100)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="harvested"
                stroke="oklch(0.45 0.12 150)"
                fill="url(#colorProd)"
                name="Betterave (T)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 mb-8">
        <h3 className="font-semibold text-foreground mb-4">
          Détails des Récoltes (Saisies par les Agriculteurs)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3">Agriculteur</th>
                <th className="px-4 py-3">Quantité (T)</th>
                <th className="px-4 py-3 text-center">Taux Sucre (%)</th>
                <th className="px-4 py-3 text-center">Date Récolte</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {production.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    Aucune donnée de récolte disponible.
                  </td>
                </tr>
              ) : (
                production.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 font-medium">{item.farmerName || "Inconnu"}</td>
                    <td className="px-4 py-4">{formatNum(item.quantity)} T</td>
                    <td className="px-4 py-4 text-center">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          step="0.0001"
                          min="0"
                          max="100"
                          value={editData.sugar_content}
                          onChange={(e) => setEditData({ ...editData, sugar_content: e.target.value })}
                          className="w-24 px-2 py-1 rounded border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring text-center"
                          placeholder="Taux"
                        />
                      ) : (
                        <span className="text-green-600 font-medium">
                          {item.sugar_content ? item.sugar_content.toFixed(4) : "—"} %
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center text-muted-foreground">
                      {new Date(item.startDate).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {editingId === item.id ? (
                        <select
                          value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="px-2 py-1 rounded border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          <option value="pending">En cours</option>
                          <option value="validated">Terminé</option>
                          <option value="rejected">Rejeté</option>
                        </select>
                      ) : (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            item.status === "validated" || item.status === "Terminé"
                              ? "bg-success/20 text-success"
                              : item.status === "pending" || item.status === "En cours"
                                ? "bg-amber-500/20 text-amber-500"
                                : "bg-muted-foreground/20 text-muted-foreground"
                          }`}
                        >
                          {item.status === "pending" || item.status === "En cours"
                            ? "En cours"
                            : item.status === "validated" || item.status === "Terminé"
                              ? "Terminé"
                              : item.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {editingId === item.id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdate(item.id)}
                            className="p-1 rounded hover:bg-success/20 text-success"
                            title="Valider"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded hover:bg-destructive/20 text-destructive"
                            title="Annuler"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            // Convert "En cours" to "pending" for the select
                            const normalizedStatus = 
                              item.status === "En cours" 
                                ? "pending" 
                                : item.status === "Terminé" 
                                  ? "validated" 
                                  : item.status;
                            setEditData({
                              status: normalizedStatus,
                              sugar_content: item.sugar_content?.toString() || "",
                            });
                          }}
                          className="p-1 rounded hover:bg-muted text-muted-foreground"
                          title="Modifier"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
