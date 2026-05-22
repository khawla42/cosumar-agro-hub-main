import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/employe/farmers")({
  head: () => ({ meta: [{ title: "Agriculteurs — Employé COSUMAR" }] }),
  component: FarmersPage,
});

function FarmersPage() {
  const { apiFetch } = useAuth();
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState("all");
  const [farmersList, setFarmersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/farmers`);
      const data = await response.json();
      setFarmersList(data);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    } finally {
      setLoading(false);
    }
  };

  const regions = [...new Set(farmersList.map((f) => f.region))];
  const filtered = farmersList.filter((f) => {
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterRegion !== "all" && f.region !== filterRegion) return false;
    return true;
  });

  return (
    <>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-foreground">Agriculteurs</h1>
        <p className="text-muted-foreground mt-1">Annuaire et gestion détaillée des agriculteurs</p>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="p-5 border-b border-border flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un agriculteur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">Toutes les régions</option>
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filtered.length} agriculteur{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-semibold">Agriculteur</th>
                <th className="px-5 py-4 font-semibold">CIN / Contact</th>
                <th className="px-5 py-4 font-semibold">Région</th>
                <th className="px-5 py-4 font-semibold text-right">Surface</th>
                <th className="px-5 py-4 font-semibold">Statut Terrain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <span className="text-sm text-muted-foreground">Chargement des agriculteurs...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    Aucun agriculteur trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {f.name ? f.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-foreground">{f.name || 'Nom inconnu'}</div>
                          <div className="text-xs text-muted-foreground">ID: {f.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium">{f.cin}</div>
                      <div className="text-xs text-muted-foreground">{f.phone || '+212 6XX-XXXXXX'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {f.region}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground text-right font-medium">
                      {f.cultivatedQty || 0} ha
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        {f.landStatus || 'Betterave'}
                      </span>
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
