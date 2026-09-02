import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import DonorDashboard from './pages/DonorDashboard';
import CreateDonation from './pages/CreateDonation';
import VolunteerDashboard from './pages/VolunteerDashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminDonations from './pages/AdminDonations';
import AdminTasks from './pages/AdminTasks';
import Profile from './pages/Profile';

// Layout wrapper for authenticated pages (includes Sidebar)
const AppLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-brand-cream/50">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-brand-cream font-sans text-brand-charcoal">
          <Navbar />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes - Authenticated Layout */}
            <Route element={<AppLayout />}>
              
              {/* Donor Routes */}
              <Route path="/donor" element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <DonorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/donor/create" element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <CreateDonation />
                </ProtectedRoute>
              } />

              {/* Volunteer Routes */}
              <Route path="/volunteer" element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <VolunteerDashboard />
                </ProtectedRoute>
              } />

              {/* Organization Routes */}
              <Route path="/organization" element={
                <ProtectedRoute allowedRoles={['organization']}>
                  <OrganizationDashboard />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/donations" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDonations />
                </ProtectedRoute>
              } />
              <Route path="/admin/tasks" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminTasks />
                </ProtectedRoute>
              } />

              {/* Profile Route - accessible by any authenticated user */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
