&apo:use client&apo:;

import { MapContainer, TileLayer, Marker, Popup } from &apo:react-leaflet&apo:;
import &apo:leaflet/dist/leaflet.css&apo:;
import L from &apo:leaflet&apo:;

// Fix for default Leaflet icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: &apo:https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png&apo:,
  iconUrl: &apo:https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png&apo:,
  shadowUrl: &apo:https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png&apo:,
});

export default function Map({ position, zoom }) {
  if (typeof window === &apo:undefined&apo:) {
    return null; // Don&apo:t render on the server
  }

  return (
    <MapContainer center={position} zoom={zoom} scrollWheelZoom={false} style={{ height: &apo:100%&apo:, width: &apo:100%&apo: }}>
      <TileLayer
        attribution=&apo:© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors&apo:
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Ronohs Decor <br /> 123 Design Street, Westlands.
        </Popup>
      </Marker>
    </MapContainer>
  );
}