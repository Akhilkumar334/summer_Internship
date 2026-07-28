import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

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
  
  // Apply Resume Choice States
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyingJob, setApplyingJob] = useState(null);
  const [resumeChoice, setResumeChoice] = useState('primary');
  const [tailoredResumeFile, setTailoredResumeFile] = useState(null);
  const [tailoredResumeName, setTailoredResumeName] = useState('');

  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      try {
        // 1. Fetch real jobs from backend
        const jobsData = await apiFetch('/jobs');
        const mappedJobs = (jobsData.jobs || []).map(j => ({
          id: j.id.toString(),
          title: j.title,
          company: j.employer?.employerProfile?.companyName || j.employer?.username || 'Job Board Inc',
          logo: (j.employer?.employerProfile?.companyName || j.employer?.username || 'J').charAt(0).toUpperCase(),
          location: j.location,
          salary: typeof j.salary === 'number' ? `₹${j.salary.toLocaleString('en-IN')}` : j.salary || 'Not Disclosed',
          tags: j.requirements ? j.requirements.split(',').map(s => s.trim()).slice(0, 3) : ['Tech'],
          posted: new Date(j.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          description: j.description,
          requiredQualifications: j.requirements || '',
          experienceRequired: j.jobType || 'Full-time',
          employmentType: j.jobType || 'Full-time',
          openings: 1,
          deadline: '2026-12-31',
          responsibilities: j.description,
          preferredQualifications: j.requirements,
          benefits: 'Competitive package',
          selectionProcess: 'Interview rounds',
          additionalRequirements: '',
          matchPercentage: j.matchPercentage
        }));
        setListings(mappedJobs);

        // 2. Fetch applied job IDs for current candidate
        if (user && user.role === 'candidate') {
          const appsData = await apiFetch('/applications/my-applications');
          const appliedIds = (appsData.applications || []).map(app => app.jobId.toString());
          setAppliedJobIds(appliedIds);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err.message);
      }
    };

    fetchJobsAndApplications();
  }, [user]);

  const handleInitiateApply = (job) => {
    if (appliedJobIds.includes(job.id)) return;
    setApplyingJob(job);
    setResumeChoice('primary');
    setTailoredResumeFile(null);
    setTailoredResumeName('');
    setShowApplyModal(true);
  };

  const confirmApply = async () => {
    if (!applyingJob) return;
    if (resumeChoice === 'tailored' && !tailoredResumeFile) {
      alert('Please choose and upload a tailored resume.');
      return;
    }

    try {
      await apiFetch('/applications', {
        method: 'POST',
        body: {
          jobId: parseInt(applyingJob.id),
          coverLetter: 'Applying from frontend',
          resumeType: resumeChoice,
          tailoredResumeName: resumeChoice === 'tailored' ? tailoredResumeFile.name : null
        }
      });

      const updatedAppliedIds = [...appliedJobIds, applyingJob.id];
      setAppliedJobIds(updatedAppliedIds);

      setSuccessMessage('Successfully applied to ' + applyingJob.title + '!');
      setSelectedJob(null);
      setShowApplyModal(false);
      setApplyingJob(null);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to submit application');
    }
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
                {job.matchPercentage !== null && job.matchPercentage !== undefined && (
                  <div className="match-score">
                    <div className="score-circle">
                      <span>{job.matchPercentage}%</span>
                    </div>
                    <span className="score-label">Match</span>
                  </div>
                )}
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
                  onClick={() => handleInitiateApply(job)}
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
                    onClick={() => handleInitiateApply(selectedJob)}
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

      {/* Apply Resume Option Modal */}
      {showApplyModal && applyingJob && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '2rem 1rem' }}>
          <div className="modal-content card" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem', borderRadius: '1rem', backgroundColor: 'var(--card-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600' }}>Apply for {applyingJob.title}</h3>
              <button onClick={() => { setShowApplyModal(false); setApplyingJob(null); }} style={{ background: 'none', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            
            <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Would you like to upload a new resume tailored for this job, or use your original resume?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: resumeChoice === 'primary' ? 'rgba(79, 70, 229, 0.05)' : 'transparent', borderColor: resumeChoice === 'primary' ? 'var(--primary-color)' : 'var(--border-color)' }}>
                <input 
                  type="radio" 
                  name="resumeOption" 
                  checked={resumeChoice === 'primary'} 
                  onChange={() => setResumeChoice('primary')} 
                  style={{ marginTop: '0.2rem' }}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Use my original resume</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    File: {user?.resumeName || 'Your uploaded primary resume'}
                  </span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: resumeChoice === 'tailored' ? 'rgba(79, 70, 229, 0.05)' : 'transparent', borderColor: resumeChoice === 'tailored' ? 'var(--primary-color)' : 'var(--border-color)' }}>
                <input 
                  type="radio" 
                  name="resumeOption" 
                  checked={resumeChoice === 'tailored'} 
                  onChange={() => setResumeChoice('tailored')}
                  style={{ marginTop: '0.2rem' }}
                />
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: resumeChoice === 'tailored' ? '0.5rem' : 0 }}>Upload a new resume for this job</strong>
                  {resumeChoice === 'tailored' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setTailoredResumeFile(e.target.files[0]);
                            setTailoredResumeName(e.target.files[0].name);
                          }
                        }}
                        style={{ display: 'none' }}
                        id="tailored-resume-upload"
                      />
                      <label htmlFor="tailored-resume-upload" className="btn-secondary" style={{ cursor: 'pointer', margin: 0, padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                        Choose File
                      </label>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                        {tailoredResumeName || 'No file chosen'}
                      </span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => { setShowApplyModal(false); setApplyingJob(null); }} 
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={confirmApply}
                style={{ flex: 1, margin: 0 }}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindJobs;
