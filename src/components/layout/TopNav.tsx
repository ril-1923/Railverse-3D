import { NavLink } from 'react-router-dom';
import { Train, Map as MapIcon, Building2, Wrench, Settings as SettingsIcon } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Overview', icon: Train, end: true },
  { to: '/network', label: 'Network', icon: MapIcon },
  { to: '/stations', label: 'Stations', icon: Building2 },
  { to: '/infrastructure', label: 'Infrastructure', icon: Wrench },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function TopNav() {
  return (
    <header className="rv-topnav">
      <div className="rv-topnav-brand">
        <Train size={22} className="rv-brand-icon" />
        <span className="rv-brand-name">RailVerse</span>
        <span className="rv-brand-suffix">3D</span>
      </div>
      <nav className="rv-topnav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `rv-nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
