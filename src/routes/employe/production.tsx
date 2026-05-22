import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTION_ORDERS, PRODUCTION_DATA } from "@/lib/mock-data";
import { BarChart3, Package, TrendingUp, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/employe/production")({
  head: () => ({ meta: [{ title: "Production — Employé COSUMAR" }] }),
  component: ProductionPage,
});

function ProductionPage() {
  const ongoingOrders = PRODUCTION_ORDERS.filter(o => o.status === "En cours").length;
  const totalQuantity = PRODUCTION_ORDERS.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <>
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-foreground">Production</h1>
          <p className="text-muted-foreground mt-1">Suivi de la production agricole</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg"><Package className="text-primary w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Ordres Totaux</p>
              <h3 className="text-2xl font-bold">{PRODUCTION_ORDERS.length}</h3>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg"><Clock className="text-amber-500 w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">En Cours</p>
              <h3 className="text-2xl font-bold">{ongoingOrders}</h3>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg"><TrendingUp className="text-success w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Quantité Prévue (T)</p>
              <h3 className="text-2xl font-bold">{totalQuantity}</h3>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg"><BarChart3 className="text-blue-500 w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Efficacité</p>
              <h3 className="text-2xl font-bold">89%</h3>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Rendement de Production</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={PRODUCTION_DATA}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.65 0.15 85)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.65 0.15 85)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 100)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="harvested" stroke="oklch(0.65 0.15 85)" fill="url(#colorProd)" name="Produit (T)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Ordres Récents</h3>
            <div className="space-y-4">
              {PRODUCTION_ORDERS.map((order) => (
                <div key={order.id} className="p-3 rounded-lg border border-border/50 bg-muted/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{order.product}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'Terminé' ? 'bg-success/20 text-success' : 
                      order.status === 'En cours' ? 'bg-amber-500/20 text-amber-500' : 
                      'bg-muted-foreground/20 text-muted-foreground'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{order.quantity} Tonnes</span>
                    <span>{order.progress}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full" 
                      style={{ width: `${order.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
  );
}
