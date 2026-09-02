import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'donor': return '/donor';
      case 'volunteer': return '/volunteer';
      case 'organization': return '/organization';
      case 'admin': return '/admin';
      default: return '/';
    }
  };

  return (
    <nav className="bg-brand-primary text-brand-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <div className="p-1.5 bg-brand-white rounded-lg">
              <Heart className="w-6 h-6 text-brand-primary fill-brand-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">HoomanInNeed</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-brand-sage hover:text-brand-white font-medium transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="bg-brand-amber hover:bg-brand-amber/90 text-brand-charcoal font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} className="text-brand-sage hover:text-brand-white font-medium transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-brand-primary-dark">
                  <Link to="/profile" className="flex items-center gap-2 hover:bg-brand-primary-dark p-2 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-brand-primary-dark flex items-center justify-center">
                      <User className="w-4 h-4 text-brand-sage" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold leading-none">{user?.name}</span>
                      <span className="text-xs text-brand-sage capitalize">{user?.role}</span>
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-brand-sage hover:text-brand-red hover:bg-brand-primary-dark rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-brand-white hover:text-brand-sage focus:outline-none p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-primary-dark shadow-inner border-t border-brand-primary">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-3 rounded-md text-base font-medium text-brand-sage hover:text-brand-white hover:bg-brand-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-3 rounded-md text-base font-medium bg-brand-amber text-brand-charcoal hover:bg-brand-amber/90 mt-2 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="px-3 py-3 border-b border-brand-primary mb-2 flex items-center gap-3 hover:bg-brand-primary rounded-md" onClick={() => setIsMenuOpen(false)}>
                   <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                      <User className="w-5 h-5 text-brand-sage" />
                    </div>
                    <div>
                      <div className="font-medium text-brand-white">{user?.name}</div>
                      <div className="text-sm text-brand-sage capitalize">{user?.role}</div>
                    </div>
                </Link>
                <Link 
                  to={getDashboardLink()} 
                  className="block px-3 py-2 rounded-md text-base font-medium text-brand-white hover:bg-brand-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-brand-red hover:bg-brand-primary mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
