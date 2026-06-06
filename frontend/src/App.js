import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import MatchesPage from './pages/MatchesPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard'); // dashboard | customer | matches
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  if (page === 'customer' && selectedCustomerId) {
    return (
      <CustomerDetailPage
        customerId={selectedCustomerId}
        user={user}
        onBack={() => setPage('dashboard')}
        onViewMatches={(id) => {
          setSelectedCustomerId(id);
          setPage('matches');
        }}
      />
    );
  }

  if (page === 'matches' && selectedCustomerId) {
    return (
      <MatchesPage
        customerId={selectedCustomerId}
        user={user}
        onBack={() => {
          setPage('customer');
        }}
        onBackToDashboard={() => setPage('dashboard')}
      />
    );
  }

  return (
    <DashboardPage
      user={user}
      onLogout={() => setUser(null)}
      onSelectCustomer={(id) => {
        setSelectedCustomerId(id);
        setPage('customer');
      }}
    />
  );
}
