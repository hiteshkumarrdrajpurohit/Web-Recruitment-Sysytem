import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, UserCheck, UserX } from 'lucide-react';
import { getAllApplications, updateApplicationStatus, getAllVacancies, getAllCandidates, createHiringDecision } from '../../services/hr';
import { toast } from 'react-toastify';

function HRApplicants() {
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Debug: Make sure no variable conflicts exist
  console.log('HR Applicants component loaded - no selectedApplication variable');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load candidates, applications, and vacancies in parallel
      const [candidatesResult, applicationsResult, vacanciesResult] = await Promise.all([
        getAllCandidates(),
        getAllApplications(),
        getAllVacancies()
      ]);

      if (candidatesResult.success) {
        setCandidates(candidatesResult.data);
      } else {
        setError(candidatesResult.error || 'Failed to load candidates');
      }

      if (applicationsResult.success) {
        setApplications(applicationsResult.data);
      } else {
        console.warn('Failed to load applications:', applicationsResult.error);
      }

      if (vacanciesResult.success) {
        setVacancies(vacanciesResult.data);
      } else {
        console.warn('Failed to load vacancies:', vacanciesResult.error);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    // Candidates are already filtered by USER role on the backend
    
    const matchesSearch =
      (candidate.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate.skills || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate.designation || '').toLowerCase().includes(searchTerm.toLowerCase());

    // Get the candidate's applications to determine their status
    const candidateApplications = applications.filter(app => app.user?.id === candidate.id);
    const hasApplications = candidateApplications.length > 0;
    
    // Determine candidate status based on their most recent application
    let candidateStatus = 'No Applications';
    if (hasApplications) {
      const latestApp = candidateApplications[candidateApplications.length - 1];
      candidateStatus = latestApp.status === 'APPLIED' ? 'Applied' :
                       latestApp.status === 'REVIEWED' ? 'Reviewed' :
                       latestApp.status === 'SHORTLISTED' ? 'Shortlisted' :
                       latestApp.status === 'REJECTED' ? 'Rejected' :
                       latestApp.status === 'ACCEPTED' ? 'Hired' : latestApp.status;
    }

    const matchesFilter = filterStatus === 'All' || 
                          candidateStatus === filterStatus ||
                          (filterStatus === 'Multiple Applications' && candidateApplications.length > 1);
    return matchesSearch && matchesFilter;
  });

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setError('');
      
      // Map frontend status to backend status
      const backendStatus = newStatus === 'Applied' ? 'SUBMITTED' :
                           newStatus === 'Reviewed' ? 'UNDER_REVIEW' :
                           newStatus === 'Shortlisted' ? 'SHORTLISTED' :
                           newStatus === 'Rejected' ? 'REJECTED' :
                           newStatus === 'Hired' ? 'SELECTED' :
                           newStatus === 'ACCEPTED' ? 'SELECTED' : newStatus.toUpperCase();

      const result = await updateApplicationStatus(applicationId, backendStatus);
      
      if (result.success) {
        // Reload data to get updated information
        await loadData();
        toast.success(`Application status updated to ${newStatus} successfully!`);
      } else {
        setError(result.error || 'Failed to update application status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update application status');
    }
  };

  const handleHiringDecision = async (applicationId, decision) => {
    try {
      setError('');
      
      // Find the application to get vacancy details
      const application = applications.find(app => app.id === applicationId);
      if (!application) {
        setError('Application not found');
        return;
      }

      const decisionData = {
        applicationId: applicationId,
        decision: decision, // SELECTED, REJECTED, HOLD
        notes: `${decision === 'SELECTED' ? 'Selected' : decision === 'REJECTED' ? 'Rejected' : 'On hold'} via applicants management.`
      };

      const result = await createHiringDecision(decisionData);
      
      if (result.success) {
        // Also update application status if SELECTED or REJECTED
        if (decision === 'SELECTED') {
          await updateApplicationStatus(applicationId, 'SELECTED');
        } else if (decision === 'REJECTED') {
          await updateApplicationStatus(applicationId, 'REJECTED');
        }
        
        await loadData();
        toast.success(`Hiring decision "${decision}" created successfully!`);
      } else {
        setError(result.error || 'Failed to create hiring decision');
      }
    } catch (err) {
      console.error('Error creating hiring decision:', err);
      setError('Failed to create hiring decision');
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <div className="mt-2 space-y-1">
            {(() => {
              const multipleApplicants = candidates.filter(candidate => {
                const candidateApplications = applications.filter(app => app.user?.id === candidate.id);
                return candidateApplications.length > 1;
              });
              const totalApplications = applications.filter(app => app.user?.role === 'USER').length;
              return multipleApplicants.length > 0 ;
            })()}
          </div>
        </div>
        
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto"
            >
              <option value="All">All Status</option>
              <option value="Multiple Applications">Multiple Applications</option>
              <option value="No Applications">No Applications</option>
              <option value="Applied">Applied</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              {searchTerm || filterStatus !== "All" ? 
                'No candidates found matching your criteria' : 
                'No candidates available'
              }
            </div>
            {searchTerm || filterStatus !== "All" ? (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('All');
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear filters to see all candidates
              </button>
            ) : (
              <p className="text-gray-500">All candidates with USER role will appear here.</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map(candidate => {
                  const candidateApplications = applications.filter(app => app.user?.id === candidate.id);
                  const hasApplications = candidateApplications.length > 0;
                  const latestApp = hasApplications ? candidateApplications[candidateApplications.length - 1] : null;
                  
                  let displayStatus = 'No Applications';
                  if (hasApplications) {
                    displayStatus = latestApp.status === 'APPLIED' ? 'Applied' :
                                   latestApp.status === 'REVIEWED' ? 'Reviewed' :
                                   latestApp.status === 'SHORTLISTED' ? 'Shortlisted' :
                                   latestApp.status === 'REJECTED' ? 'Rejected' :
                                   latestApp.status === 'ACCEPTED' ? 'Hired' : latestApp.status;
                  }
                  
                  return (
                    <tr key={candidate.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedCandidate(candidate)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {(candidate.firstName?.[0] || 'U')}{(candidate.lastName?.[0] || 'U')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {candidate.firstName || 'Unknown'} {candidate.lastName || 'User'}
                            </div>
                            <div className="text-sm text-gray-500">{candidate.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{candidate.skills || 'Not specified'}</td>
                      <td className="px-6 py-4">
                        {hasApplications ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                candidateApplications.length > 1 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {candidateApplications.length} Job{candidateApplications.length > 1 ? 's' : ''}
                              </span>
                              {candidateApplications.length > 1 && (
                                <span className="text-xs text-blue-600 font-medium">Multiple Applications</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 space-y-0.5">
                              {candidateApplications.slice(0, 2).map((app, idx) => {
                                const vacancy = app.vacancy || {};
                                return (
                                  <div key={app.id}>
                                    • {vacancy.title || 'Position not specified'}
                                  </div>
                                );
                              })}
                              {candidateApplications.length > 2 && (
                                <div className="text-blue-600">
                                  +{candidateApplications.length - 2} more...
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No applications</span>
                        )}
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={displayStatus} /></td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(candidate.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedCandidate(candidate); }} 
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {hasApplications && (
                          <>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(latestApp.id, 'Shortlisted'); }} 
                              className="text-green-600 hover:text-green-900"
                              title="Shortlist"
                            >
                              <UserCheck className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(latestApp.id, 'Rejected'); }} 
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <UserX className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          applications={applications.filter(app => app.user?.id === selectedCandidate.id)}
          onClose={() => setSelectedCandidate(null)}
          onUpdateStatus={handleUpdateStatus}
          onHiringDecision={handleHiringDecision}
          vacancies={vacancies}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'No Applications': return 'bg-gray-100 text-gray-600';
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Reviewed': return 'bg-purple-100 text-purple-800';
      case 'Shortlisted': return 'bg-yellow-100 text-yellow-800';
      case 'Interview Scheduled': return 'bg-indigo-100 text-indigo-800';
      case 'Interviewed': return 'bg-indigo-100 text-indigo-800';
      case 'Hired': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>{status}</span>;
}

function CandidateDetailModal({ candidate, applications, onClose, onUpdateStatus, onHiringDecision, vacancies }) {
  const hasApplications = applications.length > 0;
  const latestApp = hasApplications ? applications[applications.length - 1] : null;
  
  let displayStatus = 'No Applications';
  if (hasApplications) {
    displayStatus = latestApp.status === 'APPLIED' ? 'Applied' :
                   latestApp.status === 'REVIEWED' ? 'Reviewed' :
                   latestApp.status === 'SHORTLISTED' ? 'Shortlisted' :
                   latestApp.status === 'REJECTED' ? 'Rejected' :
                   latestApp.status === 'ACCEPTED' ? 'Hired' : latestApp.status;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg relative max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">
            ✕
          </button>
          <h2 className="text-xl font-semibold">
            {candidate.firstName || 'Unknown'} {candidate.lastName || 'User'}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Email:</span> {candidate.email || 'Not provided'}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Phone:</span> {candidate.phoneNumber || 'Not provided'}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Skills:</span> {candidate.skills || 'Not specified'}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Designation:</span> {candidate.designation || 'Not specified'}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Location:</span> {candidate.city || 'Not specified'}, {candidate.state || 'Not specified'}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Application Status:</span> 
            <span className="ml-2"><StatusBadge status={displayStatus} /></span>
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Registered:</span> {new Date(candidate.createdAt).toLocaleDateString()}
          </p>
          {candidate.summary && (
            <div className="mt-3">
              <p className="text-sm text-gray-700 font-medium">Summary:</p>
              <div className="mt-1 p-3 bg-gray-50 rounded text-sm text-gray-700">
                {candidate.summary}
              </div>
            </div>
          )}
          {hasApplications && (
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm text-gray-700 font-medium">Applications ({applications.length}):</p>
                {applications.length > 1 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Multiple Jobs
                  </span>
                )}
              </div>
              <div className="mt-1 space-y-2">
                {applications.map(app => {
                  const vacancy = app.vacancy || {};
                  const appStatus = app.status === 'APPLIED' ? 'Applied' :
                                  app.status === 'REVIEWED' ? 'Reviewed' :
                                  app.status === 'SHORTLISTED' ? 'Shortlisted' :
                                  app.status === 'REJECTED' ? 'Rejected' :
                                  app.status === 'ACCEPTED' ? 'Hired' : app.status;
                  return (
                    <div key={app.id} className="p-3 bg-gray-50 rounded text-sm border-l-4 border-blue-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <span className="font-medium">{vacancy.title || 'Position not specified'}</span>
                          {vacancy.department && (
                            <div className="text-xs text-gray-600 mt-0.5">
                              {vacancy.department} {vacancy.location && ` • ${vacancy.location}`}
                            </div>
                          )}
                        </div>
                        <StatusBadge status={appStatus} />
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-3 flex justify-between">
                        <span>Applied: {app.createdAt || app.applicationDate 
                          ? new Date(app.createdAt || app.applicationDate).toLocaleDateString() 
                          : 'Date not available'}</span>
                        {app.coverLetter && (
                          <span className="text-blue-600">📄 Has cover letter</span>
                        )}
                      </div>

                      {/* Application Status buttons */}
                      <div className="mb-2">
                        <p className="text-xs text-gray-600 mb-1">Application Status:</p>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(app.id, 'UNDER_REVIEW'); }}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                            disabled={app.status === 'UNDER_REVIEW'}
                          >
                            Mark Review
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(app.id, 'SHORTLISTED'); }}
                            className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600 disabled:opacity-50"
                            disabled={app.status === 'SHORTLISTED'}
                          >
                            Shortlist
                          </button>
                        </div>
                      </div>

                      {/* Hiring Decision buttons (Decision enum) */}
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Hiring Decision:</p>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={(e) => { e.stopPropagation(); onHiringDecision(app.id, 'SELECTED'); }}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50 border border-green-600"
                            title="Make hiring decision: SELECTED"
                          >
                            ✓ SELECTED
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onHiringDecision(app.id, 'REJECTED'); }}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50 border border-red-600"
                            title="Make hiring decision: REJECTED"
                          >
                            ✗ REJECTED
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onHiringDecision(app.id, 'HOLD'); }}
                            className="bg-yellow-600 text-white px-2 py-1 rounded text-xs hover:bg-yellow-700 disabled:opacity-50 border border-yellow-600"
                            title="Make hiring decision: HOLD"
                          >
                            ⏸ HOLD
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}


export default HRApplicants;