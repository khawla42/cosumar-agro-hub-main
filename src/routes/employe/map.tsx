import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Navigation, Info, Plus } from "lucide-react";
import { useState, useEffect, Suspense, lazy } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import MapComponent lazily to avoid SSR issues
const MapComponent = lazy(() => import("@/components/MapComponent"));

export const Route = createFileRoute("/employe/map")({
  component: MapPage,
});

function MapPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeRegion, setActiveRegion] = useState<any>(null);
  const [regions, setRegions] = useState([
    { id: 1, name: "Doukkala", lat: 32.73, lng: -8.53, status: "optimal", production: "45,000 T", farmers: 1200 },
    { id: 2, name: "Gharb", lat: 34.25, lng: -6.58, status: "warning", production: "32,000 T", farmers: 850 },
    { id: 3, name: "Tadla", lat: 32.33, lng: -6.35, status: "optimal", production: "28,000 T", farmers: 600 },
    { id: 4, name: "Loukkos", lat: 35.0, lng: -6.0, status: "critical", production: "15,000 T", farmers: 400 },
    { id: 5, name: "Moulouya", lat: 34.9, lng: -2.3, status: "optimal", production: "22,000 T", farmers: 550 },
  ]);

  const [newRegion, setNewRegion] = useState({
    name: "",
    lat: "",
    lng: "",
    status: "optimal",
    production: "",
    farmers: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddRegion = (e: React.FormEvent) => {
    e.preventDefault();
    const id = regions.length + 1;
    const regionToAdd = {
      id,
      name: newRegion.name,
      lat: parseFloat(newRegion.lat),
      lng: parseFloat(newRegion.lng),
      status: newRegion.status,
      production: newRegion.production + " T",
      farmers: parseInt(newRegion.farmers)
    };
    setRegions([...regions, regionToAdd]);
    setNewRegion({ name: "", lat: "", lng: "", status: "optimal", production: "", farmers: "" });
    setIsDialogOpen(false);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Carte Interactive des Régions</h1>
          <p className="text-muted-foreground mt-1">Surveillance en temps réel des zones de culture sucrière au Maroc</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Ajouter une région
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle région</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddRegion} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de la région</Label>
                <Input 
                  id="name" 
                  placeholder="ex: Tadla" 
                  value={newRegion.name} 
                  onChange={(e) => setNewRegion({...newRegion, name: e.target.value})}
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
                    onChange={(e) => setNewRegion({...newRegion, lat: e.target.value})}
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
                    onChange={(e) => setNewRegion({...newRegion, lng: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Statut actuel</Label>
                <Select 
                  value={newRegion.status} 
                  onValueChange={(val) => setNewRegion({...newRegion, status: val})}
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
                    onChange={(e) => setNewRegion({...newRegion, production: e.target.value})}
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
                    onChange={(e) => setNewRegion({...newRegion, farmers: e.target.value})}
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
            <Suspense fallback={
              <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-xl">
                <div className="text-center">
                  <MapPin className="h-10 w-10 text-primary/50 animate-bounce mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
                </div>
              </div>
            }>
              <MapComponent regions={regions} activeRegion={activeRegion} />
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
                  activeRegion?.id === region.id ? 'border-primary shadow-md bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-bold transition-colors ${
                    activeRegion?.id === region.id ? 'text-primary' : 'text-foreground group-hover:text-primary'
                  }`}>{region.name}</h4>
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    region.status === 'optimal' ? 'bg-success' : 
                    region.status === 'warning' ? 'bg-warning' : 'bg-destructive'
                  }`} />
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
          
          <div className="mt-2 p-4 bg-primary/5 rounded-xl border border-primary/20 text-sm">
            <div className="flex items-start gap-3 text-primary">
              <Info className="h-5 w-5 shrink-0 mt-0.5" />
              <p>Sélectionnez une région pour zoomer sur la carte et afficher les détails.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

