import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Package, TrendingUp, Clock, Loader2, Sprout, Edit2, Check, X } from "lucide-react";
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
import { io } from "socket.io-client";
import { toast } from "sonner";

const SOCKET_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : `http://${window.location.hostname}:5000`;

export const Route = createFileRoute("/admin/production")({
  head: () => ({ meta: [{ title: "Production — COSUMAR" }] }),
  component: ProductionPage,
});

function ProductionPage() {
  const { apiFetch } = useAuth();
  const [production, setProduction] = useState<any[]>([]);
  const [productionChart, setProductionChart] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ status: "", sugar_content: "" });

  useEffect(() => {
    fetchProduction();

    // Connexion WebSocket pour les mises à jour en temps réel
    const socket = io(SOCKET_URL);
    socket.on("production_updated", () => {
      fetchProduction();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchProduction = async () => {
    try {
      const response = await apiFetch(`/production`);
      const data = await response.json();
      setProduction(data);

      const statsResponse = await apiFetch(`/dashboard-stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
        setProductionChart(
          Array.isArray(statsData.productionChart) ? statsData.productionChart : [],
        );
      }
    } catch (error) {
      console.error("Error fetching production:", error);
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
        fetchProduction();
      } else {
        const errData = await response.json();
        toast.error(errData.message || "Erreur de mise à jour");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Erreur réseau");
    }
  };

  const ongoingOrders = production.filter(
    (o) => o.status === "pending" || o.status === "En cours",
  ).length;
  const totalQuantity = production.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

  const formatNum = (val: any) => {
    return (Number(val) || 0).toLocaleString("fr-FR", {
      maximumFractionDigits: 2,
    });
  };

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
        <h1 className="text-2xl font-bold text-foreground">Production de Betterave</h1>
        <p className="text-muted-foreground mt-1">Suivi de la production agricole et des récoltes en temps réel</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Package className="text-primary w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Récolté (T)</p>
            <h3 className="text-2xl font-bold">{formatNum(stats?.totalProduction || totalQuantity)}</h3>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-lg">
            <Clock className="text-amber-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">En Attente</p>
            <h3 className="text-2xl font-bold">{stats?.pendingCount || ongoingOrders}</h3>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
          <div className="p-3 bg-success/10 rounded-lg">
            <Sprout className="text-success w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Surface Totale (ha)</p>
            <h3 className="text-2xl font-bold">{formatNum(stats?.totalCultivated || 1037)}</h3>
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

      <div className="bg-card rounded-xl border border-border p-5 mb-8">
        <h3 className="font-semibold text-foreground mb-4">
          Rendement de Production (Betterave)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={productionChart}>
              <defs>
                <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                        type="monotone"
                        dataKey="harvested"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorQty)"
                      />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">
          Détails des Récoltes (Saisis par les Agriculteurs)
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
                  Aucune donnée de production disponible.
                </td>
              </tr>
            ) : (
              production.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 font-medium">{item.farmerName || "Inconnu"}</td>
                  <td className="px-4 py-4">
                    {formatNum(item.quantity)} T
                  </td>
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
                    {item.startDate ? new Date(item.startDate).toLocaleDateString("fr-FR") : "-"}
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
                            ? "bg-green-100 text-green-700"
                            : item.status === "pending" || item.status === "En cours"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-muted-foreground/20 text-muted-foreground"
                        }`}
                      >
                        {item.status === "pending" || item.status === "En cours"
                          ? "En cours"
                          : item.status === "validated" || item.status === "Terminé"
                            ? "Terminé"
                            : item.status || "N/A"}
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
