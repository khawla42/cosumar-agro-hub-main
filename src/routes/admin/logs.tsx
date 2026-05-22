import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { Search, AlertTriangle, Loader2 } from "lucide-react";
import React from "react";

export const Route = createFileRoute("/admin/logs")({
  head: () => ({ meta: [{ title: "Journaux — COSUMAR" }] }),
  component: AdminLogs,
});

function AdminLogs() {
  const { user, apiFetch } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [logsList, setLogsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await apiFetch(`/logs`);
      const data = await response.json();
      setLogsList(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") { navigate({ to: "/auth/select-role" }); return null; }

  const filtered = logsList.filter((l) => {
    if (search && !l.userName.toLowerCase().includes(search.toLowerCase()) && !l.action.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    return true;
  });

  const suspiciousIPs = useMemo(() => {
    const failedAttemptsByIP: Record<string, number> = {};
    const suspicious: string[] = [];
    for (const log of logsList) {
      if (log.status === "failed") {
        failedAttemptsByIP[log.ipAddress] = (failedAttemptsByIP[log.ipAddress] || 0) + 1;
        if (failedAttemptsByIP[log.ipAddress] >= 3 && !suspicious.includes(log.ipAddress)) {
          suspicious.push(log.ipAddress);
        }
      }
    }
    return suspicious;
  }, [logsList]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Journaux du Système</h1>
          <p className="text-muted-foreground mt-1">Historique des actions et connexions</p>
        </div>

        {suspiciousIPs.length > 0 && (
          <div className="mb-6 animate-fade-in-up">
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 flex items-start gap-4">
              <div className="p-2 bg-destructive/10 rounded-lg shrink-0">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-destructive">Activité suspecte détectée</h3>
                <p className="text-sm text-destructive/80 mt-1">
                  De multiples tentatives de connexion échouées ont été détectées depuis les adresses IP suivantes : 
                  <span className="font-mono font-bold ml-1">{suspiciousIPs.join(", ")}</span>. 
                  Veuillez vérifier les accès.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl border border-border">
          <div className="p-5 border-b border-border flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 rounded-lg border border-input bg-background text-sm">
              <option value="all">Tous les statuts</option>
              <option value="success">Succès</option>
              <option value="failed">Échoué</option>
              <option value="critical">Critique</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Utilisateur</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Rôle</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Action</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">IP</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-sm text-foreground">{l.userName}</div>
                      <div className="text-xs text-muted-foreground capitalize">{l.role}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{l.action}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground font-mono">{l.ipAddress}</td>
                    <td className="px-5 py-4 text-xs font-mono text-muted-foreground">{l.timestamp}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        l.status === "success" 
                          ? "bg-success/10 text-success" 
                          : l.status === "critical"
                            ? "bg-destructive text-white animate-pulse"
                            : "bg-destructive/10 text-destructive"
                      }`}>
                        {l.status === "success" ? "Succès" : l.status === "critical" ? "CRITIQUE" : "Échoué"}
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