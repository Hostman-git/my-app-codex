import L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { RoutePlan } from '../types';

const startIcon = new L.DivIcon({ className: 'map-pin start', html: '<span></span>', iconSize: [22, 22] });
const finishIcon = new L.DivIcon({ className: 'map-pin finish', html: '<span></span>', iconSize: [22, 22] });

function FitRoute({ route }: { route: RoutePlan | null }) {
  const map = useMap();

  useEffect(() => {
    if (!route?.geometry.length) return;
    map.fitBounds(route.geometry, { padding: [36, 36], maxZoom: 15 });
  }, [map, route]);

  return null;
}

export function RouteMap({ route }: { route: RoutePlan | null }) {
  const center: [number, number] = route?.geometry[0] ?? [40.7128, -74.006];

  return (
    <MapContainer className="route-map" center={center} zoom={13} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {route && (
        <>
          <Polyline positions={route.geometry} pathOptions={{ color: '#fc4c02', weight: 5, opacity: 0.95 }} />
          <Marker position={[route.start.lat, route.start.lng]} icon={startIcon}>
            <Popup>Start</Popup>
          </Marker>
          <Marker position={[route.finish.lat, route.finish.lng]} icon={finishIcon}>
            <Popup>Finish</Popup>
          </Marker>
          <FitRoute route={route} />
        </>
      )}
    </MapContainer>
  );
}
