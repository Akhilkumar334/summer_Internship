import React, { useState, useEffect } from 'react';

// Default detailed mock applicants
const defaultApplicants = [
  { 
    id: 'app-1', 
    name: 'Akhil Kumar', 
    role: 'Senior Frontend Developer', 
    status: 'Interviewing', 
    avatar: 'AK',
    email: 'akhil@gmail.com',
    contact: '+91 98765 43210',
    highestQualification: 'B.Tech',
    degree: 'Computer Science & Engineering',
    college: 'Delhi Technological University',
    gradYear: '2024',
    skills: 'React, Redux, JavaScript (ES6+), HTML5, CSS3, TailwindCSS, TypeScript',
    interests: 'Frontend Engineering, Interactive UI Design, Open Source Contributing',
    experience: '6-month internship at WebTech Solutions as a frontend intern. Built 3 responsive dashboards and worked with React Router.',
    resumeName: 'Akhil_Kumar_Resume.pdf'
  },
  { 
    id: 'app-2', 
    name: 'Kritika Sharma', 
    role: 'Product Manager', 
    status: 'Reviewed', 
    avatar: 'KS',
    email: 'kritika@gmail.com',
    contact: '+91 87654 32109',
    highestQualification: 'MBA',
    degree: 'Product Management & Marketing',
    college: 'Indian Institute of Management (IIM)',
    gradYear: '2023',
    skills: 'Product Lifecycle, Agile/Scrum, Jira, Market Research, Google Analytics, User Personas',
    interests: 'Product Strategy, Growth Marketing, SaaS Products',
    experience: 'Product Analyst at FinTech Co for 1 year. Analyzed user conversion funnels and improved signup conversions by 15%.',
    resumeName: 'Kritika_Sharma_CV.pdf'
  },
  { 
    id: 'app-3', 
    name: 'Rohan Mehta', 
    role: 'Senior Frontend Developer', 
    status: 'Applied', 
    avatar: 'RM',
    email: 'rohan.mehta@yahoo.com',
    contact: '+91 76543 21098',
    highestQualification: 'B.C.A',
    degree: 'Computer Applications',
    college: 'Christ University',
    gradYear: '2025',
    skills: 'React, Next.js, JavaScript, CSS (Flexbox/Grid), Git, Node.js',
    interests: 'Web Design, Jamstack Development, Creative Coding',
    experience: 'Freelance Web Developer for local businesses. Created 5 custom landing pages and styled CSS frameworks.',
    resumeName: 'Rohan_Mehta_Resume.pdf'
  },
  { 
    id: 'app-4', 
    name: 'Anmol Singh', 
    role: 'Backend Engineer', 
    status: 'Applied', 
    avatar: 'AS',
    email: 'anmol@gmail.com',
    contact: '+91 99988 77766',
    highestQualification: 'B.Tech',
    degree: 'Information Technology',
    college: 'NSUT, Delhi',
    gradYear: '2024',
    skills: 'Node.js, Express, MongoDB, PostgreSQL, REST APIs, Redis, Docker',
    interests: 'Backend Systems, Database Tuning, System Design',
    experience: 'Backend developer on college portal project. Handled database schemas for 10k+ active users and tuned search queries.',
    resumeName: 'Anmol_Backend_CV.pdf'
  },
  { 
    id: 'app-5', 
    name: 'Ram Charan', 
    role: 'UI/UX Designer', 
    status: 'Offered', 
    avatar: 'RC',
    email: 'ram.charan@gmail.com',
    contact: '+91 77766 55544',
    highestQualification: 'B.Des',
    degree: 'Interaction Design',
    college: 'National Institute of Design (NID)',
    gradYear: '2024',
    skills: 'Figma, Adobe XD, Sketch, Wireframing, Prototyping, Usability Testing, User Research',
    interests: 'UX Architecture, Micro-interactions, Design Systems',
    experience: 'UI Design Intern at design agency. Worked on redesigning mobile apps for 2 ecommerce clients and built design system assets.',
    resumeName: 'Ram_Charan_Portfolio.pdf'
  }
];

const EmployerApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const storedApplicants = localStorage.getItem('custom_applicants');
    if (storedApplicants) {
      setApplicants(JSON.parse(storedApplicants));
    } else {
      localStorage.setItem('custom_applicants', JSON.stringify(defaultApplicants));
      setApplicants(defaultApplicants);
    }
  }, []);

  const updateStatus = (id, newStatus, e) => {
    e.stopPropagation(); // Avoid opening profile when modifying status dropdown
    const updated = applicants.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    setApplicants(updated);
    localStorage.setItem('custom_applicants', JSON.stringify(updated));

    // Also update this candidate's application in their personal dashboard if applicable
    const storedApplications = localStorage.getItem('custom_candidate_applications');
    if (storedApplications) {
      const candidateApps = JSON.parse(storedApplications);
      const appToUpdate = applicants.find(app => app.id === id);
      
      if (appToUpdate) {
        const updatedCandidateApps = candidateApps.map(job => {
          // If the company name matches or job title matches (simplistic match in mock setup)
          if (job.title === appToUpdate.role) {
            const updatedTimeline = job.timeline.map(item => {
              if (item.step === newStatus) {
                return { ...item, completed: true, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
              }
              // Mark previous steps completed depending on status progression
              if (newStatus === 'Interviewing' && (item.step === 'Reviewed' || item.step === 'Applied')) {
                return { ...item, completed: true, date: item.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
              }
              if (newStatus === 'Offered' && item.step !== 'Rejected') {
                return { ...item, completed: true, date: item.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
              }
              return item;
            });

            return { 
              ...job, 
              status: newStatus,
              timeline: updatedTimeline
            };
          }
          return job;
        });
        localStorage.setItem('custom_candidate_applications', JSON.stringify(updatedCandidateApps));
      }
    }
  };

  const handleDownloadResume = (e, filename) => {
    e.stopPropagation();
    alert(`Downloading mock resume file: ${filename}`);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Applicants Pipeline</h2>
        <p>Review and move candidates through the hiring process. Click on any candidate to evaluate their full profile.</p>
      </div>

      <div className="card applicants-pipeline-card">
        <div className="list-placeholder">
          {applicants.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No applicants yet.</p>
          ) : (
            applicants.map(app => (
              <div 
                key={app.id} 
                className="modern-list-item" 
                style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => setSelectedCandidate(app)}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div className="applicant-avatar">{app.avatar || 'C'}</div>
                  <div className="applicant-info">
                    <strong>{app.name}</strong>
                    <br />
                    <span className="job-role-text">{app.role}</span>
                  </div>
                </div>
                
                <div className="pipeline-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                  <span className={`status-badge status-${app.status.toLowerCase().replace(' ', '-')}`}>
                    {app.status}
                  </span>
                  
                  <select 
                    className="mock-select"
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value, e)}
                    style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Candidate Evaluation Modal / Slide-out */}
      {selectedCandidate && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000 }}>
          <div className="modal-content card" style={{ maxWidth: '600px', width: '100%', height: '100vh', overflowY: 'auto', padding: '2.5rem', borderTopRightRadius: 0, borderBottomRightRadius: 0, animation: 'slideIn 0.3s ease-out', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'var(--card-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600' }}>Candidate Profile Evaluation</h3>
              <button onClick={() => setSelectedCandidate(null)} style={{ background: 'none', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div className="applicant-avatar" style={{ width: '60px', height: '60px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedCandidate.avatar}
              </div>
              <div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>{selectedCandidate.name}</h4>
                <p style={{ color: 'var(--primary-color)', fontWeight: '500', margin: '0.25rem 0' }}>{selectedCandidate.role}</p>
                <span className={`status-badge status-${selectedCandidate.status.toLowerCase().replace(' ', '-')}`}>
                  {selectedCandidate.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.95rem' }}>
              <div>
                <h5 style={{ fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>Contact Information</h5>
                <p>📧 <strong>Email:</strong> {selectedCandidate.email}</p>
                <p style={{ marginTop: '0.25rem' }}>📞 <strong>Contact:</strong> {selectedCandidate.contact}</p>
              </div>

              <div>
                <h5 style={{ fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>Education Details</h5>
                <p>🎓 <strong>Highest Qualification:</strong> {selectedCandidate.highestQualification}</p>
                <p style={{ marginTop: '0.25rem' }}>📚 <strong>Degree / Course:</strong> {selectedCandidate.degree}</p>
                <p style={{ marginTop: '0.25rem' }}>🏛️ <strong>College / University:</strong> {selectedCandidate.college}</p>
                <p style={{ marginTop: '0.25rem' }}>📅 <strong>Graduation Year:</strong> {selectedCandidate.gradYear}</p>
              </div>

              <div>
                <h5 style={{ fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>Skills</h5>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {selectedCandidate.skills.split(',').map(skill => (
                    <span key={skill} className="tag" style={{ margin: 0, fontSize: '0.8rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 style={{ fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>Areas of Interest</h5>
                <p>{selectedCandidate.interests}</p>
              </div>

              <div>
                <h5 style={{ fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>Work Experience</h5>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{selectedCandidate.experience}</p>
              </div>

              <div>
                <h5 style={{ fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>Uploaded Resume</h5>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-color)', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.85rem' }}>📄 {selectedCandidate.resumeName}</span>
                  <button 
                    className="btn-primary-small" 
                    onClick={(e) => handleDownloadResume(e, selectedCandidate.resumeName)}
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    View / Download
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', gap: '1rem' }}>
              <button 
                className="btn-secondary" 
                onClick={() => updateStatus(selectedCandidate.id, 'Rejected', { stopPropagation: () => {} })}
                style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--error-bg)', color: 'var(--error-color)', border: '1px solid #fecaca' }}
              >
                Reject Candidate
              </button>
              <button 
                className="btn-primary" 
                onClick={() => updateStatus(selectedCandidate.id, 'Interviewing', { stopPropagation: () => {} })}
                style={{ flex: 1, padding: '0.75rem' }}
              >
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerApplicants;
