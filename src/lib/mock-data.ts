export interface Farmer {
  id: string;
  name: string;
  cin: string;
  email: string;
  region: string;
  cultivatedQty: number;
  harvestedQty: number;
  quality: "Excellente" | "Bonne" | "Moyenne" | "Faible";
  landStatus: "Irriguée" | "Non irriguée";
  paymentStatus: "Payé" | "En attente" | "Non payé";
  deliveryStatus: "Livré" | "En cours" | "En attente";
}

export interface LogEntry {
  id: string;
  userName: string;
  role: string;
  action: string;
  ipAddress: string;
  timestamp: string;
  status: "success" | "failed";
}

export interface Employee {
  id: string;
  name: string;
  role: "admin" | "manager" | "opérateur";
  email: string;
  department: string;
  performance: number;
  status: "Actif" | "Inactif" | "Congé";
}

export interface Payment {
  id: string;
  farmerName: string;
  amount: number;
  date: string;
  status: "Payé" | "En attente" | "Échoué";
  method: "Virement" | "Chèque" | "Espèces";
}

export interface Delivery {
  id: string;
  driverName: string;
  vehicle: string;
  origin: string;
  destination: string;
  status: "En cours" | "Livré" | "Retard";
  eta: string;
}

export interface ProductionOrder {
  id: string;
  product: string;
  quantity: number;
  startDate: string;
  status: "En cours" | "Terminé" | "En attente";
  progress: number;
}

export const FARMERS: Farmer[] = [
  { id: "1", name: "Ahmed Bennani", cin: "AB123456", email: "ahmed@mail.com", region: "Doukkala", cultivatedQty: 45, harvestedQty: 38, quality: "Excellente", landStatus: "Betterave", paymentStatus: "Payé", deliveryStatus: "Livré" },
  { id: "2", name: "Fatima Zohra", cin: "CD789012", email: "fatima@mail.com", region: "Gharb", cultivatedQty: 30, harvestedQty: 25, quality: "Bonne", landStatus: "Betterave", paymentStatus: "En attente", deliveryStatus: "En cours" },
  { id: "3", name: "Hassan Oulad", cin: "EF345678", email: "hassan@mail.com", region: "Tadla", cultivatedQty: 60, harvestedQty: 42, quality: "Moyenne", landStatus: "Betterave", paymentStatus: "Non payé", deliveryStatus: "En attente" },
  { id: "4", name: "Khadija Amrani", cin: "GH901234", email: "khadija@mail.com", region: "Doukkala", cultivatedQty: 25, harvestedQty: 22, quality: "Excellente", landStatus: "Betterave", paymentStatus: "Payé", deliveryStatus: "Livré" },
  { id: "5", name: "Youssef El Fassi", cin: "IJ567890", email: "youssef@mail.com", region: "Loukkos", cultivatedQty: 55, harvestedQty: 48, quality: "Bonne", landStatus: "Betterave", paymentStatus: "Payé", deliveryStatus: "Livré" },
  { id: "6", name: "Amina Tazi", cin: "KL234567", email: "amina@mail.com", region: "Moulouya", cultivatedQty: 35, harvestedQty: 20, quality: "Faible", landStatus: "Betterave", paymentStatus: "Non payé", deliveryStatus: "En attente" },
  { id: "7", name: "Omar Berrada", cin: "MN890123", email: "omar@mail.com", region: "Gharb", cultivatedQty: 70, harvestedQty: 65, quality: "Excellente", landStatus: "Betterave", paymentStatus: "En attente", deliveryStatus: "En cours" },
  { id: "8", name: "Salma Idrissi", cin: "OP456789", email: "salma@mail.com", region: "Tadla", cultivatedQty: 40, harvestedQty: 35, quality: "Bonne", landStatus: "Betterave", paymentStatus: "Payé", deliveryStatus: "Livré" },
  { id: "9", name: "Khalid Mansouri", cin: "QR012345", email: "khalid@mail.com", region: "Moulouya", cultivatedQty: 20, harvestedQty: 18, quality: "Moyenne", landStatus: "Betterave", paymentStatus: "Payé", deliveryStatus: "Livré" },
  { id: "10", name: "Nadia Fassi", cin: "ST678901", email: "nadia@mail.com", region: "Doukkala", cultivatedQty: 50, harvestedQty: 45, quality: "Excellente", landStatus: "Betterave", paymentStatus: "En attente", deliveryStatus: "En cours" },
];

export const LOGS: LogEntry[] = [
  { id: "1", userName: "Admin COSUMAR", role: "admin", action: "Connexion au système", ipAddress: "192.168.1.10", timestamp: "2026-05-03T08:30:00", status: "success" },
  { id: "2", userName: "Mohammed Alami", role: "employe", action: "Consultation liste agriculteurs", ipAddress: "192.168.1.25", timestamp: "2026-05-03T09:15:00", status: "success" },
  { id: "3", userName: "Ahmed Bennani", role: "client", action: "Mise à jour données agricoles", ipAddress: "10.0.0.45", timestamp: "2026-05-03T09:45:00", status: "success" },
  { id: "4", userName: "Inconnu", role: "admin", action: "Tentative de connexion", ipAddress: "203.0.113.50", timestamp: "2026-05-03T10:00:00", status: "failed" },
  { id: "5", userName: "Inconnu", role: "admin", action: "Tentative de connexion", ipAddress: "203.0.113.50", timestamp: "2026-05-03T10:01:00", status: "failed" },
  { id: "5b", userName: "Inconnu", role: "admin", action: "Tentative de connexion", ipAddress: "203.0.113.50", timestamp: "2026-05-03T10:02:00", status: "failed" },
  { id: "6", userName: "Fatima Zohra", role: "client", action: "Soumission récolte", ipAddress: "10.0.0.78", timestamp: "2026-05-03T10:30:00", status: "success" },
  { id: "7", userName: "Admin COSUMAR", role: "admin", action: "Création compte employé", ipAddress: "192.168.1.10", timestamp: "2026-05-03T11:00:00", status: "success" },
  { id: "8", userName: "Mohammed Alami", role: "employe", action: "Mise à jour statut paiement", ipAddress: "192.168.1.25", timestamp: "2026-05-03T11:30:00", status: "success" },
  { id: "9", userName: "Inconnu", role: "client", action: "Tentative de connexion", ipAddress: "198.51.100.23", timestamp: "2026-05-03T12:00:00", status: "failed" },
  { id: "10", userName: "Hassan Oulad", role: "client", action: "Consultation tableau de bord", ipAddress: "10.0.0.92", timestamp: "2026-05-03T12:30:00", status: "success" },
];

export const PRODUCTION_DATA = [
  { month: "Jan", cultivated: 120, harvested: 95 },
  { month: "Fév", cultivated: 135, harvested: 110 },
  { month: "Mar", cultivated: 150, harvested: 125 },
  { month: "Avr", cultivated: 170, harvested: 145 },
  { month: "Mai", cultivated: 160, harvested: 140 },
  { month: "Jun", cultivated: 180, harvested: 160 },
];

export const QUALITY_DATA = [
  { name: "Excellente", value: 35, fill: "oklch(0.45 0.12 150)" },
  { name: "Bonne", value: 40, fill: "oklch(0.65 0.15 85)" },
  { name: "Moyenne", value: 18, fill: "oklch(0.55 0.1 200)" },
  { name: "Faible", value: 7, fill: "oklch(0.6 0.08 30)" },
];

export const EMPLOYEES: Employee[] = [
  { id: "1", name: "Karim Tazi", role: "admin", email: "karim@cosumar.ma", department: "Direction", performance: 95, status: "Actif" },
  { id: "2", name: "Nadia Lahlou", role: "manager", email: "nadia@cosumar.ma", department: "Production", performance: 88, status: "Actif" },
  { id: "3", name: "Rachid Benali", role: "opérateur", email: "rachid@cosumar.ma", department: "Logistique", performance: 75, status: "Congé" },
  { id: "4", name: "Amina Chraibi", role: "manager", email: "amina@cosumar.ma", department: "Finances", performance: 92, status: "Actif" },
  { id: "5", name: "Yassine Daoudi", role: "opérateur", email: "yassine@cosumar.ma", department: "Production", performance: 80, status: "Actif" },
];

export const PAYMENTS: Payment[] = [
  { id: "PAY-001", farmerName: "Ahmed Bennani", amount: 15000, date: "2026-05-01", status: "Payé", method: "Virement" },
  { id: "PAY-002", farmerName: "Fatima Zohra", amount: 8500, date: "2026-05-02", status: "En attente", method: "Chèque" },
  { id: "PAY-003", farmerName: "Hassan Oulad", amount: 12000, date: "2026-05-03", status: "Échoué", method: "Virement" },
  { id: "PAY-004", farmerName: "Khadija Amrani", amount: 9400, date: "2026-04-28", status: "Payé", method: "Espèces" },
  { id: "PAY-005", farmerName: "Omar Berrada", amount: 21000, date: "2026-05-03", status: "En attente", method: "Virement" },
];

export const DELIVERIES: Delivery[] = [
  { id: "LIV-101", driverName: "Said El Mansouri", vehicle: "Camion A1", origin: "Gharb", destination: "Usine Centrale", status: "En cours", eta: "14:30" },
  { id: "LIV-102", driverName: "Brahim Fassi", vehicle: "Camion B3", origin: "Doukkala", destination: "Usine Sud", status: "Livré", eta: "10:15" },
  { id: "LIV-103", driverName: "Mustapha Tazi", vehicle: "Fourgon C2", origin: "Loukkos", destination: "Dépôt Nord", status: "Retard", eta: "16:00" },
  { id: "LIV-104", driverName: "Kamal Idrissi", vehicle: "Camion A2", origin: "Tadla", destination: "Usine Centrale", status: "En cours", eta: "15:45" },
];

export const PRODUCTION_ORDERS: ProductionOrder[] = [
  { id: "ORD-501", product: "Sucre Blanc", quantity: 5000, startDate: "2026-05-01", status: "En cours", progress: 65 },
  { id: "ORD-502", product: "Sucre Brut", quantity: 3000, startDate: "2026-04-25", status: "Terminé", progress: 100 },
  { id: "ORD-503", product: "Mélasse", quantity: 1500, startDate: "2026-05-04", status: "En attente", progress: 0 },
  { id: "ORD-504", product: "Sucre Blanc", quantity: 4500, startDate: "2026-05-02", status: "En cours", progress: 30 },
];