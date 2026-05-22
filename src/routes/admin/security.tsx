import { createFileRoute } from "@tanstack/react-router";
import { Shield, Key, Lock, AlertTriangle, Fingerprint, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/security")({
  head: () => ({ meta: [{ title: "Sécurité — COSUMAR" }] }),
  component: SecurityPage,
});

function SecurityPage() {
  const { apiFetch } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    security_captcha: true,
    security_strict_pwd: true,
    security_session_exp: true,
    security_ip_block: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchLogs(), fetchSettings()]).finally(() => setLoading(false));
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await apiFetch(`/logs`);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await apiFetch(`/settings`);
      const data = await response.json();
      if (Object.keys(data).length > 0) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const toggleSetting = async (key: string) => {
    const newValue = !settings[key];
    setSettings((prev: any) => ({ ...prev, [key]: newValue }));
    
    try {
      await apiFetch(`/settings/update`, {
        method: "POST",
        body: JSON.stringify({ key, value: newValue }),
      });
    } catch (error) {
      console.error("Error updating setting:", error);
      // Revert if error
      setSettings((prev: any) => ({ ...prev, [key]: !newValue }));
    }
  };

  const failedLogins = logs.filter(l => l.status === "failed");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const SecuritySwitch = ({ label, description, checked, onChange }: any) => (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium text-sm">{label}</h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <div 
        onClick={onChange}
        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${checked ? 'right-0.5' : 'left-0.5'}`}></div>
      </div>
    </div>
  );

  return (
    <>
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-foreground">Sécurité</h1>
          <p className="text-muted-foreground mt-1">Gestion des accès et surveillance du système</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/10 rounded-lg"><Shield className="text-primary w-5 h-5" /></div>
              <h3 className="font-semibold">État du système</h3>
            </div>
            <p className="text-sm text-success font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              Sécurisé
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-destructive/10 rounded-lg"><AlertTriangle className="text-destructive w-5 h-5" /></div>
              <h3 className="font-semibold">Alertes (24h)</h3>
            </div>
            <p className="text-xl font-bold text-destructive">{failedLogins.length}</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-blue-500/10 rounded-lg"><Key className="text-blue-500 w-5 h-5" /></div>
              <h3 className="font-semibold">Rôles Actifs</h3>
            </div>
            <p className="text-xl font-bold">3</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-amber-500/10 rounded-lg"><Lock className="text-amber-500 w-5 h-5" /></div>
              <h3 className="font-semibold">CAPTCHA</h3>
            </div>
            <p className="text-sm text-muted-foreground">{settings.security_captcha ? 'Activé' : 'Désactivé'}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Tentatives de connexion échouées</h3>
            </div>
            <div className="p-5 flex-1 overflow-auto max-h-[400px]">
              <div className="space-y-4">
                {failedLogins.map((log) => (
                  <div key={log.id} className="p-4 rounded-lg bg-destructive/5 border border-destructive/10 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-sm text-foreground">{log.action}</span>
                      <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Utilisateur : <span className="font-medium text-foreground">{log.userName}</span></div>
                    <div className="text-sm text-muted-foreground">Adresse IP : <span className="font-mono bg-muted px-1 py-0.5 rounded text-xs">{log.ipAddress}</span></div>
                  </div>
                ))}
                {failedLogins.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">Aucune alerte récente.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border flex items-center gap-2">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Paramètres de sécurité globaux</h3>
            </div>
            <div className="p-5 space-y-6">
              <SecuritySwitch 
                label="Protection CAPTCHA"
                description="Ajoute un code de vérification visuel sur la page de connexion."
                checked={settings.security_captcha}
                onChange={() => toggleSetting('security_captcha')}
              />
              <SecuritySwitch 
                label="Politique de mots de passe stricts"
                description="Minimum 8 caractères, incluant symboles et chiffres."
                checked={settings.security_strict_pwd}
                onChange={() => toggleSetting('security_strict_pwd')}
              />
              <SecuritySwitch 
                label="Expiration des sessions"
                description="Déconnexion automatique après 3 minutes d'inactivité."
                checked={settings.security_session_exp}
                onChange={() => toggleSetting('security_session_exp')}
              />
              <SecuritySwitch 
                label="Blocage d'adresse IP"
                description="Bloquer l'IP après 5 tentatives échouées consécutives."
                checked={settings.security_ip_block}
                onChange={() => toggleSetting('security_ip_block')}
              />
            </div>
          </div>
        </div>
      </>
  );
}