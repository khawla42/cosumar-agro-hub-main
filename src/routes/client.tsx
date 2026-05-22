import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Sprout, BarChart3, Droplets, Star, LogOut, User, Loader2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import cosumarLogo from "@/assets/cosumar-logo.png";

export const Route = createFileRoute("/client")({
  head: () => ({ meta: [{ title: "Espace Agriculteur — COSUMAR" }] }),
  component: ClientDashboard,
});

function ClientDashboard() {
  const { user, logout, apiFetch, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    cultivatedQty: "",
    harvestedQty: "",
    quality: "Bonne",
    landStatus: "Irriguée",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "client")) {
      navigate({ to: "/auth/login", search: { role: "client" } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      Promise.all([fetchFarmerStats(), fetchFarmerPayments()]).finally(() => setLoading(false));
    }
  }, [user]);

  const fetchFarmerStats = async () => {
    try {
      const response = await apiFetch(`/farmer-stats/${user?.id}`);
      const data = await response.json();
      setStats(data);
      // Pré-remplir la surface cultivée
      setFormData(prev => ({ ...prev, cultivatedQty: data.landArea.toString() }));
    } catch (error) {
      console.error("Error fetching farmer stats:", error);
    }
  };

  const fetchFarmerPayments = async () => {
    try {
      const response = await apiFetch(`/farmer-payments/${user?.id}`);
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching farmer payments:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiFetch(`/submit-production`, {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          cultivatedQty: formData.cultivatedQty,
          harvestedQty: formData.harvestedQty
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        fetchFarmerStats(); // Recharger les stats
        setTimeout(() => setSubmitted(false), 3000);
        setFormData(prev => ({ ...prev, harvestedQty: "" })); // Vider la récolte après soumission
      }
    } catch (error) {
      console.error("Error submitting production:", error);
    }
  };

  if (authLoading || (user && loading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "client") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={cosumarLogo} alt="COSUMAR" className="h-8 w-8 object-contain" />
            <span className="font-heading text-lg font-bold text-primary">COSUMAR</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{user.name}</span>
            </div>
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-foreground">Bienvenue, {user.name}</h1>
          <p className="text-muted-foreground mt-1">Gérez vos données agricoles</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Surface Cultivée" value={`${stats?.landArea || 0} ha`} icon={Sprout} />
          <StatCard title="Récolte Totale" value={`${stats?.totalHarvested || 0} T`} icon={BarChart3} />
          <StatCard title="Culture" value={stats?.cropType || "Betterave"} icon={Star} />
          <StatCard title="Irrigation" value="Active" icon={Droplets} subtitle="Système goutte à goutte" />
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 animate-fade-in-up animation-delay-200 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">Saisir vos données agricoles</h2>
          {submitted && (
            <div className="mb-4 p-3 rounded-lg bg-success/10 text-success text-sm font-medium">
              ✓ Données enregistrées avec succès
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Quantité cultivée (hectares)</label>
              <input
                type="number"
                value={formData.cultivatedQty}
                onChange={(e) => setFormData((p) => ({ ...p, cultivatedQty: e.target.value }))}
                placeholder="Ex: 45"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Quantité récoltée (tonnes)</label>
              <input
                type="number"
                value={formData.harvestedQty}
                onChange={(e) => setFormData((p) => ({ ...p, harvestedQty: e.target.value }))}
                placeholder="Ex: 38"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Qualité de production</label>
              <select
                value={formData.quality}
                onChange={(e) => setFormData((p) => ({ ...p, quality: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Excellente</option>
                <option>Bonne</option>
                <option>Moyenne</option>
                <option>Faible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Statut du terrain</label>
              <select
                value={formData.landStatus}
                onChange={(e) => setFormData((p) => ({ ...p, landStatus: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Irriguée</option>
                <option>Non irriguée</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Enregistrer les données
              </button>
            </div>
          </form>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in-up animation-delay-300">
          <div className="p-6 border-b border-border bg-muted/20">
            <h2 className="text-lg font-semibold text-foreground">Historique de vos Paiements</h2>
            <p className="text-xs text-muted-foreground mt-1">Suivi de vos règlements et factures</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Méthode</th>
                  <th className="px-6 py-4 font-semibold text-right">Montant</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                      Aucun historique de paiement disponible.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground">{new Date(p.date).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4">{p.method || 'Virement'}</td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">{Number(p.amount).toLocaleString()} MAD</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          p.status === 'Payé' || p.status === 'completed' ? 'bg-success/10 text-success' :
                          p.status === 'En attente' || p.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {p.status === 'completed' ? 'Payé' : p.status === 'pending' ? 'En attente' : p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}