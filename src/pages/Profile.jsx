import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (!user) {
    return null;
    // The protected route will handle the redirect
  }

  // Format the role for display
  const roleDisplay = {
    donor: 'Food Donor',
    volunteer: 'Volunteer',
    organization: 'Animal Welfare Organization',
    admin: 'Administrator'
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-brand-white rounded-2xl shadow-sm border border-brand-sage/50 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-brand-primary/10 px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-primary text-brand-white rounded-full mb-4 text-3xl font-bold shadow-md">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h1 className="text-2xl font-bold text-brand-charcoal">{user.name || 'User Name'}</h1>
          <p className="text-brand-primary font-medium mt-1">{roleDisplay[user.role] || user.role}</p>
        </div>

        {/* Details Section */}
        <div className="p-8">
          <h2 className="text-lg font-bold text-brand-charcoal mb-6 border-b border-brand-sage pb-2">Account Details</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-cream rounded-lg text-brand-primary mt-0.5">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-muted">Full Name</p>
                <p className="text-brand-charcoal font-medium mt-1">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-cream rounded-lg text-brand-primary mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-muted">Email Address</p>
                <p className="text-brand-charcoal font-medium mt-1">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-cream rounded-lg text-brand-primary mt-0.5">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-muted">Account Role</p>
                <p className="text-brand-charcoal font-medium mt-1 capitalize">{user.role}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-cream rounded-lg text-brand-primary mt-0.5">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-muted">Account Status</p>
                <p className="text-brand-charcoal font-medium mt-1">Active</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-brand-sage">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3 bg-brand-red/10 text-brand-red hover:bg-brand-red/20 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
