import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Sprout, BarChart3, Users, Truck, ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";
import techImage from "@/assets/tech-agriculture.png";
import sugarFactoryImage from "@/assets/sugar-factory.png";
import sugarProductImage from "@/assets/sugar-product.png";
import farmerImage from "@/assets/farmer-field.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "COSUMAR — Gestion Agricole Moderne" },
      { name: "description", content: "Plateforme de gestion agricole pour la filière sucrière au Maroc" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-16">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Champs de betterave" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm">
              🌿 Leader de la filière sucrière au Maroc
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              Gestion Agricole <span className="text-gold">Intelligente</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 max-w-lg leading-relaxed">
              Une plateforme moderne pour gérer vos cultures, suivre votre production et optimiser vos rendements avec COSUMAR.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/auth/select-role"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Commencer <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-all backdrop-blur-sm"
              >
                En savoir plus
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
                À propos de <span className="text-primary">COSUMAR</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                COSUMAR est le leader de la filière sucrière au Maroc, engagé dans le développement agricole durable et l'accompagnement des agriculteurs à travers des solutions innovantes.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 mt-8">
                {[
                  { num: "80+", label: "Années d'expérience" },
                  { num: "80K+", label: "Agriculteurs partenaires" },
                  { num: "6", label: "Régions couvertes" },
                  { num: "100%", label: "Engagement qualité" },
                ].map((stat) => (
                  <div key={stat.label} className="p-6 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow">
                    <div className="text-3xl font-bold text-primary font-heading">{stat.num}</div>
                    <div className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px]">
              <img src={techImage} alt="Agriculture moderne" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                <p className="text-white font-medium text-xl max-w-sm">L'innovation technologique au service de l'agriculture marocaine.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Nos Services</h2>
            <p className="mt-4 text-muted-foreground">Des outils modernes pour une agriculture performante</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Sprout, title: "Suivi Cultural", desc: "Gérez vos cultures et suivez l'évolution de vos plantations en temps réel." },
              { icon: BarChart3, title: "Analyse Production", desc: "Tableaux de bord analytiques pour optimiser vos rendements agricoles." },
              { icon: Users, title: "Gestion Agriculteurs", desc: "Plateforme de collaboration entre agriculteurs et équipes COSUMAR." },
              { icon: Truck, title: "Suivi Livraisons", desc: "Traçabilité complète de la récolte jusqu'à la livraison en usine." },
            ].map((service) => (
              <div key={service.title} className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className="p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Transformation & Production</h2>
            <p className="mt-4 text-muted-foreground">De la récolte au produit final, un processus de haute qualité</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-3xl overflow-hidden shadow-xl group relative h-[400px]">
              <img src={sugarFactoryImage} alt="Usine COSUMAR" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2">Installations Modernes</h3>
                  <p className="text-white/80">Des usines à la pointe de la technologie pour garantir une extraction optimale et durable.</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl group relative h-[400px]">
              <img src={sugarProductImage} alt="Produit fini COSUMAR" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2">Un Sucre de Qualité</h3>
                  <p className="text-white/80">Un produit pur, conçu dans le respect des normes internationales les plus strictes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Notre Quotidien en Images</h2>
            <p className="mt-4 text-muted-foreground">Découvrez l'univers COSUMAR, des champs jusqu'à l'usine</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-lg group relative min-h-[400px]">
              <img src={heroImage} alt="Champs" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">Nos Terres Agricoles</h3>
                  <p className="text-white/80 text-sm">Une culture responsable et respectueuse de l'environnement.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg group relative h-48 md:h-64">
              <img src={techImage} alt="Technologie" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-semibold text-sm">Agriculture Connectée</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg group relative h-48 md:h-64">
              <img src={sugarProductImage} alt="Sucre pur" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-semibold text-sm">Qualité Premium</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg group relative h-48 md:h-64">
              <img src={farmerImage} alt="Agriculteur COSUMAR" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-semibold text-sm">Soutien aux Agriculteurs</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg group relative h-48 md:h-64">
              <img src={sugarFactoryImage} alt="Usine" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-semibold text-sm">Excellence Industrielle</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground">Contactez-nous</h2>
              <p className="mt-4 text-muted-foreground">Notre équipe est à votre disposition pour répondre à toutes vos questions.</p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: MapPin, text: "8, Rue El Mouatamid Ibnou Abbad, Casablanca" },
                  { icon: Phone, text: "+212 522 67 83 00" },
                  { icon: Mail, text: "contact@cosumar.ma" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-muted-foreground">
                    <item.icon className="h-5 w-5 text-primary" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Nom" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <input type="text" placeholder="Sujet" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <textarea rows={4} placeholder="Votre message" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                <button className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  Envoyer le message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2026 COSUMAR. Tous droits réservés. Plateforme de gestion agricole.
          </p>
        </div>
      </footer>
    </div>
  );
}
