import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth, type UserRole } from "@/lib/auth-context";
import cosumarLogo from "@/assets/cosumar-logo.png";
import { RefreshCw } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    role: (search.role as UserRole) || "client",
  }),
  head: () => ({
    meta: [{ title: "Connexion — COSUMAR" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { role } = Route.useSearch();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaData, setCaptchaData] = useState<string | null>(null);
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
      if (data.security_captcha) {
        fetchCaptcha();
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
    }
  };

  const fetchCaptcha = async () => {
    try {
      setCaptchaData(null); // Reset before fetch
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const response = await fetch(`http://${hostname}:5000/auth/captcha`);
      const data = await response.json();
      console.log("Nouveau CAPTCHA reçu:", data.captcha);
      setCaptchaData(data.captcha);
    } catch (err) {
      console.error("Captcha fetch error:", err);
    }
  };

  const roleLabels: Record<UserRole, string> = {
    admin: "Administrateur",
    employe: "Employé",
    client: "Agriculteur",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    const currentRole = role as UserRole;
    const result = await login(email, password, currentRole, captchaInput);
    
    if (result.success) {
      const routes: Record<UserRole, string> = { admin: "/admin", employe: "/employe", client: "/client" };
      navigate({ to: routes[currentRole] });
    } else {
      setError(result.message || "Email ou mot de passe incorrect");
      fetchCaptcha(); // Refresh captcha on error
      setCaptchaInput("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={cosumarLogo} alt="COSUMAR" className="h-10 w-10 object-contain" />
            <span className="font-heading text-xl font-bold text-primary">COSUMAR</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Connexion — {roleLabels[role as UserRole]}</h1>
          <p className="mt-2 text-muted-foreground text-sm">Entrez vos identifiants pour accéder à votre espace</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Section CAPTCHA */}
            {settings?.security_captcha && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Vérification de sécurité</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-muted h-12 rounded-lg flex items-center justify-center font-mono font-bold tracking-[0.5em] text-lg select-none italic border border-border shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <span className="relative z-10 transform -rotate-3 skew-x-12 text-primary">{captchaData || "..."}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={fetchCaptcha}
                    className="p-3 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
                    title="Actualiser le code"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                  placeholder="Entrez le code ci-dessus"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono uppercase"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          {role === "client" && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link to="/auth/register" className="text-primary font-medium hover:underline">
                Créer un compte
              </Link>
            </p>
          )}
          <p className="mt-3 text-center">
            <Link to="/auth/select-role" className="text-sm text-muted-foreground hover:text-primary">
              ← Changer de rôle
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}