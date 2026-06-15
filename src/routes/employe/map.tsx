import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Navigation, Info, Plus, Loader2, Trash2, Edit } from "lucide-react";
import { useState, useEffect, Suspense, lazy } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Import MapComponent lazily to avoid SSR issues
const MapComponent = lazy(() => import("@/components/MapComponent"));

export const Route = createFileRoute("/employe/map")({
  component: MapPage,
});

function MapPage() {
  const { apiFetch } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [activeRegion, setActiveRegion] = useState<any>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newRegion, setNewRegion] = useState({
    name: "",
    lat: "",
    lng: "",
    status: "optimal",
    production: "",
    farmers: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRegionId, setEditingRegionId] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const response = await apiFetch("/regions");
      if (!response.ok) {
        setRegions([]);
        return;
      }
      const data = await response.json();
      setRegions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching regions:", error);
      setRegions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRegion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const lat = parseFloat(newRegion.lat);
      const lng = parseFloat(newRegion.lng);

      if (isNaN(lat) || lat < -90 || lat > 90) {
        toast.error("Latitude invalide (doit être entre -90 et 90)");
        return;
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        toast.error("Longitude invalide (doit être entre -180 et 180)");
        return;
      }

      const regionData = {
        name: newRegion.name,
        lat: lat,
        lng: lng,
        status: newRegion.status,
        production: newRegion.production.includes(" T")
          ? newRegion.production
          : newRegion.production + " T",
        farmers: parseInt(newRegion.farmers),
      };

      if (editingRegionId) {
        const response = await apiFetch(`/regions/${editingRegionId}`, {
          method: "PATCH",
          body: JSON.stringify(regionData),
        });

        if (response.ok) {
          toast.success("Région mise à jour");
          fetchRegions();
          setNewRegion({
            name: "",
            lat: "",
            lng: "",
            status: "optimal",
            production: "",
            farmers: "",
          });
          setIsDialogOpen(false);
          setEditingRegionId(null);
        }
      } else {
        const response = await apiFetch("/regions", {
          method: "POST",
          body: JSON.stringify(regionData),
        });

        if (response.ok) {
          toast.success("Région ajoutée");
          fetchRegions();
          setNewRegion({
            name: "",
            lat: "",
            lng: "",
            status: "optimal",
            production: "",
            farmers: "",
          });
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      toast.error(editingRegionId ? "Erreur lors de la mise à jour" : "Erreur lors de l'ajout");
    }
  };

  const handleEditClick = (region: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setNewRegion({
      name: region.name,
      lat: region.lat.toString(),
      lng: region.lng.toString(),
      status: region.status,
      production: region.production.replace(" T", ""),
      farmers: region.farmers.toString(),
    });
    setEditingRegionId(region.id);
    setIsDialogOpen(true);
  };

  const handleDeleteRegion = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette région ?")) return;

    try {
      const response = await apiFetch(`/regions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Région supprimée");
        fetchRegions();
        if (activeRegion?.id === id) setActiveRegion(null);
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setNewRegion((prev) => ({
      ...prev,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
    }));
    if (!isDialogOpen) {
      setIsDialogOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Carte Interactive des Régions</h1>
          <p className="text-muted-foreground mt-1">
            Surveillance en temps réel des zones de culture sucrière au Maroc
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingRegionId(null);
              setNewRegion({
                name: "",
                lat: "",
                lng: "",
                status: "optimal",
                production: "",
                farmers: "",
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Ajouter une région
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingRegionId ? "Modifier la région" : "Ajouter une nouvelle région"}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Vous pouvez cliquer directement sur la carte pour définir les coordonnées.
              </p>
            </DialogHeader>
            <form onSubmit={handleAddRegion} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de la région</Label>
                <Input
                  id="name"
                  placeholder="ex: Tadla"
                  value={newRegion.name}
                  onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.0001"
                    placeholder="32.33"
                    value={newRegion.lat}
                    onChange={(e) => setNewRegion({ ...newRegion, lat: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="0.0001"
                    placeholder="-6.35"
                    value={newRegion.lng}
                    onChange={(e) => setNewRegion({ ...newRegion, lng: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Statut actuel</Label>
                <Select
                  value={newRegion.status}
                  onValueChange={(val) => setNewRegion({ ...newRegion, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="optimal">Optimal (Vert)</SelectItem>
                    <SelectItem value="warning">Avertissement (Orange)</SelectItem>
                    <SelectItem value="critical">Critique (Rouge)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="production">Production (Tons)</Label>
                  <Input
                    id="production"
                    placeholder="28,000"
                    value={newRegion.production}
                    onChange={(e) => setNewRegion({ ...newRegion, production: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="farmers">Nombre d'agriculteurs</Label>
                  <Input
                    id="farmers"
                    type="number"
                    placeholder="600"
                    value={newRegion.farmers}
                    onChange={(e) => setNewRegion({ ...newRegion, farmers: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Enregistrer la région</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 h-[600px] relative overflow-hidden flex flex-col">
          {isClient ? (
            <Suspense
              fallback={
                <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-xl">
                  <div className="text-center">
                    <MapPin className="h-10 w-10 text-primary/50 animate-bounce mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
                  </div>
                </div>
              }
            >
              <MapComponent
                regions={regions}
                activeRegion={activeRegion}
                onMapClick={handleMapClick}
              />
            </Suspense>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-xl">
              <MapPin className="h-12 w-12 text-primary/20 mx-auto mb-4" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Régions Actives
          </h3>
          <div className="grid gap-3 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin">
            {regions.map((region) => (
              <div
                key={region.id}
                onClick={() => setActiveRegion(region)}
                className={`bg-card p-4 rounded-xl border transition-all cursor-pointer group ${
                  activeRegion?.id === region.id
                    ? "border-primary shadow-md bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4
                    className={`font-bold transition-colors ${
                      activeRegion?.id === region.id
                        ? "text-primary"
                        : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {region.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleEditClick(region, e)}
                      className="p-1 hover:bg-primary/10 rounded text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteRegion(region.id, e)}
                      className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        region.status === "optimal"
                          ? "bg-success"
                          : region.status === "warning"
                            ? "bg-warning"
                            : "bg-destructive"
                      }`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">Production</div>
                    <div className="font-medium">{region.production}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Agriculteurs</div>
                    <div className="font-medium">{region.farmers}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activeRegion ? (
            <div className="mt-2 p-5 bg-primary/5 rounded-xl border border-primary/20 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Détails: {activeRegion.name}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activeRegion.status === "optimal"
                      ? "bg-success/10 text-success border border-success/20"
                      : activeRegion.status === "warning"
                        ? "bg-warning/10 text-warning border border-warning/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                  }`}
                >
                  {activeRegion.status.charAt(0).toUpperCase() + activeRegion.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Production Annuelle
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {activeRegion.production}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Total Agriculteurs
                  </div>
                  <div className="text-2xl font-bold text-foreground">{activeRegion.farmers}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-primary/10 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Navigation className="h-4 w-4" />
                  <span>Lat: {Number(activeRegion.lat).toFixed(4)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Navigation className="h-4 w-4 rotate-90" />
                  <span>Lng: {Number(activeRegion.lng).toFixed(4)}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 gap-2 border-primary/20 text-primary hover:bg-primary/5"
                onClick={() => setActiveRegion(null)}
              >
                Réinitialiser la vue
              </Button>
            </div>
          ) : (
            <div className="mt-2 p-4 bg-muted/30 rounded-xl border border-border text-sm">
              <div className="flex items-start gap-3 text-muted-foreground">
                <Info className="h-5 w-5 shrink-0 mt-0.5" />
                <p>
                  Sélectionnez une région pour zoomer sur la carte et afficher les détails complets
                  de la zone.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
