import React from 'react';

// Possible donation status values




/**
 * StatusBadge component displays the current status of a donation
 * with appropriate color coding.
 */
export default function StatusBadge({ status }) {
  // Determine colors based on status
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  
  const normalizedStatus = (status || '').toUpperCase();

  switch (normalizedStatus) {
    case 'AVAILABLE':
      bgColor = 'bg-brand-sage';
      textColor = 'text-brand-primary-dark';
      break;
    case 'ACCEPTED':
    case 'PICKED_UP':
    case 'IN_TRANSIT':
      bgColor = 'bg-brand-amber/20'; // Using opacity for softer background
      textColor = 'text-brand-amber';
      break;
    case 'DELIVERED':
    case 'COMPLETED':
      bgColor = 'bg-brand-primary/10';
      textColor = 'text-brand-primary';
      break;
    case 'EXPIRED':
    case 'CANCELLED':
      bgColor = 'bg-brand-red/10';
      textColor = 'text-brand-red';
      break;
  }

  // Format text (e.g., IN_TRANSIT -> In Transit)
  let formattedText = normalizedStatus.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  if (normalizedStatus === 'ACCEPTED') {
    formattedText = 'Booked';
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor} border border-transparent`}>
      {formattedText}
    </span>
  );
}
