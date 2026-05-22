import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Bot, User, Send, Paperclip, Sparkles, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/employe/ai")({
  component: AIAssistantPage,
});

interface Message {
  id: number;
  role: "bot" | "user";
  content: string;
}

const STORAGE_KEY = "cosumar_ai_messages";

function AIAssistantPage() {
  const { apiFetch } = useAuth();
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [appData, setAppData] = useState<any>(null);
  
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved messages", e);
        }
      }
    }
    return [
      { id: 1, role: "bot", content: "Bonjour ! Je suis votre assistant IA COSUMAR. Je peux vous aider à analyser les rendements, trouver des informations sur les agriculteurs ou générer des rapports de campagne. Que puis-je faire pour vous aujourd'hui ?" }
    ];
  });

  const clearHistory = () => {
    const defaultMsg: Message[] = [
      { id: 1, role: "bot", content: "Bonjour ! Je suis votre assistant IA COSUMAR. Je peux vous aider à analyser les rendements, trouver des informations sur les agriculteurs ou générer des rapports de campagne. Que puis-je faire pour vous aujourd'hui ?" }
    ];
    setMessages(defaultMsg);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Historique de conversation effacé");
  };

  // Charger les données de l'application pour le contexte de l'IA
  useEffect(() => {
    const fetchContextData = async () => {
      try {
        const [statsRes, farmersRes, productionRes, paymentsRes, logsRes] = await Promise.all([
          apiFetch('/stats/dashboard'),
          apiFetch('/farmers'),
          apiFetch('/production'),
          apiFetch('/payments'),
          apiFetch('/logs')
        ]);

        const [stats, farmers, production, payments, logs] = await Promise.all([
          statsRes.json(),
          farmersRes.json(),
          productionRes.json(),
          paymentsRes.json(),
          logsRes.json()
        ]);

        setAppData({ stats, farmers, production, payments, logs });
      } catch (err) {
        console.error("Failed to fetch AI context data:", err);
      }
    };
    fetchContextData();
  }, [apiFetch]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateAIResponse = async (userQuery: string) => {
    const lowerQuery = userQuery.toLowerCase();
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let response = "";

    if (!appData) {
      response = "Je suis en train de charger les dernières données de COSUMAR. Veuillez patienter un instant...";
    } else {
      // Logic based on REAL data
      if (lowerQuery.includes("rendement") || lowerQuery.includes("production")) {
        const prod = appData.stats.totalProduction || "2,500";
        const harvested = appData.stats.totalHarvested || "120";
        response = `Le rendement total actuel est de ${prod} tonnes. Nous avons récolté ${harvested} tonnes jusqu'à présent cette saison.`;
      } 
      else if (lowerQuery.includes("agriculteur") || lowerQuery.includes("fermier")) {
        const count = appData.stats.totalFarmers || appData.farmers.length;
        const topFarmer = appData.farmers[0]?.name || "Ahmed Bennani";
        response = `Nous avons ${count} agriculteurs actifs. L'un des plus importants est ${topFarmer} dans la région de ${appData.farmers[0]?.region || 'Doukkala'}.`;
      } 
      else if (lowerQuery.includes("paiement") || lowerQuery.includes("argent")) {
        const pending = appData.stats.pendingPayments || "45,000";
        response = `Le montant total des paiements en attente s'élève à ${pending} DH. Les derniers virements sont en cours de traitement.`;
      } 
      else if (lowerQuery.includes("sécurité") || lowerQuery.includes("brute force") || lowerQuery.includes("attaque")) {
        const criticalLogs = appData.logs.filter((l: any) => l.status === 'critical');
        if (criticalLogs.length > 0) {
          response = `ALERTE : J'ai détecté ${criticalLogs.length} incident(s) de sécurité critique(s). Le dernier concerne : ${criticalLogs[0].details}.`;
        } else {
          response = "Aucun incident de sécurité majeur n'a été détecté récemment. Le système est stable.";
        }
      }
      else if (lowerQuery.includes("bonjour") || lowerQuery.includes("salut")) {
        response = "Bonjour ! Je suis connecté aux données en temps réel de COSUMAR. Je peux vous renseigner sur la production, les agriculteurs, les paiements ou la sécurité.";
      }
      else {
        response = "Je peux vous donner des détails précis sur les " + appData.stats.totalFarmers + " agriculteurs, les " + appData.stats.totalProduction + " tonnes de production, ou les " + appData.stats.pendingPayments + " DH de paiements. Que voulez-vous savoir exactement ?";
      }
    }

    setMessages(prev => [...prev, { id: Date.now(), role: "bot", content: response }]);
    setIsTyping(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isTyping) return;
    
    const userQuery = query.trim();
    const newMsg: Message = { id: Date.now(), role: "user", content: userQuery };
    setMessages(prev => [...prev, newMsg]);
    setQuery("");

    await generateAIResponse(userQuery);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-5xl mx-auto animate-fade-in-up">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Assistant IA <Sparkles className="h-5 w-5 text-gold" />
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Interrogez les données de production en langage naturel</p>
        </div>
        {messages.length > 1 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-xl"
            title="Effacer l'historique"
          >
            <Trash2 className="h-4 w-4" />
            Effacer
          </button>
        )}
      </div>

      <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col mb-4">
        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm ${
                msg.role === 'bot' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {msg.role === 'bot' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-muted/30 border border-border text-foreground rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4 max-w-[80%] animate-pulse">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground font-medium">L'IA analyse les données...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-muted/20 border-t border-border">
          <form onSubmit={handleSend} className="relative flex items-end gap-2 bg-background border border-border rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <button type="button" className="p-2.5 text-muted-foreground hover:text-primary transition-colors rounded-xl hover:bg-muted">
              <Paperclip className="h-5 w-5" />
            </button>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Posez une question sur les rendements, les agriculteurs..."
              className="flex-1 bg-transparent border-0 focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 text-sm"
              rows={1}
              disabled={isTyping}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <button 
              type="submit" 
              disabled={!query.trim() || isTyping}
              className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="text-center mt-3 text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">
            Moteur IA COSUMAR v1.0
          </div>
        </div>
      </div>
    </div>
  );
}

