import { Footprints, MapPinned, Mountain, Route, RotateCcw, Send } from 'lucide-react';
import { useState } from 'react';
import type { ActivityType, RoutePlan, RouteType } from '../types';
import { generateRoute } from '../services/api';

const activities: Array<{ value: ActivityType; label: string; icon: React.ReactNode }> = [
  { value: 'running', label: 'Running', icon: <Route size={17} /> },
  { value: 'walking', label: 'Walking', icon: <Footprints size={17} /> },
  { value: 'hiking', label: 'Hiking', icon: <Mountain size={17} /> }
];

const routeTypes: Array<{ value: RouteType; label: string; icon: React.ReactNode }> = [
  { value: 'circular', label: 'Circular', icon: <RotateCcw size={17} /> },
  { value: 'one-way', label: 'One-way', icon: <Send size={17} /> },
  { value: 'out-and-back', label: 'Out/back', icon: <MapPinned size={17} /> }
];

export function RouteForm({ onGenerated }: { onGenerated: (route: RoutePlan) => void }) {
  const [startLocation, setStartLocation] = useState('40.7128, -74.0060');
  const [distanceKm, setDistanceKm] = useState(8);
  const [activityType, setActivityType] = useState<ActivityType>('running');
  const [routeType, setRouteType] = useState<RouteType>('circular');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await generateRoute({ startLocation, distanceKm, activityType, routeType });
      onGenerated(response.route);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate route.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="panel route-form" onSubmit={handleSubmit}>
      <div className="panel-title">
        <span>Plan a route</span>
        <small>1-50 km</small>
      </div>

      <label>
        <span>Start location</span>
        <input value={startLocation} onChange={(event) => setStartLocation(event.target.value)} placeholder="City, address, or lat,lng" />
      </label>

      <label>
        <span>Distance: {distanceKm} km</span>
        <input min={1} max={50} type="range" value={distanceKm} onChange={(event) => setDistanceKm(Number(event.target.value))} />
      </label>

      <div className="control-group">
        <span>Activity</span>
        <div className="segmented">
          {activities.map((activity) => (
            <button
              type="button"
              className={activityType === activity.value ? 'active' : ''}
              onClick={() => setActivityType(activity.value)}
              key={activity.value}
            >
              {activity.icon}
              {activity.label}
            </button>
          ))}
        </div>
      </div>

      <div className="control-group">
        <span>Route type</span>
        <div className="segmented">
          {routeTypes.map((type) => (
            <button type="button" className={routeType === type.value ? 'active' : ''} onClick={() => setRouteType(type.value)} key={type.value}>
              {type.icon}
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      <button className="primary" type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate route'}
      </button>
    </form>
  );
}
