import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard';

const Dashboard = () => {
  const { userRole } = useAuth();

  if (userRole === 'admin') {
    return <AdminDashboard />;
  }

  return <EmployeeDashboard />;
};

export default Dashboard;