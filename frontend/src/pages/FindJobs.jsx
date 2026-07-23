import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const defaultListings = [
  {
    id: '101',
    title: 'Senior Frontend Developer',
    company: 'Innovate LLC',
    logo: 'I',
    location: 'Remote',
    salary: '₹14,00,000 - ₹16,00,000',
    matchPercentage: 94,
    tags: ['React', 'TypeScript', 'CSS'],
    posted: '2 days ago',
    description: 'We are seeking a talented Senior Frontend Developer to lead the engineering of our client-facing interfaces. You will work on cutting-edge React architectures.',
    requiredQualifications: 'Bachelor\'s in Computer Science or similar tech background.',
    experienceRequired: '4+ years',
    employmentType: 'Full-time',
    openings: 2,
    deadline: '2026-08-30',
    responsibilities: '1. Lead the architecture of React applications.\n2. Mentor junior engineers.\n3. Implement high fidelity designs.',
    preferredQualifications: 'Experience with Node.js and Next.js is a major plus.',
    benefits: 'Remote allowance, annual learning budget, top-tier medical insurance.',
    selectionProcess: '1. Screening Call\n2. Live Coding Interview\n3. System Design Round\n4. Fit Chat',
    additionalRequirements: 'Immediate availability preferred.'
  },
  {
    id: '102',
    title: 'UI/UX Engineer',
    company: 'Creative Solutions',
    logo: 'C',
    location: 'Austin, TX (Hybrid)',
    salary: '₹11,50,000 - ₹13,50,000',
    matchPercentage: 88,
    tags: ['Figma', 'React', 'Tailwind'],
    posted: '5 hours ago',
    description: 'Bridges the gap between design and engineering. You will design layouts in Figma and translate them into modular React and CSS code.',
    requiredQualifications: 'Strong design portfolio and basic frontend development skills.',
    experienceRequired: '2+ years',
    employmentType: 'Full-time',
    openings: 1,
    deadline: '2026-08-10',
    responsibilities: '1. Create interactive high-fidelity Figma mockups.\n2. Write component-driven UI using React and CSS.\n3. Ensure design consistency across the product.',
    preferredQualifications: 'Experience with TailwindCSS and component libraries like Radix.',
    benefits: 'Free meals, in-office gym, 4 weeks paid leave.',
    selectionProcess: '1. Portfolio Review\n2. Visual Design Challenge\n3. React Code evaluation',
    additionalRequirements: 'Must be willing to work hybrid from Austin.'
  },
  {
    id: '103',
    title: 'Web Developer',
    company: 'Global Tech',
    logo: 'G',
    location: 'Remote',
    salary: '₹9,00,000 - ₹11,00,000',
    matchPercentage: 75,
    tags: ['JavaScript', 'HTML', 'CSS'],
    posted: '1 week ago',
    description: 'An entry-to-mid level role focusing on maintaining corporate websites and landing pages, updating content, and developing lightweight scripts.',
    requiredQualifications: 'High School Diploma or Bootcamp Graduate with strong HTML/CSS/JS skills.',
    experienceRequired: '1-2 years',
    employmentType: 'Full-time',
    openings: 3,
    deadline: '2026-08-25',
    responsibilities: '1. Maintain and update existing websites.\n2. Write structured and readable HTML/CSS.\n3. Create responsive layouts.',
    preferredQualifications: 'Familiarity with static site generators and basic SEO principles.',
    benefits: '100% remote, home-office budget, wellness allowance.',
    selectionProcess: '1. General Technical Screening\n2. Take-home assignment\n3. Interview with hiring manager',
    additionalRequirements: 'Must have strong attention to detail.'
  }
];

const FindJobs = () => {
  const { user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Load from local storage
    const storedListings = localStorage.getItem('custom_listings');
    if (storedListings) {
      setListings(JSON.parse(storedListings));
    } else {
      localStorage.setItem('custom_listings', JSON.stringify(defaultListings));
      setListings(defaultListings);
    }

    // Load already applied jobs from localStorage if any
    const storedApplied = localStorage.getItem('applied_job_ids');
    if (storedApplied) {
      setAppliedJobIds(JSON.parse(storedApplied));
    }
  }, []);

  const handleApply = (job) => {
    // Prevent double apply
    if (appliedJobIds.includes(job.id)) return;

    // Add to applied job IDs
    const updatedAppliedIds = [...appliedJobIds, job.id];
    setAppliedJobIds(updatedAppliedIds);
    localStorage.setItem('applied_job_ids', JSON.stringify(updatedAppliedIds));

    // Save the application status to the candidate's list of applied jobs
    // We can fetch existing custom candidate applications or make a new list
    const storedAppliedJobs = localStorage.getItem('custom_candidate_applications');
    const appliedJobs = storedAppliedJobs ? JSON.parse(storedAppliedJobs) : [];
    
    const newAppliedJob = {
      id: job.id,
      title: job.title,
      company: job.company,
      logo: job.logo,
      appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Applied',
      timeline: [
        { step: 'Applied', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), completed: true },
        { step: 'Reviewed', date: null, completed: false },
        { step: 'Interviewed', date: null, completed: false },
        { step: 'Offered', date: null, completed: false }
      ],
      description: job.description || 'No description provided.',
      location: job.location,
      salary: job.salary
    };

    appliedJobs.unshift(newAppliedJob);
    localStorage.setItem('custom_candidate_applications', JSON.stringify(appliedJobs));

    // Add to the applicant list of the Recruiter so the logged-in candidate shows up there!
    if (user) {
      const storedApplicants = localStorage.getItem('custom_applicants');
      const applicants = storedApplicants ? JSON.parse(storedApplicants) : [];
      
      // Check if candidate already registered in applicants list
      const alreadyApplied = applicants.some(app => app.email === user.email && app.role === job.title);
      if (!alreadyApplied) {
        applicants.unshift({
          id: user.id || Math.random().toString(36).substr(2, 9),
          name: user.name || 'Candidate',
          role: job.title,
          status: 'Applied',
          avatar: (user.name || 'C').substring(0, 2).toUpperCase(),
          email: user.email,
          contact: user.contact || 'No contact provided',
          highestQualification: user.highestQualification || 'Not provided',
          degree: user.degree || 'Not provided',
          college: user.college || 'Not provided',
          gradYear: user.gradYear || 'Not provided',
          skills: user.skills || 'React, HTML, CSS',
          interests: user.interests || 'Web Development',
          experience: user.experience || 'Fresher',
          resumeName: user.resumeName || 'resume_mock.pdf'
        });
        localStorage.setItem('custom_applicants', JSON.stringify(applicants));
      }
    }

    setSuccessMessage('Successfully applied to ' + job.title + '!');
    setSelectedJob(null);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Find Jobs</h2>
        <p>Based on your profile, here are some opportunities you might like.</p>
      </div>

      {successMessage && (
        <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontWeight: '500' }}>
          {successMessage}
        </div>
      )}

      <div className="job-listings-list">
        {listings.map(job => {
          const isApplied = appliedJobIds.includes(job.id);
          return (
            <div key={job.id} className="card job-listing-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedJob(job)}>
              <div className="listing-top">
                <div className="company-logo-placeholder">{job.logo}</div>
                <div className="listing-info">
                  <h3>{job.title}</h3>
                  <p>{job.company} &bull; {job.location}</p>
                </div>
                <div className="match-score">
                  <div className="score-circle">
                    <span>{job.matchPercentage}%</span>
                  </div>
                  <span className="score-label">Match</span>
                </div>
              </div>
              
              <div className="listing-middle">
                <span className="listing-salary">{job.salary}</span>
                <div className="listing-tags">
                  {job.tags && job.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="listing-bottom" onClick={(e) => e.stopPropagation()}>
                <span className="posted-time">Posted {job.posted}</span>
                <button 
                  className={`btn-primary-small ${isApplied ? 'applied-btn' : ''}`}
                  disabled={isApplied}
                  onClick={() => handleApply(job)}
                  style={isApplied ? { backgroundColor: '#e2e8f0', color: '#64748b', border: 'none', cursor: 'not-allowed' } : {}}
                >
                  {isApplied ? 'Applied' : 'Easy Apply'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Job Details Modal */}
      {selectedJob && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '2rem 1rem' }}>
          <div className="modal-content card" style={{ maxWidth: '700px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '2.5rem', borderRadius: '1rem', backgroundColor: 'var(--card-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-main)' }}>{selectedJob.title}</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {selectedJob.company} &bull; {selectedJob.location}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <span className="badge" style={{ backgroundColor: 'var(--primary-color-light)', color: 'var(--primary-color)' }}>
                    {selectedJob.employmentType || 'Full-time'}
                  </span>
                  <span className="badge" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                    {selectedJob.salary}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} style={{ background: 'none', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-main)', fontSize: '0.975rem', lineHeight: '1.5' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '1.1rem' }}>Job Description</strong>
                <p>{selectedJob.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <strong>Required Qualifications:</strong>
                  <p>{selectedJob.requiredQualifications}</p>
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <strong>Experience Required:</strong>
                  <p>{selectedJob.experienceRequired}</p>
                </div>
              </div>

              {selectedJob.responsibilities && (
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '1.1rem' }}>Responsibilities</strong>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{selectedJob.responsibilities}</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <strong>Skills Required:</strong>
                  <p>{selectedJob.requiredSkills || selectedJob.tags.join(', ')}</p>
                </div>
                {selectedJob.openings && (
                  <div style={{ flex: '1 1 200px' }}>
                    <strong>Openings:</strong>
                    <p>{selectedJob.openings} positions</p>
                  </div>
                )}
              </div>

              {selectedJob.preferredQualifications && (
                <div>
                  <strong>Preferred Qualifications:</strong>
                  <p>{selectedJob.preferredQualifications}</p>
                </div>
              )}

              {selectedJob.benefits && (
                <div>
                  <strong>Benefits and Perks:</strong>
                  <p>{selectedJob.benefits}</p>
                </div>
              )}

              {selectedJob.selectionProcess && (
                <div>
                  <strong>Selection Process:</strong>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{selectedJob.selectionProcess}</div>
                </div>
              )}

              {selectedJob.additionalRequirements && (
                <div>
                  <strong>Additional Requirements:</strong>
                  <p>{selectedJob.additionalRequirements}</p>
                </div>
              )}

              {selectedJob.deadline && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Application Deadline: <strong>{selectedJob.deadline}</strong>
                  </span>
                  
                  <button 
                    className="btn-primary" 
                    disabled={appliedJobIds.includes(selectedJob.id)}
                    onClick={() => handleApply(selectedJob)}
                    style={appliedJobIds.includes(selectedJob.id) ? { backgroundColor: '#e2e8f0', color: '#64748b', border: 'none', cursor: 'not-allowed', padding: '0.6rem 1.5rem' } : { padding: '0.6rem 1.5rem' }}
                  >
                    {appliedJobIds.includes(selectedJob.id) ? 'Applied' : 'Easy Apply'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindJobs;
