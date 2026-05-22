import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import cosumarLogo from "@/assets/cosumar-logo.png";

export const Route = createFileRoute("/auth/register")({
  head: () => ({ meta: [{ title: "Inscription — COSUMAR" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", cin: "", email: "", password: "", confirm: "", region: "Doukkala" });
  const [settings, setSettings] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.name || !form.cin || !form.email || !form.password) {
      setError("Veuillez remplir tous les champs obligatoires");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    // Validation mot de passe strict (si activé)
    if (settings?.security_strict_pwd) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(form.password)) {
        setError("Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial.");
        setLoading(false);
        return;
      }
    } else {
      // Minimum de base même si désactivé
      if (form.password.length < 2) {
        setError("Le mot de passe est trop court");
        setLoading(false);
        return;
      }
    }

    try {
      const success = await register({
        name: form.name,
        cin: form.cin,
        email: form.email,
        password: form.password,
        region: form.region
      });

      if (success) {
        navigate({ to: "/client" });
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={cosumarLogo} alt="COSUMAR" className="h-10 w-10 object-contain" />
            <span className="font-heading text-xl font-bold text-primary">COSUMAR</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Créer un compte</h1>
          <p className="mt-2 text-muted-foreground text-sm">Inscription réservée aux agriculteurs</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nom complet</label>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Votre nom complet" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">CIN</label>
              <input type="text" value={form.cin} onChange={(e) => update("cin", e.target.value)} placeholder="AB123456" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Région</label>
              <select value={form.region} onChange={(e) => update("region", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="Doukkala">Doukkala</option>
                <option value="Tadla">Tadla</option>
                <option value="Gharb">Gharb</option>
                <option value="Loukkos">Loukkos</option>
                <option value="Moulouya">Moulouya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="votre@email.com" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Mot de passe</label>
              <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirmer le mot de passe</label>
              <input type="password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Créer mon compte
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link to="/auth/login" search={{ role: "client" }} className="text-primary font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}