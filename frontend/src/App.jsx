import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import API_BASE from './config';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CustomerDetail from './components/CustomerDetail';
import MatchesView from './components/MatchesView';
import Analytics from './components/Analytics';
import Reports from './components/Reports';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('synora_user');
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  void API_BASE;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/:id/matches"
          element={
            <ProtectedRoute>
              <Layout>
                <MatchesView />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
