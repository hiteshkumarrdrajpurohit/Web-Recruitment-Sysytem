import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications, getProfile } from '../../services/applicant';
import { AuthContext } from '../../App';

export default function MyApplications() {
  const { user } = useContext(AuthContext);
  const [applicant, setApplicant] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.token) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load user profile
      const profileResult = await getProfile();
      if (profileResult.success) {
        setApplicant(profileResult.data);
      }

      // Load applications
      const applicationsResult = await getMyApplications();
      if (applicationsResult.success) {
        setApplications(applicationsResult.data);
      } else {
        setError(applicationsResult.error || 'Failed to load applications');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'SUBMITTED' || app.status === 'APPLIED').length;
    const reviewed = applications.filter(app => app.status === 'UNDER_REVIEW' || app.status === 'REVIEWED').length;
    const shortlisted = applications.filter(app => app.status === 'SHORTLISTED').length;
    const interviewed = applications.filter(app => app.status === 'INTERVIEWED').length;
    const hired = applications.filter(app => app.status === 'SELECTED' || app.status === 'HIRED').length;
    const rejected = applications.filter(app => app.status === 'REJECTED').length;
    
    return { total, pending, reviewed, shortlisted, interviewed, hired, rejected };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SUBMITTED':
      case 'APPLIED':
        return 'bg-blue-100 text-blue-700';
      case 'UNDER_REVIEW':
      case 'REVIEWED':
        return 'bg-yellow-100 text-yellow-700';
      case 'SHORTLISTED':
        return 'bg-purple-100 text-purple-700';
      case 'INTERVIEWED':
        return 'bg-indigo-100 text-indigo-700';
      case 'SELECTED':
      case 'HIRED':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your applications...
      </div>
    );
  }

  if (!user?.token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Please log in to view your applications.
      </div>
    );
  }

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto px-2 pt-8">
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl">
            {error}
            <button 
              onClick={loadData}
              className="ml-2 text-red-500 hover:text-red-700 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Gradient Header */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white max-w-6xl mx-auto mt-8 mb-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-1">My Applications</h2>
        <p className="text-blue-100">Track the progress of your {stats.total} job application{stats.total !== 1 ? 's' : ''}</p>
      </div>

      

      {/* Filter Bar */}
      <div className="max-w-6xl mx-auto flex items-center gap-4 mb-4 px-2">
        <button className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-medium">All Applications</button>
        <span className="text-gray-500 text-sm">Showing {applications.length} of {applications.length} applications</span>
      </div>

      {/* Applications List */}
      <div className="max-w-6xl mx-auto mb-8 px-2">
        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="text-gray-400 text-lg mb-2">No Applications Yet</div>
            <p className="text-gray-500 mb-4">You haven't applied for any jobs yet.</p>
            <Link 
              to="/applicantlayout/user/jobs" 
              className="inline-block px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-lg">
                      {application.vacancy?.title || application.vacancyTitle || 'Position not specified'}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {application.vacancy?.department || 'Department not specified'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Applied on {formatDate(application.createdAt || application.appliedDate)}
                    </div>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-xs font-semibold ${getStatusColor(application.status)}`}>
                    {application.status || 'Pending'}
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-3 mb-4 text-gray-700 text-sm">
                  Application status: {application.status || 'Submitted'}
                  {application.vacancy?.location && (
                    <span className="ml-2 text-gray-500">• Location: {application.vacancy.location}</span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-semibold mb-2">Application Details</div>
                    {application.vacancy?.requirements && (
                      <div className="text-sm mb-2">
                        <span className="font-medium">Requirements:</span>
                        <div className="text-gray-700 mt-1">{application.vacancy.requirements}</div>
                      </div>
                    )}
                    {application.vacancy?.description && (
                      <div className="text-sm mb-2">
                        <span className="font-medium">Job Description:</span>
                        <div className="text-gray-700 mt-1">{application.vacancy.description}</div>
                      </div>
                    )}
                    {application.coverLetter && (
                      <div className="text-sm">
                        <span className="font-medium">Cover Letter:</span>
                        <div className="text-gray-700 mt-1 p-2 bg-gray-50 rounded-xl text-xs">
                          {application.coverLetter}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="font-semibold mb-2">Job Information</div>
                    <div className="text-sm space-y-1">
                      {application.vacancy?.type && (
                        <div><span className="font-medium">Type:</span> {application.vacancy.type}</div>
                      )}
                      {application.vacancy?.minSalary && application.vacancy?.maxSalary && (
                        <div>
                          <span className="font-medium">Salary:</span> 
                          ₹{application.vacancy.minSalary.toLocaleString()} - ₹{application.vacancy.maxSalary.toLocaleString()}
                        </div>
                      )}
                      {application.vacancy?.applicationDeadline && (
                        <div>
                          <span className="font-medium">Deadline:</span> 
                          {formatDate(application.vacancy.applicationDeadline)}
                        </div>
                      )}
                    </div>
                    
                    {/* User Profile Info */}
                    {applicant && (
                      <div className="mt-4">
                        <div className="font-semibold mb-2">Your Profile</div>
                        <div className="text-sm space-y-1">
                          <div><span className="font-medium">Name:</span> {applicant.firstName} {applicant.lastName}</div>
                          <div><span className="font-medium">Email:</span> {applicant.email}</div>
                          {applicant.phoneNumber && (
                            <div><span className="font-medium">Phone:</span> {applicant.phoneNumber}</div>
                          )}
                          {applicant.skills && (
                            <div>
                              <span className="font-medium">Skills:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {applicant.skills.split(',').map((skill, i) => (
                                  <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                                    {skill.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
