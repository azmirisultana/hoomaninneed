import React from 'react';
import StatusBadge from '../components/StatusBadge';

export default function AdminDonations() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">All Donations</h1>
          <p className="text-brand-muted">System-wide view of all food donations.</p>
        </div>
      </div>

      <div className="bg-brand-white rounded-xl shadow-sm border border-brand-sage/50 overflow-hidden text-center py-20 text-brand-muted">
        <p>A data table displaying all donations would render here.</p>
        <p className="text-sm mt-2">Structure mirrors the Users table, mapping the Donation model.</p>
      </div>
    </div>
  );
}
