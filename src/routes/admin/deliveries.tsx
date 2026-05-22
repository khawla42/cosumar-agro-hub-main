import { createFileRoute } from "@tanstack/react-router";
import { DELIVERIES } from "@/lib/mock-data";
import { Truck, MapPin, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/deliveries")({
  head: () => ({ meta: [{ title: "Livraisons — COSUMAR" }] }),
  component: DeliveriesPage,
});

function DeliveriesPage() {
  const ongoingCount = DELIVERIES.filter(d => d.status === "En cours").length;
  const deliveredCount = DELIVERIES.filter(d => d.status === "Livré").length;
  const delayedCount = DELIVERIES.filter(d => d.status === "Retard").length;

  return (
    <>
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-foreground">Livraisons</h1>
          <p className="text-muted-foreground mt-1">Suivi des expéditions et gestion de la logistique</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg"><Truck className="text-primary w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expéditions</p>
              <h3 className="text-2xl font-bold">{DELIVERIES.length}</h3>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg"><Clock className="text-blue-500 w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">En Cours</p>
              <h3 className="text-2xl font-bold text-blue-500">{ongoingCount}</h3>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg"><CheckCircle2 className="text-success w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Livrées</p>
              <h3 className="text-2xl font-bold text-success">{deliveredCount}</h3>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-lg"><MapPin className="text-destructive w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">En Retard</p>
              <h3 className="text-2xl font-bold text-destructive">{delayedCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold text-foreground">Suivi en temps réel</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">ID Livraison</th>
                  <th className="px-6 py-4 font-medium">Chauffeur</th>
                  <th className="px-6 py-4 font-medium">Véhicule</th>
                  <th className="px-6 py-4 font-medium">Origine</th>
                  <th className="px-6 py-4 font-medium">Destination</th>
                  <th className="px-6 py-4 font-medium">Heure Estimée</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {DELIVERIES.map((delivery) => (
                  <tr key={delivery.id} className="bg-card hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{delivery.id}</td>
                    <td className="px-6 py-4">{delivery.driverName}</td>
                    <td className="px-6 py-4 text-muted-foreground">{delivery.vehicle}</td>
                    <td className="px-6 py-4">{delivery.origin}</td>
                    <td className="px-6 py-4 font-medium">{delivery.destination}</td>
                    <td className="px-6 py-4">{delivery.eta}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-fit gap-1 ${
                        delivery.status === 'Livré' ? 'bg-success/20 text-success' :
                        delivery.status === 'En cours' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-destructive/20 text-destructive'
                      }`}>
                        {delivery.status === 'Livré' && <CheckCircle2 className="w-3 h-3" />}
                        {delivery.status === 'En cours' && <Truck className="w-3 h-3" />}
                        {delivery.status === 'Retard' && <Clock className="w-3 h-3" />}
                        {delivery.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
  );
}