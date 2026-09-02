import React from 'react';



/**
 * A reusable card for displaying dashboard statistics
 */
export default function StatsCard({ title, value, icon, description }) {
  return (
    <div className="bg-brand-white p-6 rounded-xl shadow-sm border border-brand-sage/50 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-brand-muted font-medium text-sm uppercase tracking-wider">{title}</h3>
        <div className="p-2 bg-brand-sage/30 text-brand-primary rounded-lg">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-brand-charcoal">{value}</span>
      </div>
      {description && (
        <p className="text-sm text-brand-muted mt-2">{description}</p>
      )}
    </div>
  );
}
