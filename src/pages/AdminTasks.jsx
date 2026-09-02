import React from 'react';

export default function AdminTasks() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Delivery Tasks</h1>
          <p className="text-brand-muted">Monitor volunteer assignments and transit status.</p>
        </div>
      </div>

      <div className="bg-brand-white rounded-xl shadow-sm border border-brand-sage/50 overflow-hidden text-center py-20 text-brand-muted">
        <p>A data table displaying active/completed tasks would render here.</p>
      </div>
    </div>
  );
}
