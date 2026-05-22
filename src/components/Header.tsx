import { Link } from "@tanstack/react-router";
import cosumarLogo from "@/assets/cosumar-logo.png";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={cosumarLogo} alt="COSUMAR" className="h-10 w-10 object-contain" />
          <span className="font-heading text-xl font-bold text-primary">COSUMAR</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">À propos</a>
          <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</a>
          <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</a>
        </nav>
        <Link
          to="/auth/select-role"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          Connexion
        </Link>
      </div>
    </header>
  );
}