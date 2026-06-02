import { Activity, LogOut, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RouteForm } from '../components/RouteForm';
import { RouteMap } from '../components/RouteMap';
import { RouteStats } from '../components/RouteStats';
import { SavedRoutes } from '../components/SavedRoutes';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../hooks/useAuth';
import { deleteRoute, fetchDashboard, listRoutes, saveRoute } from '../services/api';
import type { RoutePlan } from '../types';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<RoutePlan | null>(null);
  const [savedRoutes, setSavedRoutes] = useState<RoutePlan[]>([]);
  const [totalKilometers, setTotalKilometers] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function refresh() {
    const [dashboard, routes] = await Promise.all([fetchDashboard(), listRoutes()]);
    setSavedRoutes(routes.routes);
    setTotalKilometers(dashboard.totalKilometers);
  }

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  async function handleSave() {
    if (!currentRoute) return;
    setSaving(true);
    setMessage('');
    try {
      const response = await saveRoute(currentRoute);
      setCurrentRoute(response.route);
      await refresh();
      setMessage('Route saved.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not save route.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(route: RoutePlan) {
    if (!route.id) return;
    await deleteRoute(route.id);
    if (currentRoute?.id === route.id) setCurrentRoute(null);
    await refresh();
  }

  return (
    <main className="app-shell">
      <nav className="topbar">
        <div className="brand">
          <Activity />
          <span>RunMap</span>
        </div>
        <div className="top-actions">
          <ThemeToggle />
          <button className="ghost-button" type="button" onClick={logout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </nav>

      <section className="dashboard-head">
        <div>
          <p>{user?.name}</p>
          <h1>Route planner</h1>
        </div>
        <div className="summary-strip">
          <span>
            <strong>{savedRoutes.length}</strong>
            Saved
          </span>
          <span>
            <strong>{totalKilometers.toFixed(1)}</strong>
            Total km
          </span>
          <span>
            <strong>{currentRoute ? currentRoute.distanceKm.toFixed(1) : '0.0'}</strong>
            Active km
          </span>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="left-rail">
          <RouteForm
            onGenerated={(route) => {
              setCurrentRoute(route);
              setMessage('');
            }}
          />
          <RouteStats route={currentRoute} />
          <button className="primary save-button" type="button" onClick={handleSave} disabled={!currentRoute || saving}>
            <Save size={17} />
            {saving ? 'Saving...' : 'Save route'}
          </button>
          {message && <p className="muted">{message}</p>}
        </div>

        <section className="map-panel">
          <RouteMap route={currentRoute} />
        </section>

        <SavedRoutes routes={savedRoutes} onSelect={setCurrentRoute} onDelete={handleDelete} />
      </section>
    </main>
  );
}
