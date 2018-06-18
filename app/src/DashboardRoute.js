import React from 'react';
import AuthenticatedRoute from 'AuthenticatedRoute';
import Sidebar from 'Sidebar';
import Header from 'Header';
import PetDisplay from 'PetDisplay';
import Inventory from 'Inventory';
import MarketPlace from 'Marketplace';

const DashboardPage = () => (
  <div className="dashboard--container">
    <div className="dashboard--sidebar-container">
      <Sidebar />
    </div>

    <div className="dashboard--scroll-container">
      <div className="dashboard--scroll-scrollable">
        <PetDisplay />

        <div className="dashboard--scroll-section">
          <p className="h3-sans dashboard--scroll-title">Inventory</p>
          <p className="number-title">
            Items you've purchased with deposits are found here.
          </p>

          <Inventory />
        </div>

        <div className="dashboard--scroll-section">
          <p className="h3-sans dashboard--scroll-title">Marketplace</p>
          <p className="number-title">
            Items you can purchase with deposits are found here.
          </p>

          <MarketPlace />
        </div>
      </div>
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
