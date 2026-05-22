import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Bell, AlertTriangle, CheckCircle, Info, Trash2, Check, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/employe/notifications")({
  component: NotificationsPage,
});

interface Notification {
  id: number;
  type: "urgent" | "success" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
  category?: string;
}

function NotificationsPage() {
  const { apiFetch } = useAuth();
  const [activeTab, setActiveTab] = useState('Toutes');
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: "urgent", title: "Alerte Météo - Fortes Pluies", message: "Des précipitations importantes sont prévues dans la région du Gharb dans les prochaines 48h. Veuillez conseiller aux agriculteurs de suspendre l'irrigation.", time: "Il y a 10 min", read: false, category: "Météo" },
    { id: 2, type: "success", title: "Paiement Validé", message: "Le lot de paiements pour la coopérative Al Amal (Tadla) a été effectué avec succès.", time: "Il y a 1h", read: false, category: "Paiements" },
    { id: 3, type: "warning", title: "Retard de Livraison", message: "Le camion L-405 a signalé une panne. Retard prévu de 2 heures pour la livraison à Sidi Bennour.", time: "Il y a 3h", read: true, category: "Logistique" },
    { id: 4, type: "info", title: "Nouvelle Circulaire", message: "Les nouveaux barèmes de qualité pour la campagne 2026 sont maintenant disponibles dans le centre documentaire.", time: "Hier", read: true, category: "Système" },
  ]);
  const [selectedActionNotif, setSelectedActionNotif] = useState<Notification | null>(null);

  // Charger les alertes de sécurité réelles depuis les logs
  useEffect(() => {
    const fetchSecurityAlerts = async () => {
      try {
        const response = await apiFetch('/logs');
        if (!response.ok) return;
        const logs = await response.json();
        
        const securityNotifs: Notification[] = logs
          .filter((l: any) => l.status === 'critical')
          .map((l: any, idx: number) => ({
            id: 1000 + idx,
            type: "urgent",
            title: "Alerte Brute Force",
            message: l.details,
            time: l.timestamp,
            read: false,
            category: "Sécurité"
          }));

        if (securityNotifs.length > 0) {
          setNotifications(prev => {
            // Éviter les doublons simples
            const existingMessages = new Set(prev.map(n => n.message));
            const uniqueNew = securityNotifs.filter(n => !existingMessages.has(n.message));
            return [...uniqueNew, ...prev];
          });
        }
      } catch (err) {
        console.error("Failed to fetch security alerts:", err);
      }
    };

    fetchSecurityAlerts();
  }, [apiFetch]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const filteredNotifications = useMemo(() => notifications.filter(notif => {
    if (activeTab === 'Non lues') return !notif.read;
    if (activeTab === 'Urgentes') return notif.type === 'urgent';
    return true; // 'Toutes'
  }), [notifications, activeTab]);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success("Notification marquée comme lue");
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) return;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("Toutes les notifications ont été marquées comme lues");
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.info("Notification supprimée");
  };

  const clearRead = () => {
    setNotifications(prev => prev.filter(n => !n.read));
    toast.info("Notifications lues effacées");
  };

  const handleTakeAction = (notif: Notification) => {
    setSelectedActionNotif(notif);
  };

  const confirmAction = () => {
    if (selectedActionNotif) {
      markAsRead(selectedActionNotif.id);
      setSelectedActionNotif(null);
      toast.success("Action enregistrée avec succès");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'info': return <Info className="h-5 w-5 text-primary" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto pb-12">
      <div className="mb-8 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            Centre de Notifications
            {unreadCount > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground mt-1.5">Gérez vos alertes et communications en temps réel</p>
        </div>
        <div className="flex gap-2">
          {notifications.some(n => n.read) && (
            <Button variant="ghost" size="sm" onClick={clearRead} className="text-muted-foreground hover:text-destructive">
              Effacer les lues
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead} 
            disabled={unreadCount === 0}
            className="gap-2"
          >
            <Check className="h-4 w-4" /> Tout marquer comme lu
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex border-b border-border bg-muted/30">
          {['Toutes', 'Non lues', 'Urgentes'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-sm font-semibold transition-all relative ${
                activeTab === tab 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>
        
        <div className="divide-y divide-border">
          {filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-6 flex gap-5 transition-all group ${
                !notif.read ? 'bg-primary/5' : 'hover:bg-muted/30'
              }`}
            >
              <div className={`mt-0.5 p-3 rounded-2xl h-fit transition-all ${
                !notif.read ? 'bg-background shadow-md' : 'bg-muted'
              }`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1.5 gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <h4 className={`font-bold text-base truncate ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notif.title}
                    </h4>
                    {notif.category && (
                      <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {notif.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">{notif.time}</span>
                    <button 
                      onClick={() => deleteNotification(notif.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${!notif.read ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                  {notif.message}
                </p>
                <div className="flex gap-4">
                  {!notif.read ? (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5" /> Marquer comme lu
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-success" /> Lu
                    </span>
                  )}
                  {notif.type === 'urgent' && (
                    <button 
                      onClick={() => handleTakeAction(notif)}
                      className="text-xs font-bold text-destructive hover:text-destructive/80 flex items-center gap-1.5"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Prendre action
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredNotifications.length === 0 && (
            <div className="p-20 text-center">
              <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                <Bell className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-bold text-foreground">Tout est à jour !</h3>
              <p className="text-sm text-muted-foreground mt-1">Vous n'avez aucune notification dans cette catégorie.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedActionNotif} onOpenChange={(open) => !open && setSelectedActionNotif(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center text-xl">Action Requise</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Vous allez traiter l'alerte : <span className="font-bold text-foreground">"{selectedActionNotif?.title}"</span>.
              Cette action sera enregistrée dans les journaux système.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-4 rounded-2xl text-sm italic text-muted-foreground mt-2 border border-border">
            "{selectedActionNotif?.message}"
          </div>
          <DialogFooter className="sm:justify-center gap-2 mt-6">
            <Button variant="outline" onClick={() => setSelectedActionNotif(null)} className="rounded-xl px-8">
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmAction} className="rounded-xl px-8">
              Confirmer l'intervention
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
