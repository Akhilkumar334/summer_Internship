import React from 'react';

const EmployerMyJobs = () => {
  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>My Jobs</h2>
          <p>Manage your active job postings.</p>
        </div>
        <button className="btn-primary">+ Add New Job</button>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Salary Range</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Senior Frontend Engineer</td>
                <td>Remote</td>
                <td>₹14,00,000 - ₹16,00,000</td>
                <td><span className="status active">Active</span></td>
                <td>
                  <button className="btn-text">Edit</button> | <button className="btn-text" style={{ color: 'var(--error-color)' }}>Close</button>
                </td>
              </tr>
              <tr>
                <td>Product Manager</td>
                <td>New Delhi</td>
                <td>₹12,00,000 - ₹15,00,000</td>
                <td><span className="status active">Active</span></td>
                <td>
                  <button className="btn-text">Edit</button> | <button className="btn-text" style={{ color: 'var(--error-color)' }}>Close</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployerMyJobs;
