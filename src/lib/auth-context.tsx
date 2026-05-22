import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { toast } from "sonner";

export type UserRole = "admin" | "employe" | "client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cin?: string;
  region?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole, captcha?: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; cin: string; email: string; password: string; region?: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  apiFetch: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_TIMEOUT = 3 * 60 * 1000; // 3 minutes

// Définition dynamique de l'API pour accès via réseau (toutes les interfaces)
const getApiUrl = () => {
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:5000`;
  }
  return "http://localhost:5000";
};

const API_URL = getApiUrl();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckRef = useRef<number>(Date.now());

  // Charger le token et l'utilisateur au démarrage
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    fetchSettings().finally(() => setIsLoading(false));
  }, []);

  // Polling pour les événements de sécurité (Admin/Employé uniquement)
  useEffect(() => {
    if (!user || user.role === 'client') return;

    const checkSecurity = async () => {
      try {
        const response = await fetch(`${API_URL}/logs`);
        if (!response.ok) return;
        const logs = await response.json();
        
        // Chercher des logs critiques récents (brute force)
        const criticalLogs = logs.filter((l: any) => 
          l.status === 'critical' && 
          new Date(l.timestamp).getTime() > lastCheckRef.current
        );

        if (criticalLogs.length > 0) {
          criticalLogs.forEach((log: any) => {
            toast.error("ALERTE SÉCURITÉ", {
              description: `Tentative de brute force détectée : ${log.details}`,
              duration: 10000,
              important: true,
            });
          });
          lastCheckRef.current = Date.now();
        }
      } catch (err) {
        console.error("Security check failed:", err);
      }
    };

    const interval = setInterval(checkSecurity, 10000); // Toutes les 10 secondes
    return () => clearInterval(interval);
  }, [user]);

  const fetchSettings = async () => {
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const response = await fetch(`http://${hostname}:5000/settings`);
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      console.error("Settings fetch error:", err);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  // Gérer l'inactivité
  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (user && settings?.security_session_exp) {
      timeoutRef.current = setTimeout(() => {
        console.log("Session expirée pour inactivité (3 min)");
        logout();
        alert("Votre session a expiré après 3 minutes d'inactivité.");
      }, SESSION_TIMEOUT);
    }
  }, [user, logout, settings]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => resetInactivityTimer();

    if (user && settings?.security_session_exp) {
      events.forEach(event => window.addEventListener(event, handleActivity));
      resetInactivityTimer();
    }

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [user, resetInactivityTimer, settings]);

  const apiFetch = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    
    const headers = {
      ...options.headers,
      'Authorization': token || '',
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      const data = await response.clone().json();
      if (data.code === 'SESSION_EXPIRED') {
        logout();
        throw new Error('Session expirée');
      }
    }

    return response;
  }, [token, logout]);

  const login = useCallback(async (email: string, password: string, role: UserRole, captcha?: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, captcha }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          toast.error("COMPTE BLOQUÉ", {
            description: data.message,
            duration: 8000,
          });
        }
        return { success: false, message: data.message || "Erreur de connexion" };
      }

      setUser(data.user);
      setToken(data.token);
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, message: error.message || "Erreur réseau" };
    }
  }, []);

  const register = useCallback(async (data: { name: string; cin: string; email: string; password: string; region?: string }) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Erreur d'inscription");
      }

      setUser(responseData.user);
      setToken(responseData.token);
      if (responseData.token) {
        localStorage.setItem("auth_token", responseData.token);
        localStorage.setItem("auth_user", JSON.stringify(responseData.user));
      }
      
      return true;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, isAuthenticated: !!user, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}