import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth, type UserRole } from "@/lib/auth-context";
import {
  LayoutDashboard, Users, FileText, Settings, LogOut,
  BarChart3, Truck, CreditCard, Shield, Activity, Map, Calendar, Bell, BotMessageSquare
} from "lucide-react";
import cosumarLogo from "@/assets/cosumar-logo.png";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Tableau de bord", to: "/admin", icon: LayoutDashboard },
    { label: "Utilisateurs", to: "/admin/users", icon: Users },
    { label: "Production", to: "/admin/production", icon: BarChart3 },
    { label: "Paiements", to: "/admin/payments", icon: CreditCard },
    { label: "Livraisons", to: "/admin/deliveries", icon: Truck },
    { label: "Journaux", to: "/admin/logs", icon: FileText },
    { label: "Sécurité", to: "/admin/security", icon: Shield },
    { label: "Employés", to: "/admin/employees", icon: Users },
  ],
  employe: [
    { label: "Tableau de bord", to: "/employe", icon: LayoutDashboard },
    { label: "Agriculteurs", to: "/employe/farmers", icon: Users },
    { label: "Production", to: "/employe/production", icon: BarChart3 },
    { label: "Paiements", to: "/employe/payments", icon: CreditCard },
    { label: "Carte Interactive", to: "/employe/map", icon: Map },
    { label: "Calendrier", to: "/employe/calendar", icon: Calendar },
    { label: "Notifications", to: "/employe/notifications", icon: Bell },
    { label: "Assistant IA", to: "/employe/ai", icon: BotMessageSquare },
  ],
  client: [],
};

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });

  if (!user || user.role === "client") return null;

  const items = NAV_ITEMS[user.role];

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="p-5 flex items-center gap-3 border-b border-sidebar-border">
        <img src={cosumarLogo} alt="COSUMAR" className="h-9 w-9 object-contain" />
        <div>
          <div className="font-heading font-bold text-sm">COSUMAR</div>
          <div className="text-xs text-sidebar-foreground/60 capitalize">{user.role}</div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const isActive = currentPath === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <div className="px-3 py-2 mb-2">
          <div className="text-sm font-medium">{user.name}</div>
          <div className="text-xs text-sidebar-foreground/60">{user.email}</div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-all w-full"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}