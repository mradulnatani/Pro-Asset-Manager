import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

interface AssetMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

const customIcon = new Icon({
  iconUrl: "/map-marker.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function AssetMap({ latitude, longitude, name }: AssetMapProps) {
  return (
    <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]} icon={customIcon}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
}