import React, { useState, useEffect } from 'react';
import { Truck, Navigation, CheckCircle, Clock } from 'lucide-react';
import DonationCard from '../components/DonationCard';
import { useAuth } from '../contexts/AuthContext';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [availableDonations, setAvailableDonations] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.firebase_uid && !user?.id) return;
    const uid = user.firebase_uid || user.uid || user.id;
    
    try {
      const [availableRes, activeRes, historyRes] = await Promise.all([
        fetch('/api/donations'),
        fetch(`/api/donations/collector/${uid}/active`),
        fetch(`/api/donations/collector/${uid}/history`)
      ]);
      
      const availableData = await availableRes.json();
      const activeData = await activeRes.json();
      const historyData = await historyRes.json();
      
      if (Array.isArray(availableData)) setAvailableDonations(availableData);
      if (Array.isArray(activeData)) setActiveTasks(activeData);
      if (Array.isArray(historyData)) setHistory(historyData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleBook = async (id) => {
    try {
      const uid = user?.firebase_uid || user?.uid || user?.id;
      const res = await fetch(`/api/donations/${id}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseUid: uid })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error booking donation:', err);
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await fetch(`/api/donations/${id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error completing donation:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-charcoal">Volunteer Dashboard</h1>
        <p className="text-brand-muted">Find and manage food rescue deliveries.</p>
      </div>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <section className="bg-brand-amber/10 rounded-xl border border-brand-amber/30 p-6">
          <h2 className="text-xl font-bold text-brand-charcoal mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-brand-amber" /> Active Booked Deliveries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTasks.map((donation) => (
              <DonationCard 
                key={donation.id} 
                donation={{
                  ...donation,
                  foodName: donation.foodName || donation.food_name,
                  pickupLocation: donation.pickupLocation || donation.pickup_location,
                  pickupDeadline: donation.pickupDeadline || donation.pickup_deadline,
                }} 
                actionButton={
                  <button 
                    onClick={() => handleComplete(donation.id)}
                    className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-brand-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark as Collected
                  </button>
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Available Donations */}
      <section>
        <h2 className="text-xl font-bold text-brand-charcoal mb-4">Available Pickups Nearby</h2>
        {loading ? (
          <p className="text-brand-muted">Loading available donations...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableDonations.map((donation) => {
              // Mock distance for presentation MVP
              const mockDistance = (Math.random() * 4 + 1).toFixed(1);
              
              return (
              <DonationCard 
                key={donation.id} 
                donation={{
                  ...donation,
                  foodName: donation.foodName || donation.food_name,
                  pickupLocation: donation.pickupLocation || donation.pickup_location,
                  pickupDeadline: donation.pickupDeadline || donation.pickup_deadline,
                }} 
                actionButton={
                  <div className="space-y-2">
                    <p className="text-xs text-brand-muted text-center flex justify-center items-center gap-1"><Truck className="w-3 h-3"/> ~{mockDistance} km away</p>
                    <button 
                      onClick={() => handleBook(donation.id)}
                      className="w-full py-2.5 bg-brand-charcoal hover:bg-black text-brand-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 shadow-sm"
                    >
                      <Navigation className="w-4 h-4" /> Book Pickup
                    </button>
                  </div>
                }
              />
            )})}
            {availableDonations.length === 0 && (
              <div className="col-span-full py-12 text-center text-brand-muted bg-brand-white rounded-xl border border-brand-sage/50">
                No available donations in your area at the moment. Check back later!
              </div>
            )}
          </div>
        )}
      </section>

      {/* History */}
      <section>
        <h2 className="text-xl font-bold text-brand-charcoal mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-primary" /> Collection History
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
                    <th className="py-3 px-4 font-semibold text-sm">Food Collected</th>
                    <th className="py-3 px-4 font-semibold text-sm">Donor / Cafe</th>
                    <th className="py-3 px-4 font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-sage/30">
                  {history.length > 0 ? history.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-cream/20 transition-colors">
                      <td className="py-3 px-4 text-sm text-brand-muted">{new Date(item.createdAt).toLocaleDateString('en-GB')}</td>
                      <td className="py-3 px-4 text-sm font-medium text-brand-charcoal">{item.foodName}</td>
                      <td className="py-3 px-4 text-sm text-brand-charcoal">{item.donorName || 'Unknown Donor'}</td>
                      <td className="py-3 px-4 text-sm"><span className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full">Collected</span></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-brand-muted">You haven't collected any donations yet.</td>
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
