import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Region {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: string;
  production: string;
  farmers: number;
}

interface MapComponentProps {
  regions: Region[];
  activeRegion: Region | null;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapComponent({ regions, activeRegion }: MapComponentProps) {
  const defaultCenter: [number, number] = [31.7917, -7.0926]; // Center of Morocco
  const defaultZoom = 6;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="w-full h-full rounded-xl"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {regions.map((region) => (
        <Marker key={region.id} position={[region.lat, region.lng]}>
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-lg mb-1">{region.name}</h3>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Production:</span> <span className="font-semibold text-primary">{region.production}</span></p>
                <p><span className="text-muted-foreground">Agriculteurs:</span> <span className="font-semibold">{region.farmers}</span></p>
                <p><span className="text-muted-foreground">Statut:</span> <span className={`font-semibold ${
                  region.status === 'optimal' ? 'text-success' : 
                  region.status === 'warning' ? 'text-warning' : 'text-destructive'
                }`}>{region.status}</span></p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      {activeRegion && (
        <ChangeView center={[activeRegion.lat, activeRegion.lng]} zoom={9} />
      )}
    </MapContainer>
  );
}
