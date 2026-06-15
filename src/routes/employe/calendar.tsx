import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  X,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
  parseISO,
} from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

export const Route = createFileRoute("/employe/calendar")({
  component: CalendarPage,
});

interface Event {
  id: number;
  title: string;
  type: string;
  time: string;
  location: string;
  date: string;
}

function CalendarPage() {
  const { apiFetch } = useAuth();
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "visite",
    time: "",
    location: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiFetch("/calendar-events");
      if (!response.ok) {
        setEvents([]);
        return;
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
  }, [viewDate]);

  const selectedDayEvents = useMemo(() => {
    return (Array.isArray(events) ? events : []).filter((evt) =>
      isSameDay(parseISO(evt.date), selectedDate),
    );
  }, [events, selectedDate]);

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;

    try {
      const response = await apiFetch("/calendar-events", {
        method: "POST",
        body: JSON.stringify(newEvent),
      });
      if (response.ok) {
        toast.success("Événement ajouté");
        fetchEvents();
        setShowModal(false);
        setNewEvent({
          title: "",
          type: "visite",
          time: "",
          location: "",
          date: format(selectedDate, "yyyy-MM-dd"),
        });
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Supprimer cet événement ?")) return;
    try {
      const response = await apiFetch(`/calendar-events/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Événement supprimé");
        fetchEvents();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const nextMonth = () => setViewDate(addMonths(viewDate, 1));
  const prevMonth = () => setViewDate(subMonths(viewDate, 1));

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendrier de Campagne</h1>
          <p className="text-muted-foreground mt-1">Planification des visites et livraisons</p>
        </div>
        <button
          onClick={() => {
            setNewEvent((prev) => ({ ...prev, date: format(selectedDate, "yyyy-MM-dd") }));
            setShowModal(true);
          }}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <CalendarIcon className="h-4 w-4" />+ Nouvel Événement
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-xl capitalize">
              {format(viewDate, "MMMM yyyy", { locale: fr })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={prevMonth}
                className="p-2 border border-border rounded-xl hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 border border-border rounded-xl hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
              <div
                key={day}
                className="py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center"
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day, i) => {
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, viewDate);
              const dayEvents = events.filter((evt) => isSameDay(parseISO(evt.date), day));

              return (
                <div
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    bg-background min-h-[90px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1
                    ${isSelected ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/30"}
                    ${!isCurrentMonth ? "opacity-30" : ""}
                  `}
                >
                  <span
                    className={`
                    inline-flex h-7 w-7 items-center justify-center rounded-lg text-sm font-semibold
                    ${isSelected ? "bg-primary text-primary-foreground" : "text-foreground"}
                  `}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="flex flex-wrap justify-center gap-1 mt-auto pb-1">
                    {dayEvents.slice(0, 3).map((evt, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 w-1.5 rounded-full ${
                          evt.type === "visite"
                            ? "bg-primary"
                            : evt.type === "livraison"
                              ? "bg-gold"
                              : "bg-chart-3"
                        }`}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-1">
              <CalendarIcon className="h-4 w-4 text-primary" />
              {format(selectedDate, "eeee d MMMM", { locale: fr })}
            </h3>
            <p className="text-xs text-muted-foreground">
              {selectedDayEvents.length === 0
                ? "Aucun événement prévu"
                : `${selectedDayEvents.length} événement(s) programmé(s)`}
            </p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
            {selectedDayEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-card p-4 rounded-xl border border-border relative overflow-hidden group hover:shadow-md transition-all"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    evt.type === "visite"
                      ? "bg-primary"
                      : evt.type === "livraison"
                        ? "bg-gold"
                        : "bg-chart-3"
                  }`}
                />
                <div className="pl-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm">{evt.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(evt.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {evt.time || "Non spécifié"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {evt.location || "Non spécifié"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm">
          <div className="bg-card rounded-xl border border-border shadow-2xl p-4 w-full max-w-sm animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-foreground">Nouvel événement</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Planifié pour le {format(parseISO(newEvent.date), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-foreground">Date de l'événement</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-foreground">Titre</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Ex: Visite terrain Ahmed..."
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-foreground">Type d'activité</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="visite">🌿 Visite Terrain</option>
                  <option value="livraison">🚛 Livraison</option>
                  <option value="inspection">🔍 Inspection Qualité</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <label className="text-xs font-semibold text-foreground">Heure</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-xs font-semibold text-foreground">Lieu</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Secteur, Usine..."
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.title}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                Planifier l'événement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
