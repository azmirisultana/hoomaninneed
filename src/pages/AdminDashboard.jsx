import React from 'react';
import { Users, Building, Heart, Package, CheckCircle, Clock } from 'lucide-react';
import StatsCard from '../components/StatsCard';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-charcoal">Admin Dashboard</h1>
        <p className="text-brand-muted">Platform overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Users" value="532" icon={<Users className="w-5 h-5" />} />
        <StatsCard title="Donors" value="156" icon={<Building className="w-5 h-5" />} />
        <StatsCard title="Volunteers" value="321" icon={<Heart className="w-5 h-5" />} />
        <StatsCard title="Organizations" value="55" icon={<Users className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <StatsCard title="Total Donations" value="2,405" icon={<Package className="w-5 h-5" />} />
        <StatsCard title="Active Donations" value="18" icon={<Clock className="w-5 h-5 text-brand-amber" />} />
        <StatsCard title="Completed" value="2,342" icon={<CheckCircle className="w-5 h-5 text-brand-primary" />} />
      </div>

      <div className="bg-brand-white rounded-xl border border-brand-sage/50 p-6 mt-8">
        <h2 className="text-xl font-bold text-brand-charcoal mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-brand-sage/30 last:border-0">
              <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
              <p className="text-sm text-brand-charcoal flex-1">
                <span className="font-semibold">City Bakery</span> posted a new donation: 15 lbs Pastries
              </p>
              <span className="text-xs text-brand-muted">{i * 15} mins ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
