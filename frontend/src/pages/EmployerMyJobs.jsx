import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

// Default jobs with rich structure
const defaultJobs = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    company: 'Tech Solutions Inc.',
    description: 'We are seeking a talented Senior Frontend Engineer to build high-performance, responsive web interfaces using React.js and modern build tools.',
    requiredQualifications: 'Bachelor\'s or Master\'s degree in Computer Science, Engineering, or a related field.',
    requiredSkills: 'React, JavaScript, CSS, HTML5, TypeScript, Webpack',
    experienceRequired: '3-5 years',
    employmentType: 'Full-time',
    salary: '₹14,00,000 - ₹16,00,000',
    locationType: 'Remote',
    location: 'Bengaluru, India',
    openings: 2,
    deadline: '2026-08-15',
    responsibilities: '1. Develop clean, reusable React components.\n2. Optimize application performance.\n3. Collaborate with designers and backend engineers.',
    preferredQualifications: 'Experience with web vitals optimization and server-side rendering.',
    benefits: 'Flexible work hours, comprehensive health insurance, learning allowance.',
    selectionProcess: '1. Resume Screening\n2. Technical Assignment\n3. System Design Interview\n4. HR Discussion',
    additionalRequirements: 'Candidates must have a solid internet connection and power backup.',
    status: 'Active',
    posted: '2 days ago'
  },
  {
    id: 'job-2',
    title: 'Product Manager',
    company: 'Innovate LLC',
    description: 'Looking for a product manager to lead the lifecycle of our SaaS application from concept through to release and customer adoption.',
    requiredQualifications: 'MBA or Bachelor\'s degree in Business, Computer Science or equivalent.',
    requiredSkills: 'Agile Methodology, Product Roadmap, Jira, Data Analysis',
    experienceRequired: '2-4 years',
    employmentType: 'Full-time',
    salary: '₹12,00,000 - ₹15,00,000',
    locationType: 'Hybrid',
    location: 'New Delhi, India',
    openings: 1,
    deadline: '2026-08-20',
    responsibilities: '1. Define the product vision and roadmaps.\n2. Gather and prioritize product and customer requirements.\n3. Work closely with engineering and marketing.',
    preferredQualifications: 'Previous experience in product management at a fast-growing startup.',
    benefits: 'Competitive equity package, gym membership, remote work flexibility.',
    selectionProcess: '1. Initial screening\n2. Case Study round\n3. Interview with Leadership team',
    additionalRequirements: 'Excellent verbal and written communication skills are a must.',
    status: 'Active',
    posted: '5 days ago'
  }
];

const EmployerMyJobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState(user?.companyName || 'Tech Solutions Inc.');
  const [description, setDescription] = useState('');
  const [requiredQualifications, setRequiredQualifications] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [experienceRequired, setExperienceRequired] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [salary, setSalary] = useState('');
  const [locationType, setLocationType] = useState('Remote');
  const [location, setLocation] = useState('');
  const [openings, setOpenings] = useState(1);
  const [deadline, setDeadline] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [preferredQualifications, setPreferredQualifications] = useState('');
  const [benefits, setBenefits] = useState('');
  const [selectionProcess, setSelectionProcess] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  const fetchJobs = async () => {
    try {
      if (!user) return;
      const jobsData = await apiFetch('/jobs');
      const mapped = (jobsData.jobs || []).filter(j => j.employerId === user.id).map(j => ({
        id: j.id.toString(),
        title: j.title,
        company: j.employer?.employerProfile?.companyName || j.employer?.username || 'Job Board Inc',
        description: j.description,
        requiredQualifications: j.requirements || '',
        requiredSkills: j.requirements || '',
        experienceRequired: j.jobType || 'Full-time',
        employmentType: j.jobType || 'Full-time',
        salary: typeof j.salary === 'number' ? `₹${j.salary.toLocaleString('en-IN')}` : j.salary || 'Not Disclosed',
        locationType: 'Office',
        location: j.location,
        openings: 1,
        deadline: '2026-12-31',
        responsibilities: j.description,
        preferredQualifications: j.requirements,
        benefits: 'Competitive package',
        selectionProcess: 'Interview rounds',
        additionalRequirements: '',
        status: 'Active',
        posted: new Date(j.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
      setJobs(mapped);
    } catch (err) {
      console.error('Error fetching jobs:', err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  // Update default company name when user companyName changes
  useEffect(() => {
    if (user?.companyName) {
      setCompany(user.companyName);
    }
  }, [user]);

  const handleCreateJob = async (e) => {
    e.preventDefault();

    try {
      await apiFetch('/jobs', {
        method: 'POST',
        body: {
          title,
          description,
          requirements: requiredSkills || requiredQualifications,
          location: location || 'Remote',
          salary,
          jobType: employmentType
        }
      });

      // Reset Form & Close Modal
      setTitle('');
      setDescription('');
      setRequiredQualifications('');
      setRequiredSkills('');
      setExperienceRequired('');
      setEmploymentType('Full-time');
      setSalary('');
      setLocationType('Remote');
      setLocation('');
      setOpenings(1);
      setDeadline('');
      setResponsibilities('');
      setPreferredQualifications('');
      setBenefits('');
      setSelectionProcess('');
      setAdditionalRequirements('');
      setShowModal(false);

      // Reload jobs
      fetchJobs();
    } catch (err) {
      alert(err.message || 'Failed to post job');
    }
  };

  const handleCloseJob = async (id) => {
    try {
      await apiFetch(`/jobs/${id}`, {
        method: 'DELETE'
      });
      // Reload jobs
      fetchJobs();
    } catch (err) {
      alert(err.message || 'Failed to delete job');
    }
  };

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>My Jobs</h2>
          <p>Manage your active job postings.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add New Job</button>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location Type</th>
                <th>Location</th>
                <th>Salary Range</th>
                <th>Openings</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <strong>{job.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.company}</div>
                  </td>
                  <td>{job.locationType}</td>
                  <td>{job.location}</td>
                  <td>{job.salary}</td>
                  <td>{job.openings}</td>
                  <td>
                    <span className={`status ${job.status === 'Active' ? 'active' : 'inactive'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    {job.status === 'Active' ? (
                      <button className="btn-text" style={{ color: 'var(--error-color)' }} onClick={() => handleCloseJob(job.id)}>
                        Close Posting
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, overflowY: 'auto', padding: '2rem 1rem' }}>
          <div className="modal-content card" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', borderRadius: '1rem', backgroundColor: 'var(--card-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Create Rich Job Posting</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>

            <form onSubmit={handleCreateJob} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Job Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Company Name</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required />
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Employment Type</label>
                  <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className="mock-select" style={{ width: '100%', height: '42px', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Location Type</label>
                  <select value={locationType} onChange={(e) => setLocationType(e.target.value)} className="mock-select" style={{ width: '100%', height: '42px', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Location (City/Region)</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Bengaluru, Karnataka (or Remote)" required={locationType !== 'Remote'} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Salary / Salary Range (INR)</label>
                  <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. ₹12,00,000 - ₹15,00,000" required />
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Number of Openings</label>
                  <input type="number" min="1" value={openings} onChange={(e) => setOpenings(e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Application Deadline</label>
                  <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label>Job Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide details about the role..." rows="3" required />
              </div>

              <div className="form-group">
                <label>Required Qualifications</label>
                <input type="text" value={requiredQualifications} onChange={(e) => setRequiredQualifications(e.target.value)} placeholder="e.g. B.Tech in CSE or equivalent" required />
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Required Skills (comma separated)</label>
                  <input type="text" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} placeholder="e.g. React, Node.js, Python" required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Experience Required</label>
                  <input type="text" value={experienceRequired} onChange={(e) => setExperienceRequired(e.target.value)} placeholder="e.g. 2-3 years, Freshers welcome" required />
                </div>
              </div>

              <div className="form-group">
                <label>Responsibilities (One per line)</label>
                <textarea value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} placeholder="1. Design beautiful layouts&#10;2. Collaborate with teams" rows="3" required />
              </div>

              <div className="form-group">
                <label>Preferred Qualifications (Optional)</label>
                <input type="text" value={preferredQualifications} onChange={(e) => setPreferredQualifications(e.target.value)} placeholder="e.g. Experience with AWS or CI/CD pipelines" />
              </div>

              <div className="form-group">
                <label>Benefits and Perks (Optional)</label>
                <input type="text" value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="e.g. Free meals, health insurance, remote flexibility" />
              </div>

              <div className="form-group">
                <label>Selection Process (Optional, one per line)</label>
                <textarea value={selectionProcess} onChange={(e) => setSelectionProcess(e.target.value)} placeholder="1. Screening Interview&#10;2. Coding Round" rows="2" />
              </div>

              <div className="form-group">
                <label>Additional Requirements (Optional)</label>
                <input type="text" value={additionalRequirements} onChange={(e) => setAdditionalRequirements(e.target.value)} placeholder="e.g. Immediate joiners only" />
              </div>

              <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1.5rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerMyJobs;
