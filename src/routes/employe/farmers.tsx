import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, MapPin, Loader2, UserPlus, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFarmer, setNewFarmer] = useState({
    name: "",
    email: "",
    cin: "",
    phone: "",
    region: "Doukkala",
    surface: "",
    culture: "Betterave",
    password: "", // Mot de passe par défaut
  });

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/farmers`);
      if (!response.ok) {
        setFarmersList([]);
        return;
      }
      const data = await response.json();
      setFarmersList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      setFarmersList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({
          name: newFarmer.name,
          email: newFarmer.email,
          cin: newFarmer.cin,
          phone: newFarmer.phone,
          region: newFarmer.region,
          landArea: newFarmer.surface,
          cropType: newFarmer.culture,
          password: newFarmer.password,
          role: "client",
        }),
      });

      if (response.ok) {
        toast.success("Agriculteur ajouté avec succès");
        setShowAddModal(false);
        setNewFarmer({
          name: "",
          email: "",
          cin: "",
          phone: "",
          region: "Doukkala",
          surface: "",
          culture: "Betterave",
          password: "Password123!",
        });
        fetchFarmers();
      } else {
        const error = await response.json();
        toast.error(error.message || "Erreur lors de l'ajout");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  const regions = [
    ...new Set(Array.isArray(farmersList) ? farmersList.map((f) => f.region).filter(Boolean) : []),
  ];
  const filtered = (Array.isArray(farmersList) ? farmersList : []).filter((f) => {
    if (search && !f.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterRegion !== "all" && f.region !== filterRegion) return false;
    return true;
  });

  return (
    <>
      <div className="mb-8 animate-fade-in-up flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agriculteurs</h1>
          <p className="text-muted-foreground mt-1">
            Annuaire et gestion détaillée des agriculteurs
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Nouveau agriculteur</span>
        </button>
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-semibold">Ajouter un agriculteur</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-muted rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddFarmer} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom complet</label>
                <input
                  required
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  value={newFarmer.name}
                  onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  required
                  type="email"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  value={newFarmer.email}
                  onChange={(e) => setNewFarmer({ ...newFarmer, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Numéro de téléphone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  value={newFarmer.phone}
                  onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">CIN</label>
                  <input
                    required
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    value={newFarmer.cin}
                    onChange={(e) => setNewFarmer({ ...newFarmer, cin: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Région</label>
                  <select
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    value={newFarmer.region}
                    onChange={(e) => setNewFarmer({ ...newFarmer, region: e.target.value })}
                  >
                    <option value="Doukkala">Doukkala</option>
                    <option value="Gharb">Gharb</option>
                    <option value="Tadla">Tadla</option>
                    <option value="Loukkos">Loukkos</option>
                    <option value="Moulouya">Moulouya</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Surface (ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    value={newFarmer.surface}
                    onChange={(e) => setNewFarmer({ ...newFarmer, surface: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Culture</label>
                  <select
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    value={newFarmer.culture}
                    onChange={(e) => setNewFarmer({ ...newFarmer, culture: e.target.value })}
                  >
                    <option value="Betterave">Betterave</option>
                    <option value="Canne à sucre">Canne à sucre</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Mot de passe (par défaut)</label>
                <input
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  value={newFarmer.password}
                  onChange={(e) => setNewFarmer({ ...newFarmer, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
              >
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}

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
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Toutes les régions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filtered.length} agriculteur{filtered.length !== 1 ? "s" : ""} trouvé
            {filtered.length !== 1 ? "s" : ""}
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
                    <span className="text-sm text-muted-foreground">
                      Chargement des agriculteurs...
                    </span>
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
                          {f.name ? f.name.charAt(0) : "?"}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-foreground">
                            {f.name || "Nom inconnu"}
                          </div>
                          <div className="text-xs text-muted-foreground">ID: {f.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium">{f.cin}</div>
                      <div className="text-xs text-muted-foreground">
                        {f.phone || "+212 6XX-XXXXXX"}
                      </div>
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
                        {f.landStatus || "Betterave"}
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
