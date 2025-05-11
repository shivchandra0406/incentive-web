import React, { useState } from 'react';
import './TargetBasedRuleDialog.css';

const TargetBasedRuleDialog = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetType, setTargetType] = useState('Monthly');
  const [currencyType, setCurrencyType] = useState('Rupee');
  const [targetDealType, setTargetDealType] = useState('Salary');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [incentiveType, setIncentiveType] = useState('Amount');
  const [rewardAmount, setRewardAmount] = useState('');
  const [rewardPercentage, setRewardPercentage] = useState('');
  const [itemRewardType, setItemRewardType] = useState('Reward');
  const [itemNestedChoice, setItemNestedChoice] = useState('Amount');
  const [itemNestedAmount, setItemNestedAmount] = useState('');
  const [itemNestedPercentage, setItemNestedPercentage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted with values:', {
        name,
        description,
        targetType,
        currencyType,
        targetDealType,
        salaryAmount,
        targetAmount,
        incentiveType,
        rewardAmount,
        rewardPercentage,
        itemRewardType,
        itemNestedChoice,
        itemNestedAmount,
        itemNestedPercentage
      });

      setLoading(false);
      onClose();
    }, 1000);
  };

  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        {/* Fixed header */}
        <div className="dialog-header">
          <h2>Mr. Munim - Create Target-Based Rule</h2>
          <button type="button" className="close-button" onClick={onClose}>&times;</button>
        </div>

        {/* Scrollable content */}
        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            <div className="form-section">
              <div className="form-group">
                <label>Target Type</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="form-group">
                <label>Currency Type</label>
                <select
                  value={currencyType}
                  onChange={(e) => setCurrencyType(e.target.value)}
                >
                  <option value="Rupee">Rupee</option>
                  <option value="Dollar">Dollar</option>
                  <option value="Dirham">Dirham</option>
                </select>
              </div>

              {targetType === 'Custom' && (
                <>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="date" />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <input type="date" />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Target Deal Type</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="targetDealType"
                      value="Salary"
                      checked={targetDealType === 'Salary'}
                      onChange={() => setTargetDealType('Salary')}
                    />
                    Salary
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="targetDealType"
                      value="Item"
                      checked={targetDealType === 'Item'}
                      onChange={() => setTargetDealType('Item')}
                    />
                    Item
                  </label>
                </div>
              </div>

              {targetDealType === 'Salary' && (
                <>
                  <div className="form-group">
                    <label>Salary Amount</label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        value={salaryAmount}
                        onChange={(e) => setSalaryAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Target Amount</label>
                    <div className="input-with-suffix">
                      <input
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        required
                      />
                      <span className="input-suffix">%</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Incentive Type</label>
                    <div className="radio-group">
                      <label>
                        <input
                          type="radio"
                          name="incentiveType"
                          value="Amount"
                          checked={incentiveType === 'Amount'}
                          onChange={() => setIncentiveType('Amount')}
                        />
                        Amount
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="incentiveType"
                          value="Percentage"
                          checked={incentiveType === 'Percentage'}
                          onChange={() => setIncentiveType('Percentage')}
                        />
                        Percentage
                      </label>
                    </div>
                  </div>

                  {incentiveType === 'Amount' && (
                    <div className="form-group">
                      <label>Reward Amount</label>
                      <div className="input-with-prefix">
                        <span className="input-prefix">₹</span>
                        <input
                          type="number"
                          value={rewardAmount}
                          onChange={(e) => setRewardAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {incentiveType === 'Percentage' && (
                    <div className="form-group">
                      <label>Reward Percentage</label>
                      <div className="input-with-suffix">
                        <input
                          type="number"
                          value={rewardPercentage}
                          onChange={(e) => setRewardPercentage(e.target.value)}
                          required
                        />
                        <span className="input-suffix">%</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {targetDealType === 'Item' && (
                <>
                  <div className="form-group">
                    <label>Item Reward Type</label>
                    <div className="radio-group">
                      <label>
                        <input
                          type="radio"
                          name="itemRewardType"
                          value="Reward"
                          checked={itemRewardType === 'Reward'}
                          onChange={() => setItemRewardType('Reward')}
                        />
                        Reward
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="itemRewardType"
                          value="Amount"
                          checked={itemRewardType === 'Amount'}
                          onChange={() => setItemRewardType('Amount')}
                        />
                        Amount
                      </label>
                    </div>
                  </div>

                  {itemRewardType === 'Reward' && (
                    <div className="nested-form-group">
                      <div className="form-group">
                        <label>Reward Type</label>
                        <div className="radio-group">
                          <label>
                            <input
                              type="radio"
                              name="itemNestedChoice"
                              value="Amount"
                              checked={itemNestedChoice === 'Amount'}
                              onChange={() => setItemNestedChoice('Amount')}
                            />
                            Amount
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="itemNestedChoice"
                              value="Percentage"
                              checked={itemNestedChoice === 'Percentage'}
                              onChange={() => setItemNestedChoice('Percentage')}
                            />
                            Percentage
                          </label>
                        </div>
                      </div>

                      {itemNestedChoice === 'Amount' && (
                        <div className="form-group">
                          <label>Amount</label>
                          <input
                            type="number"
                            value={itemNestedAmount}
                            onChange={(e) => setItemNestedAmount(e.target.value)}
                            required
                          />
                        </div>
                      )}

                      {itemNestedChoice === 'Percentage' && (
                        <div className="form-group">
                          <label>Percentage</label>
                          <input
                            type="number"
                            value={itemNestedPercentage}
                            onChange={(e) => setItemNestedPercentage(e.target.value)}
                            required
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          </div>
          <div className="dialog-footer">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TargetBasedRuleDialog;
