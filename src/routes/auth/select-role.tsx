import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Briefcase, Sprout } from "lucide-react";
import cosumarLogo from "@/assets/cosumar-logo.png";

export const Route = createFileRoute("/auth/select-role")({
  head: () => ({
    meta: [{ title: "Choisir votre rôle — COSUMAR" }],
  }),
  component: SelectRole,
});

function SelectRole() {
  const roles = [
    {
      role: "admin",
      label: "Administrateur",
      desc: "Gestion complète du système",
      icon: Shield,
      color: "bg-primary",
    },
    {
      role: "employe",
      label: "Employé",
      desc: "Suivi des agriculteurs et production",
      icon: Briefcase,
      color: "bg-chart-2",
    },
    {
      role: "client",
      label: "Agriculteur",
      desc: "Gestion de vos données agricoles",
      icon: Sprout,
      color: "bg-success",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10 animate-fade-in-up">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={cosumarLogo} alt="COSUMAR" className="h-12 w-12 object-contain" />
            <span className="font-heading text-2xl font-bold text-primary">COSUMAR</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Choisissez votre rôle</h1>
          <p className="mt-2 text-muted-foreground">Sélectionnez votre profil pour continuer</p>
        </div>
        <div className="space-y-4">
          {roles.map((r, i) => (
            <Link
              key={r.role}
              to="/auth/login"
              search={{ role: r.role }}
              className={`flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all animate-fade-in-up animation-delay-${(i + 1) * 100}`}
            >
              <div className={`p-3 rounded-xl ${r.color}/10`}>
                <r.icon className={`h-6 w-6 text-primary`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{r.label}</h3>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </div>
              <span className="text-muted-foreground">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
