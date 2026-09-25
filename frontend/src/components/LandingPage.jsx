import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Animated Background Elements */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="navbar-brand">
          <svg className="brand-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
          </svg>
          <span className="brand-name">Synora</span>
        </div>
        <div className="navbar-actions">
          <button className="btn-ghost" onClick={() => navigate('/login')}>Agency Login</button>
          <button className="btn-primary" onClick={() => navigate('/login')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <div className="badge-pill">
            <span className="badge-dot"></span>
            The #1 CRM for Matchmaking Agencies
          </div>
          <h1 className="hero-title">
            Elevate your agency with
            <span className="text-gradient"> intelligent matchmaking.</span>
          </h1>
          <p className="hero-subtitle">
            Synora is an all-in-one platform built specifically for professional matchmakers. Manage your clients, discover smart pairings, and track your agency's success - all in one place.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary btn-large" onClick={() => navigate('/login')}>
              Enter Workspace
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Floating Hero Cards to showcase features/UI implicitly */}
        <div className="hero-visuals">
          <div className="glass-card visual-card-1 b2b-card">
            <div className="icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div className="card-info">
              <div className="card-name">Active Clients</div>
              <div className="card-stat">124</div>
            </div>
            <div className="trend-up">+12%</div>
          </div>
          <div className="glass-card visual-card-2 b2b-card">
            <div className="icon-badge accent-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <div className="card-info">
              <div className="card-name">Successful Matches</div>
              <div className="card-stat">89</div>
            </div>
            <div className="trend-up">+5%</div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          </div>
          <h3>Client Management</h3>
          <p>Organize comprehensive client profiles, preferences, and private notes in a secure, centralized database.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          <h3>AI-Assisted Pairings</h3>
          <p>Leverage our smart algorithm to surface potential matches based on deep compatibility metrics and past successes.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          </div>
          <h3>Agency Analytics</h3>
          <p>Track your agency's performance and monitor client match progression with real-time data insights.</p>
        </div>
      </section>

      {/* Info / How it Works Section */}
      <section className="info-section">
        <div className="info-content">
          <h2>Everything you need to run a successful agency</h2>
          <p>Stop juggling spreadsheets and disconnected tools. Synora brings your entire matchmaking workflow into one beautifully designed platform.</p>
          <ul className="info-list">
            <li>
              <div className="list-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
              <span>Automated match suggestions based on 50+ data points</span>
            </li>
            <li>
              <div className="list-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
              <span>Secure, private client portals and notes</span>
            </li>

          </ul>
        </div>
        <div className="info-visual">
          <div className="dashboard-mockup">
            <div className="mockup-header">
              <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-line w-full"></div>
                <div className="mockup-line w-half"></div>
                <div className="mockup-line w-full mt-auto"></div>
              </div>
              <div className="mockup-main">
                <div className="mockup-chart"></div>
                <div className="mockup-cards">
                  <div className="mockup-card"></div>
                  <div className="mockup-card"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="cta-section">
        <h2>Ready to transform your agency?</h2>
        <p>Join top matchmakers who are already using Synora to scale their business and make better connections.</p>
        <button className="btn-primary btn-large" onClick={() => navigate('/login')}>
          Get Started Today
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <svg className="brand-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
            </svg>
            <span>Synora</span>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Synora Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
