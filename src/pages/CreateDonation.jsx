import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = ['Bakery', 'Prepared Meals', 'Produce', 'Dairy', 'Meat', 'Other'];
const UNITS = ['kg', 'lbs', 'portions', 'pieces', 'liters'];
const ALLERGEN_OPTIONS = ['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Shellfish', 'None'];

export default function CreateDonation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    foodName: '',
    category: 'Prepared Meals',
    description: '',
    quantity: '',
    unit: 'portions',
    ingredients: '',
    allergens: [] ,
    prepDate: '',
    availableFrom: '',
    pickupDeadline: '',
    pickupLocation: '',
    safetyNotes: ''
  });

  const handleAllergenToggle = (allergen) => {
    if (allergen === 'None') {
      setFormData({ ...formData, allergens: ['None'] });
      return;
    }
    
    let newAllergens = [...formData.allergens].filter(a => a !== 'None');
    if (newAllergens.includes(allergen)) {
      newAllergens = newAllergens.filter(a => a !== allergen);
    } else {
      newAllergens.push(allergen);
    }
    setFormData({ ...formData, allergens: newAllergens });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user?.firebase_uid || user?.uid || user?.id,
          ...formData
        })
      });
      if (response.ok) {
        navigate('/donor');
      } else {
        const errData = await response.json();
        setSubmitError(errData.error || 'Failed to submit donation');
        console.error('Failed to submit donation', errData);
      }
    } catch (err) {
      setSubmitError('Network error submitting donation.');
      console.error('Network error submitting donation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-charcoal">Post a Donation</h1>
        <p className="text-brand-muted">Provide details about the surplus food available for pickup.</p>
      </div>

      <div className="bg-brand-white p-6 md:p-8 rounded-xl shadow-sm border border-brand-sage/50">
        {submitError && (
          <div className="mb-6 p-4 bg-brand-red/10 border border-brand-red/30 text-brand-red rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-medium">{submitError}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold border-b border-brand-sage pb-2">1. Food Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Food Name *</label>
              <input required type="text" name="foodName" value={formData.foodName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary outline-none" placeholder="e.g. 20 Boxed Sandwiches" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary outline-none bg-brand-white">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Quantity *</label>
                  <input required type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Unit</label>
                  <select name="unit" value={formData.unit} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary outline-none bg-brand-white">
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Description & Ingredients</label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary outline-none resize-none" placeholder="Brief description of the food and main ingredients..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-brand-amber" /> Allergens
              </label>
              <div className="flex flex-wrap gap-2">
                {ALLERGEN_OPTIONS.map(allergen => (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => handleAllergenToggle(allergen)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      formData.allergens.includes(allergen)
                        ? 'bg-brand-amber text-brand-charcoal border-brand-amber font-medium'
                        : 'bg-brand-white text-brand-muted border-brand-sage hover:border-brand-amber'
                    }`}
                  >
                    {allergen}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: Logistics */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold border-b border-brand-sage pb-2">2. Pickup Logistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5 flex items-center gap-1"><Clock className="w-4 h-4" /> Available From</label>
                <input type="datetime-local" name="availableFrom" value={formData.availableFrom} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary outline-none" />
              </div>
              <div className="p-2 bg-brand-red/5 border border-brand-red/20 rounded-lg">
                <label className="block text-sm font-bold text-brand-red mb-1.5 flex items-center gap-1"><Clock className="w-4 h-4" /> Pickup Deadline (CRITICAL) *</label>
                <input required type="datetime-local" name="pickupDeadline" value={formData.pickupDeadline} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-brand-red/30 focus:ring-2 focus:ring-brand-red outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5 flex items-center gap-1"><MapPin className="w-4 h-4" /> Pickup Location (Address) *</label>
              <input required type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary outline-none" placeholder="123 Main St, Back Alley Door" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Safety / Packaging Notes</label>
              <textarea name="safetyNotes" rows={2} value={formData.safetyNotes} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-brand-sage focus:ring-2 focus:ring-brand-primary outline-none resize-none" placeholder="Requires refrigeration, packed in cardboard boxes..." />
            </div>
          </section>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/donor')} className="px-6 py-2.5 text-brand-muted hover:bg-brand-sage/30 font-medium rounded-lg transition-colors">
              Cancel
            </button>
            <button disabled={isSubmitting} type="submit" className="px-8 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-brand-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
              <Send className="w-4 h-4" /> {isSubmitting ? 'Posting...' : 'Post Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
