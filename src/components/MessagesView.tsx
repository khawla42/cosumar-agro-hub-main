import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Mail, Clock, User, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";

export function MessagesView() {
  const { apiFetch } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await apiFetch("/contact-messages");
      if (!response.ok) {
        console.error("Failed to fetch messages:", response.statusText);
        setMessages([]);
        return;
      }
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await apiFetch(`/contact-messages/${id}/read`, { method: "PUT" });
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, is_read: true } : msg))
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return "Date inconnue";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Date invalide";
      return date.toLocaleString("fr-FR");
    } catch (e) {
      return "Format date invalide";
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Messages de Contact</h1>
          {unreadCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-bold">
              {unreadCount} Nouveau{unreadCount > 1 ? "x" : ""}
            </span>
          )}
        </div>
        <p className="text-muted-foreground mt-1">
          Gérez les demandes reçues via le formulaire de contact
        </p>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground italic">Aucun message reçu pour le moment.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id || Math.random()}
              onClick={() => !msg.is_read && markAsRead(msg.id)}
              className={`bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up cursor-pointer ${
                !msg.is_read
                  ? "border-primary/50 bg-primary/5"
                  : "border-border"
              }`}
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-foreground">
                      {msg.subject || "Sans sujet"}
                    </h3>
                    {!msg.is_read ? (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Nouveau
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Lu
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>{msg.name || "Anonyme"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{msg.email || "Pas d'email"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDate(msg.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 flex gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {msg.message || "Pas de contenu"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
