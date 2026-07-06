import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import LeadList from '../pages/LeadList/LeadList';
import LeadDetails from '../pages/LeadDetails/LeadDetails';
import EditLead from '../pages/EditLead/EditLead';

// Simple Auth Guard
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter basename="/klickedu">
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<LeadList />} />
          <Route path="leads/new" element={<EditLead />} />
          <Route path="leads/:id" element={<LeadDetails />} />
          <Route path="leads/edit/:id" element={<EditLead />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
