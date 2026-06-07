'use client';

import { MapContainer, Marker, Popup, TileLayer, Circle, Polyline } from 'react-leaflet';

const center: [number, number] = [23.1765, 75.7885];

const places = [
  {
    name: 'Mahakaleshwar Temple',
    position: [23.1828, 75.7681] as [number, number],
    type: 'Temple',
    note: 'Major spiritual landmark in Ujjain.'
  },
  {
    name: 'Ram Ghat',
    position: [23.1745, 75.7861] as [number, number],
    type: 'Ghat',
    note: 'Important Shipra riverfront pilgrimage point.'
  },
  {
    name: 'Dutt Akhada Ghat',
    position: [23.1757, 75.7897] as [number, number],
    type: 'Ghat',
    note: 'Frequently referenced during Simhastha visits.'
  },
  {
    name: 'Harsiddhi Temple',
    position: [23.1784, 75.7847] as [number, number],
    type: 'Temple',
    note: 'Popular temple near the core pilgrimage zone.'
  }
];

const route: [number, number][] = [
  [23.1828, 75.7681],
  [23.1798, 75.7770],
  [23.1778, 75.7820],
  [23.1745, 75.7861]
];

export default function LiveMap() {
  return (
    <MapContainer center={center} zoom={14} scrollWheelZoom className="h-[420px] w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={route} pathOptions={{ color: '#FF6B35', weight: 5 }} />
      <Circle center={[23.1745, 75.7861]} radius={350} pathOptions={{ color: '#E81B23' }} />
      {places.map((place) => (
        <Marker key={place.name} position={place.position}>
          <Popup>
            <div>
              <strong>{place.name}</strong>
              <br />
              {place.type}
              <br />
              {place.note}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
