import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  Users, 
  Package, 
  CheckCircle,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  // Define navigation links based on role
  const getNavLinks = () => {
    if (!user) return [];
    
    let baseLinks = [];

    switch (user.role) {
      case 'donor':
        baseLinks = [
          { to: '/donor', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
          { to: '/donor/create', icon: <PlusCircle size={20} />, label: 'Create Donation' }
        ];
        break;
      case 'volunteer':
        baseLinks = [
          { to: '/volunteer', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        ];
        break;
      case 'organization':
        baseLinks = [
          { to: '/organization', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        ];
        break;
      case 'admin':
        baseLinks = [
          { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview' },
          { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
          { to: '/admin/donations', icon: <Package size={20} />, label: 'Donations' },
          { to: '/admin/tasks', icon: <CheckCircle size={20} />, label: 'Tasks' }
        ];
        break;
      default:
        baseLinks = [];
    }
    
    return [
      ...baseLinks,
      { to: '/profile', icon: <UserCircle size={20} />, label: 'My Profile' }
    ];
  };

  const links = getNavLinks();

  return (
    <aside className="w-64 bg-brand-white border-r border-brand-sage/50 min-h-[calc(100vh-4rem)] hidden md:block shrink-0">
      <div className="p-6">
        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-4">
          Navigation
        </p>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/donor' || link.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-primary text-brand-white shadow-sm'
                    : 'text-brand-charcoal hover:bg-brand-sage/40 hover:text-brand-primary'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
