import React from 'react';
import { MapPin, Clock, AlertTriangle, Package, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';





/**
 * Displays a donation's details in a clean card format.
 * Can include custom action buttons passed as props.
 */
export default function DonationCard({ donation, actionButton }) {
  // Format dates for display
  const deadlineDate = new Date(donation.pickupDeadline);
  const isExpiringSoon = deadlineDate.getTime() - new Date().getTime() < 1000 * 60 * 60 * 2; // Less than 2 hours

  return (
    <div className="bg-brand-white rounded-xl shadow-sm border border-brand-sage/50 overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      {/* Header section */}
      <div className="p-5 border-b border-brand-sage/30 flex justify-between items-start bg-brand-cream/30">
        <div>
          <h3 className="font-bold text-lg text-brand-charcoal mb-1">{donation.foodName}</h3>
          <p className="text-sm text-brand-muted font-medium">{donation.donorName}</p>
        </div>
        <StatusBadge status={donation.status} />
      </div>

      {/* Details section */}
      <div className="p-5 flex-grow space-y-4">
        
        {/* Quantity & Category */}
        <div className="flex items-center gap-2 text-sm text-brand-charcoal">
          <Package className="w-4 h-4 text-brand-primary" />
          <span className="font-medium">{donation.quantity} {donation.unit}</span>
          <span className="text-brand-sage mx-1">•</span>
          <span className="text-brand-muted">{donation.category}</span>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm text-brand-charcoal">
          <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
          <span className="leading-tight">{donation.pickupLocation}</span>
        </div>

        {/* Deadline - highlighted if expiring soon */}
        <div className={`flex items-center gap-2 text-sm ${isExpiringSoon && donation.status === 'AVAILABLE' ? 'text-brand-red font-medium' : 'text-brand-charcoal'}`}>
          <Clock className={`w-4 h-4 ${isExpiringSoon && donation.status === 'AVAILABLE' ? 'text-brand-red' : 'text-brand-primary'}`} />
          <span>Pick up by: {deadlineDate.toLocaleDateString('en-GB')} {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {/* Allergens warning */}
        {donation.allergens.length > 0 && !donation.allergens.includes('None') && (
          <div className="flex items-start gap-2 text-sm text-brand-amber bg-brand-amber/10 p-2.5 rounded-lg border border-brand-amber/20 mt-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Allergens</span>
              <span className="text-brand-charcoal">{donation.allergens.join(', ')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer/Action section */}
      {actionButton && (
        <div className="p-5 border-t border-brand-sage/30 bg-gray-50/50 mt-auto">
          {actionButton}
        </div>
      )}
    </div>
  );
}
