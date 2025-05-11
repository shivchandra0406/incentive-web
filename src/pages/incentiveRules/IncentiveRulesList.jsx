import React, { useState, useEffect, useRef } from 'react';
import { incentiveRulesService } from '../../services/api';

const IncentiveRulesList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rules, setRules] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);

  const menuButtonRef = useRef(null);

  const fetchRules = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using the GET /api/incentives/rules endpoint
      const response = await incentiveRulesService.getAll(page + 1, rowsPerPage);
      if (response.success) {
        setRules(response.data.items);
        setTotalCount(response.data.totalCount);
      } else {
        setError('Failed to fetch incentive rules');
      }
    } catch (err) {
      setError('An error occurred while fetching incentive rules');
      console.error('Error fetching incentive rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, [page, rowsPerPage]);

  const handleCreateRule = (type) => {
    setCreateMenuOpen(false);
    alert(`Create ${type}-based Rule clicked`);
  };

  const handleViewRule = (id) => {
    alert(`View Rule ${id} clicked`);
  };

  const handleEditRule = (id) => {
    alert(`Edit Rule ${id} clicked`);
  };

  const handleDeleteClick = (id) => {
    setRuleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (ruleToDelete) {
      try {
        // Using the DELETE /api/incentives/rules/{id} endpoint
        const response = await incentiveRulesService.delete(ruleToDelete);
        if (response.success) {
          fetchRules();
          setDeleteDialogOpen(false);
          setRuleToDelete(null);
        } else {
          setError('Failed to delete incentive rule');
        }
      } catch (err) {
        setError('An error occurred while deleting the incentive rule');
        console.error('Error deleting incentive rule:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="incentive-rules-container">
      <div className="header-section">
        <h2>Incentive Rules</h2>
        <div className="create-rule-dropdown">
          <button
            ref={menuButtonRef}
            className="create-rule-button"
            onClick={() => setCreateMenuOpen(!createMenuOpen)}
          >
            Create Rule ▼
          </button>
          {createMenuOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => handleCreateRule('Target')}>
                🎯 Target-based Rule
              </div>
              <div className="dropdown-item" onClick={() => handleCreateRule('Tier')}>
                📊 Tier-based Rule
              </div>
              <div className="dropdown-item" onClick={() => handleCreateRule('Project')}>
                💼 Project-based Rule
              </div>
              <div className="dropdown-item" onClick={() => handleCreateRule('Location')}>
                📍 Location-based Rule
              </div>
              <div className="dropdown-item" onClick={() => handleCreateRule('Team')}>
                👥 Team-based Rule
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="rules-table-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : rules.length === 0 ? (
          <div className="empty-state">
            No incentive rules found. Create your first rule by clicking the "Create Rule" button.
          </div>
        ) : (
          <table className="rules-table">
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Type</th>
                <th>Created By</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td>
                    <div className="rule-name">{rule.name}</div>
                    {rule.description && (
                      <div className="rule-description">{rule.description}</div>
                    )}
                  </td>
                  <td>{rule.type}</td>
                  <td>{rule.createdBy}</td>
                  <td>{formatDate(rule.createdAt)}</td>
                  <td>
                    <span className={`status-badge ${rule.status === 'Active' ? 'active' : 'inactive'}`}>
                      {rule.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-button" onClick={() => handleViewRule(rule.id)}>
                        View
                      </button>
                      <button className="edit-button" onClick={() => handleEditRule(rule.id)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteClick(rule.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteDialogOpen && (
        <div className="delete-dialog">
          <div className="delete-dialog-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this incentive rule? This action cannot be undone.</p>
            <div className="dialog-buttons">
              <button className="cancel-button" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </button>
              <button className="delete-button" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default IncentiveRulesList;
