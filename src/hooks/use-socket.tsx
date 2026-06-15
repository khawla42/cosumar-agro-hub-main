import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { create } from "zustand";

// Utiliser l'hôte actuel au lieu de localhost pour permettre l'accès réseau
const getSocketUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : `http://${window.location.hostname}:5000`;
  }
  return "http://localhost:5000";
};

const SOCKET_URL = getSocketUrl();

interface RealTimeNotification {
  id: string;
  type: "urgent" | "success" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
  category?: string;
}

interface NotificationStore {
  notifications: RealTimeNotification[];
  addNotification: (notif: Omit<RealTimeNotification, "id" | "read" | "time">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        {
          ...notif,
          id: Math.random().toString(36).substring(7),
          read: false,
          time: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
}));

interface SocketStore {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
}));

export const useSocket = () => {
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const { socket, setSocket } = useSocketStore();

  useEffect(() => {
    const isAuthPage = window.location.pathname.includes("/auth/");

    if (!user || (user.role !== "employe" && user.role !== "admin") || isAuthPage) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    if (!socket) {
      const newSocket = io(SOCKET_URL);

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket server");
        newSocket.emit("join", user.role);
      });

      newSocket.on("notification", (data) => {
        console.log("New real-time notification:", data);

        // Déterminer le titre en fonction du contenu
        let title = "Notification Système";
        if (data.type === "LOGIN") title = "Connexion Client";
        if (data.message?.includes("BRUTE FORCE")) title = "Alerte Brute Force";
        if (data.message?.includes("Injection SQL")) title = "Alerte Injection SQL";
        if (data.message?.includes("Attaque XSS")) title = "Alerte Attaque XSS";

        addNotification({
          type:
            data.type === "URGENT" || data.type === "urgent" || data.message?.includes("🚨")
              ? "urgent"
              : "info",
          title: title,
          message: data.message || "Nouvelle alerte détectée",
          category: "Sécurité",
        });

        // تحسين شكل الوصف في الـ Toast
        let displayDesc = data.message || "Action suspecte détectée";
        if (data.message?.includes("Payload bloqué")) {
          // إذا كان الميساج فيه الكود الخام، نختصروه
          displayDesc = `${title} (IP: ${data.ip || "Inconnue"})`;
        }

        // Ne pas afficher de toast si on est sur la page d'accueil (Public) ou de login
        const isPublicPage = window.location.pathname === "/";
        const isAuthPage = window.location.pathname.includes("/auth/");

        if (!isPublicPage && !isAuthPage && user?.role !== "client") {
          toast.info(title, {
            description: displayDesc,
            duration: 5000,
            position: "top-right",
            style: {
              border: "1px solid oklch(0.7 0.1 200)",
              background: "oklch(0.98 0.02 200)",
            },
          });
        }
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      setSocket(newSocket);
    }

    return () => {
      // Ne pas déconnecter ici pour garder la connexion entre les pages
    };
  }, [user, addNotification, socket, setSocket]);

  return socket;
};
