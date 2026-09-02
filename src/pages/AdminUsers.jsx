import React from 'react';

const MOCK_USERS = [
  { id: '1', name: 'City Bakery', email: 'hello@citybakery.com', role: 'donor', status: 'Active' },
  { id: '2', name: 'Alex Johnson', email: 'alex@example.com', role: 'volunteer', status: 'Active' },
  { id: '3', name: 'Happy Paws Shelter', email: 'contact@happypaws.org', role: 'organization', status: 'Active' },
  { id: '4', name: 'Downtown Deli', email: 'info@downtowndeli.com', role: 'donor', status: 'Inactive' },
  { id: '5', name: 'Maria Garcia', email: 'maria@example.com', role: 'volunteer', status: 'Active' },
];

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Manage Users</h1>
          <p className="text-brand-muted">View and manage all registered users.</p>
        </div>
        <button className="bg-brand-primary text-brand-white px-4 py-2 rounded-lg font-medium text-sm">
          Export CSV
        </button>
      </div>

      <div className="bg-brand-white rounded-xl shadow-sm border border-brand-sage/50 overflow-hidden">
        <div className="p-4 border-b border-brand-sage/30 bg-gray-50 flex gap-4">
          <select className="px-3 py-1.5 border border-brand-sage rounded-md text-sm outline-none focus:ring-1 focus:ring-brand-primary">
            <option>All Roles</option>
            <option>Donor</option>
            <option>Volunteer</option>
            <option>Organization</option>
          </select>
          <input type="text" placeholder="Search users..." className="px-3 py-1.5 border border-brand-sage rounded-md text-sm outline-none focus:ring-1 focus:ring-brand-primary flex-1 max-w-sm" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-brand-charcoal">
            <thead className="bg-brand-cream/50 text-brand-muted font-medium border-b border-brand-sage/50">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="border-b border-brand-sage/20 hover:bg-brand-cream/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-brand-muted">{user.email}</td>
                  <td className="px-6 py-4 capitalize">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-brand-sage/50 text-brand-primary-dark' : 'bg-gray-100 text-gray-500'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-brand-primary hover:underline text-xs font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
