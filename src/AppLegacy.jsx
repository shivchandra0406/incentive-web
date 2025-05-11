import React, { useState } from 'react';
import './App.css';
import IncentiveRulesList from './pages/incentiveRules/IncentiveRulesList';

function AppLegacy() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  // Sample data for the deals table
  const dealData = [
    { id: 1, name: "Acme Corp Partnership", status: "Active", value: 250000 },
    { id: 2, name: "TechGiant Software License", status: "Active", value: 180000 },
    { id: 3, name: "GlobalRetail POS System", status: "Closed", value: 320000 },
    { id: 4, name: "HealthCare Solutions", status: "Active", value: 450000 },
    { id: 5, name: "EduTech Learning Platform", status: "Closed", value: 275000 },
    { id: 6, name: "FinServe Banking Module", status: "Active", value: 520000 },
    { id: 7, name: "AutoMotive Dealership", status: "Closed", value: 380000 },
    { id: 8, name: "SmartCity Infrastructure", status: "Active", value: 620000 },
    { id: 9, name: "FoodChain Supply Management", status: "Closed", value: 190000 },
    { id: 10, name: "MediaStream Content Delivery", status: "Active", value: 310000 }
  ];

  // Login Page
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-form">
          <h1>Mr. Munim</h1>
          <h3>Login to your account</h3>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard and other modules
  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Mr. Munim</h3>
        </div>
        <ul className="sidebar-menu">
          <li
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </li>
          <li
            className={activeTab === 'incentive-rules' ? 'active' : ''}
            onClick={() => setActiveTab('incentive-rules')}
          >
            📜 Incentive Rules
          </li>
          <li
            className={activeTab === 'deals' ? 'active' : ''}
            onClick={() => setActiveTab('deals')}
          >
            💼 Deals
          </li>
          <li
            className={activeTab === 'payouts' ? 'active' : ''}
            onClick={() => setActiveTab('payouts')}
          >
            💰 Payouts
          </li>
          <li
            className={activeTab === 'workflow' ? 'active' : ''}
            onClick={() => setActiveTab('workflow')}
          >
            🔄 Workflow
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}</h2>
          <div className="user-info">
            <span className="user-email">{email}</span>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            {/* Top Summary Cards */}
            <h3 className="section-title">Overview</h3>
            <div className="summary-cards">
              <div className="card">
                <div className="card-icon blue">📊</div>
                <div className="card-content">
                  <div className="card-title">Total Deals</div>
                  <div className="card-value">87</div>
                </div>
              </div>
              <div className="card">
                <div className="card-icon green">🟢</div>
                <div className="card-content">
                  <div className="card-title">Active Deals</div>
                  <div className="card-value">45</div>
                </div>
              </div>
              <div className="card">
                <div className="card-icon gray">✅</div>
                <div className="card-content">
                  <div className="card-title">Closed Deals</div>
                  <div className="card-value">42</div>
                </div>
              </div>
            </div>

            {/* Performance Section */}
            <h3 className="section-title">Performance</h3>
            <div className="performance-cards">
              <div className="performance-card blue-gradient">
                <div className="performance-icon">💰</div>
                <div className="performance-title">Incentive Amount</div>
                <div className="performance-value">₹20,000</div>
                <div className="performance-badge">10% of target achieved</div>
              </div>
              <div className="performance-card purple-gradient">
                <div className="performance-icon">🏆</div>
                <div className="performance-title">Target Amount</div>
                <div className="performance-value">₹2,00,000</div>
                <div className="performance-badge">Quarterly target</div>
              </div>
            </div>

            {/* Deals Table */}
            <h3 className="section-title">Top 10 Deals</h3>
            <div className="deals-table-container">
              <table className="deals-table">
                <thead>
                  <tr>
                    <th>Deal Name</th>
                    <th>Status</th>
                    <th>Value (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {dealData.map((deal, index) => (
                    <tr key={deal.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                      <td>{deal.name}</td>
                      <td>
                        <span className={`status-badge ${deal.status === 'Active' ? 'active' : 'closed'}`}>
                          {deal.status}
                        </span>
                      </td>
                      <td className="value-cell">{deal.value.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Incentive Rules Content */}
        {activeTab === 'incentive-rules' && (
          <IncentiveRulesList />
        )}

        {/* Deals Content */}
        {activeTab === 'deals' && (
          <div className="module-content">
            <h3>Deals Module</h3>
            <p>This is where you can manage your deals.</p>
          </div>
        )}

        {/* Payouts Content */}
        {activeTab === 'payouts' && (
          <div className="module-content">
            <h3>Payouts Module</h3>
            <p>This is where you can manage your payouts.</p>
          </div>
        )}

        {/* Workflow Content */}
        {activeTab === 'workflow' && (
          <div className="module-content">
            <h3>Workflow Module</h3>
            <p>This is where you can manage your workflows.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppLegacy;
