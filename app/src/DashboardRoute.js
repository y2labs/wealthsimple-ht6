import React from 'react';
import AuthenticatedRoute from 'AuthenticatedRoute';
import Sidebar from 'Sidebar';
import Header from 'Header';
import PetDisplay from 'PetDisplay';

const DashboardPage = () => (
  <div className="dashboard--container">
    <div className="dashboard--sidebar-container">
      <Sidebar />
    </div>

    <div className="dashboard--scroll-container">
      <PetDisplay />
    </div>
  </div>
);

const DashboardRoute = () => (
  <AuthenticatedRoute>
    <Header />
    <DashboardPage />
  </AuthenticatedRoute>
);

export default DashboardRoute;
