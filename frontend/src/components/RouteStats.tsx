import { Clock, Gauge, Mountain, Route } from 'lucide-react';
import type { RoutePlan } from '../types';

function hours(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function RouteStats({ route }: { route: RoutePlan | null }) {
  const stats = route
    ? [
        { label: 'Distance', value: `${route.distanceKm.toFixed(2)} km`, icon: <Route size={18} /> },
        { label: 'Est. time', value: hours(route.estimatedMinutes), icon: <Clock size={18} /> },
        { label: 'Avg pace', value: route.averagePace, icon: <Gauge size={18} /> },
        { label: 'Elevation', value: route.elevationGainM === null ? 'Unavailable' : `${route.elevationGainM} m`, icon: <Mountain size={18} /> }
      ]
    : [
        { label: 'Distance', value: '--', icon: <Route size={18} /> },
        { label: 'Est. time', value: '--', icon: <Clock size={18} /> },
        { label: 'Avg pace', value: '--', icon: <Gauge size={18} /> },
        { label: 'Elevation', value: '--', icon: <Mountain size={18} /> }
      ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div className="stat-card" key={stat.label}>
          <div>{stat.icon}</div>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </div>
      ))}
    </div>
  );
}
