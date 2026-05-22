import { U as jsxRuntimeExports } from "./worker-entry-D6sA9fSD.js";
import { L as Link } from "./router-C2dGhf-y.js";
import { c as cosumarLogo } from "./cosumar-logo-BFmipKES.js";
import { c as createLucideIcon } from "./createLucideIcon-DlByY22N.js";
import { S as Sprout } from "./sprout-D5xbx29P.js";
import { C as ChartColumn } from "./chart-column-Cz9F7Ik0.js";
import { U as Users } from "./users-b0TKxeqs.js";
import { T as Truck } from "./truck-CzO1vvbx.js";
import { M as MapPin } from "./map-pin-B4hS_bLA.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode);
function Header() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cosumarLogo, alt: "COSUMAR", className: "h-10 w-10 object-contain" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-heading text-xl font-bold text-primary", children: "COSUMAR" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#about", className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors", children: "À propos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#services", className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors", children: "Services" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#contact", className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors", children: "Contact" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/auth/select-role",
        className: "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg",
        children: "Connexion"
      }
    )
  ] }) });
}
const heroImage = "/cosumar-agro-hub-/assets/hero-agriculture-cgBzyCF2.jpg";
const techImage = "/cosumar-agro-hub-/assets/tech-agriculture-DiDY6aDx.png";
const sugarFactoryImage = "/cosumar-agro-hub-/assets/sugar-factory-B0QL4qmt.png";
const sugarProductImage = "/cosumar-agro-hub-/assets/sugar-product-D2TEVxSQ.png";
const farmerImage = "/cosumar-agro-hub-/assets/farmer-field-BHNuEIJe.png";
function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative min-h-[90vh] flex items-center pt-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImage, alt: "Champs de betterave", className: "w-full h-full object-cover", width: 1920, height: 1080 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl animate-fade-in-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm", children: "🌿 Leader de la filière sucrière au Maroc" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight", children: [
          "Gestion Agricole ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold", children: "Intelligente" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-primary-foreground/80 max-w-lg leading-relaxed", children: "Une plateforme moderne pour gérer vos cultures, suivre votre production et optimiser vos rendements avec COSUMAR." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth/select-role", className: "inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl", children: [
            "Commencer ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#about", className: "inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-all backdrop-blur-sm", children: "En savoir plus" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "about", className: "py-20 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-heading text-3xl sm:text-4xl font-bold text-foreground", children: [
          "À propos de ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "COSUMAR" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-muted-foreground leading-relaxed", children: "COSUMAR est le leader de la filière sucrière au Maroc, engagé dans le développement agricole durable et l'accompagnement des agriculteurs à travers des solutions innovantes." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-6 mt-8", children: [{
          num: "80+",
          label: "Années d'expérience"
        }, {
          num: "80K+",
          label: "Agriculteurs partenaires"
        }, {
          num: "6",
          label: "Régions couvertes"
        }, {
          num: "100%",
          label: "Engagement qualité"
        }].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-primary font-heading", children: stat.num }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm font-medium text-muted-foreground", children: stat.label })
        ] }, stat.label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-3xl overflow-hidden shadow-2xl h-[500px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: techImage, alt: "Agriculture moderne", className: "w-full h-full object-cover hover:scale-105 transition-transform duration-700" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium text-xl max-w-sm", children: "L'innovation technologique au service de l'agriculture marocaine." }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "services", className: "py-20 bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-heading text-3xl sm:text-4xl font-bold text-foreground", children: "Nos Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Des outils modernes pour une agriculture performante" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [{
        icon: Sprout,
        title: "Suivi Cultural",
        desc: "Gérez vos cultures et suivez l'évolution de vos plantations en temps réel."
      }, {
        icon: ChartColumn,
        title: "Analyse Production",
        desc: "Tableaux de bord analytiques pour optimiser vos rendements agricoles."
      }, {
        icon: Users,
        title: "Gestion Agriculteurs",
        desc: "Plateforme de collaboration entre agriculteurs et équipes COSUMAR."
      }, {
        icon: Truck,
        title: "Suivi Livraisons",
        desc: "Traçabilité complète de la récolte jusqu'à la livraison en usine."
      }].map((service) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:-translate-y-1 transition-all group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(service.icon, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-semibold text-foreground", children: service.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: service.desc })
      ] }, service.title)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-heading text-3xl sm:text-4xl font-bold text-foreground", children: "Transformation & Production" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "De la récolte au produit final, un processus de haute qualité" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl overflow-hidden shadow-xl group relative h-[400px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: sugarFactoryImage, alt: "Usine COSUMAR", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-bold text-2xl mb-2", children: "Installations Modernes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80", children: "Des usines à la pointe de la technologie pour garantir une extraction optimale et durable." })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl overflow-hidden shadow-xl group relative h-[400px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: sugarProductImage, alt: "Produit fini COSUMAR", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-bold text-2xl mb-2", children: "Un Sucre de Qualité" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80", children: "Un produit pur, conçu dans le respect des normes internationales les plus strictes." })
          ] }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-heading text-3xl sm:text-4xl font-bold text-foreground", children: "Notre Quotidien en Images" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Découvrez l'univers COSUMAR, des champs jusqu'à l'usine" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-lg group relative min-h-[400px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImage, alt: "Champs", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-bold text-xl mb-1", children: "Nos Terres Agricoles" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm", children: "Une culture responsable et respectueuse de l'environnement." })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl overflow-hidden shadow-lg group relative h-48 md:h-64", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: techImage, alt: "Technologie", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold text-sm", children: "Agriculture Connectée" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl overflow-hidden shadow-lg group relative h-48 md:h-64", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: sugarProductImage, alt: "Sucre pur", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold text-sm", children: "Qualité Premium" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl overflow-hidden shadow-lg group relative h-48 md:h-64", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: farmerImage, alt: "Agriculteur COSUMAR", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold text-sm", children: "Soutien aux Agriculteurs" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl overflow-hidden shadow-lg group relative h-48 md:h-64", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: sugarFactoryImage, alt: "Usine", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold text-sm", children: "Excellence Industrielle" }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "contact", className: "py-20 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-heading text-3xl font-bold text-foreground", children: "Contactez-nous" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Notre équipe est à votre disposition pour répondre à toutes vos questions." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 space-y-4", children: [{
          icon: MapPin,
          text: "8, Rue El Mouatamid Ibnou Abbad, Casablanca"
        }, {
          icon: Phone,
          text: "+212 522 67 83 00"
        }, {
          icon: Mail,
          text: "contact@cosumar.ma"
        }].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.text })
        ] }, item.text)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Nom", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", placeholder: "Email", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Sujet", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 4, placeholder: "Votre message", className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors", children: "Envoyer le message" })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-foreground text-primary-foreground py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/60 text-sm", children: "© 2026 COSUMAR. Tous droits réservés. Plateforme de gestion agricole." }) }) })
  ] });
}
export {
  Index as component
};
