import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Plus, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import DonationCard from '../components/DonationCard';
import { useAuth } from '../contexts/AuthContext';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.firebase_uid || user?.id) {
      // Use whichever ID is available (firebase_uid from backend or id from firebase directly)
      const uid = user.firebase_uid || user.id;
      
      Promise.all([
        fetch(`/api/donations/donor/${uid}`).then(res => res.json()),
        fetch(`/api/donations/donor/${uid}/history`).then(res => res.json())
      ])
      .then(([donationsData, historyData]) => {
        if (Array.isArray(donationsData)) setDonations(donationsData);
        if (Array.isArray(historyData)) setHistory(historyData);
      })
      .catch(err => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCancelDonation = async (donationId) => {
    if (!window.confirm('Are you sure you want to cancel this donation?')) return;
    try {
      const response = await fetch(`/api/donations/${donationId}/cancel`, { method: 'PUT' });
      if (response.ok) {
        setDonations(donations.map(d => d.id === donationId ? { ...d, status: 'cancelled' } : d));
      } else {
        console.error('Failed to cancel donation');
      }
    } catch (err) {
      console.error('Error cancelling:', err);
    }
  };

  const activeDonationsCount = donations.filter(d => d.status === 'available' || d.status === 'accepted').length;
  const completedDonationsCount = donations.filter(d => d.status === 'completed').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Donor Dashboard</h1>
          <p className="text-brand-muted">Manage your food donations and impact</p>
        </div>
        <Link 
          to="/donor/create"
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-brand-white font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Donation
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Donations" 
          value={donations.length.toString()} 
          icon={<Package className="w-5 h-5" />} 
          description="Lifetime posts"
        />
        <StatsCard 
          title="Active Donations" 
          value={activeDonationsCount.toString()} 
          icon={<Clock className="w-5 h-5" />} 
          description="Awaiting pickup or transit"
        />
        <StatsCard 
          title="Completed" 
          value={completedDonationsCount.toString()} 
          icon={<CheckCircle className="w-5 h-5" />} 
          description="Successfully rescued"
        />
      </div>

      {/* Active Donations Section */}
      <section>
        <h2 className="text-xl font-bold text-brand-charcoal mb-4">Your Recent Donations</h2>
        
        {loading ? (
          <div className="text-center py-12 text-brand-muted">Loading your donations...</div>
        ) : donations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-brand-sage/30">
            <Package className="w-12 h-12 text-brand-muted mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-medium text-brand-charcoal mb-1">No donations yet</h3>
            <p className="text-brand-muted">When you create a food donation, it will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => {
              // Add expired status dynamically
              let displayStatus = donation.status;
              if (displayStatus === 'available' && new Date(donation.pickupDeadline) < new Date()) {
                displayStatus = 'expired';
              }
              
              return (
                <DonationCard 
                  key={donation.id} 
                  donation={{
                    ...donation,
                    status: displayStatus,
                    donorName: user?.name
                  }}
                  actionButton={
                    displayStatus === 'available' ? (
                      <button 
                        onClick={() => handleCancelDonation(donation.id)}
                        className="w-full py-2 bg-brand-white border border-brand-sage text-brand-charcoal font-medium rounded-lg hover:bg-brand-red/10 hover:text-brand-red hover:border-brand-red/30 transition-colors"
                      >
                        Cancel Donation
                      </button>
                    ) : displayStatus === 'accepted' ? (
                      <div className="w-full py-2 bg-brand-amber/10 border border-brand-amber/30 text-brand-amber font-medium rounded-lg text-center">
                        Booked by {donation.collectorName || 'Volunteer'}
                      </div>
                    ) : (
                      <button className="w-full py-2 bg-brand-sage/50 text-brand-muted font-medium rounded-lg cursor-not-allowed" disabled>
                        Cannot Modify
                      </button>
                    )
                  }
                />
              );
            })}
          </div>
        )}
      </section>

      {/* History Section */}
      <section>
        <h2 className="text-xl font-bold text-brand-charcoal mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-brand-primary" /> Delivery History
        </h2>
        {loading ? (
          <p className="text-brand-muted">Loading history...</p>
        ) : (
          <div className="bg-brand-white rounded-xl shadow-sm border border-brand-sage overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-cream/50 text-brand-charcoal border-b border-brand-sage">
                    <th className="py-3 px-4 font-semibold text-sm">Date</th>
                    <th className="py-3 px-4 font-semibold text-sm">Food Donated</th>
                    <th className="py-3 px-4 font-semibold text-sm">Collected By</th>
                    <th className="py-3 px-4 font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-sage/30">
                  {history.length > 0 ? history.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-cream/20 transition-colors">
                      <td className="py-3 px-4 text-sm text-brand-muted">{new Date(item.createdAt).toLocaleDateString('en-GB')}</td>
                      <td className="py-3 px-4 text-sm font-medium text-brand-charcoal">{item.foodName}</td>
                      <td className="py-3 px-4 text-sm text-brand-charcoal">{item.collectorName || 'Unknown'}</td>
                      <td className="py-3 px-4 text-sm"><span className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full">Completed</span></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-brand-muted">No completed deliveries yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
