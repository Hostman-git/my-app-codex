import { Trash2 } from 'lucide-react';
import type { RoutePlan } from '../types';

export function SavedRoutes({
  routes,
  onSelect,
  onDelete
}: {
  routes: RoutePlan[];
  onSelect: (route: RoutePlan) => void;
  onDelete: (route: RoutePlan) => void;
}) {
  return (
    <section className="panel saved-panel">
      <div className="panel-title">
        <span>Saved routes</span>
        <small>{routes.length}</small>
      </div>
      <div className="route-list">
        {routes.length === 0 && <p className="muted">Saved routes will appear here after you generate and save one.</p>}
        {routes.map((route) => (
          <article className="route-row" key={route.id}>
            <button type="button" onClick={() => onSelect(route)}>
              <strong>{route.name}</strong>
              <span>
                {route.startLocation} · {route.distanceKm.toFixed(1)} km · {route.activityType}
              </span>
            </button>
            <button className="icon-button danger" type="button" onClick={() => onDelete(route)} aria-label={`Delete ${route.name}`}>
              <Trash2 size={17} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
