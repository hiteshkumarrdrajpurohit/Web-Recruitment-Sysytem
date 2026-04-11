import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Calendar,
  FileText,
  Mail,
  Phone,
  Award,
  AlertCircle,
  CheckCircle,
  Star,
  Send,
  
} from 'lucide-react';
import { getAllHirings, getAllApplications, getAllVacancies, getAllInterviews, createHiringDecision } from '../../services/hr';
import { toast } from 'react-toastify';

 function HRHirings() {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [hiringDecisions, setHiringDecisions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load all necessary data in parallel
      const [hiringsResult, applicationsResult, vacanciesResult, interviewsResult] = await Promise.all([
        getAllHirings(),
        getAllApplications(),
        getAllVacancies(),
        getAllInterviews()
      ]);

      if (hiringsResult.success) {
        setHiringDecisions(hiringsResult.data);
      } else {
        setError(hiringsResult.error || 'Failed to load hiring decisions');
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

      if (interviewsResult.success) {
        setInterviews(interviewsResult.data);
      } else {
        console.warn('Failed to load interviews:', interviewsResult.error);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Get applications ready for hiring decision (completed interviews)
  const candidatesForDecision = applications.filter(app => {
    const user = app.user || {};
    // Only consider applications from users with 'USER' role (exclude HR managers)
    if (user.role !== 'USER') {
      return false;
    }
    
    // Applications that have completed interviews and are ready for hiring decision
    const hasCompletedInterviews = interviews.some(interview => 
      interview.application?.id === app.id && interview.status === 'COMPLETED'
    );
    return hasCompletedInterviews && (app.status === 'SHORTLISTED' || app.status === 'UNDER_REVIEW' || app.status === 'INTERVIEWED');
  });

  // Get recently hired candidates (applications with SELECTED status)
  const recentHires = applications.filter(a => {
    const user = a.user || {};
    return user.role === 'USER' && a.status === 'SELECTED';
  });

  // Get rejected candidates (applications with REJECTED status) 
  const rejectedCandidates = applications.filter(a => {
    const user = a.user || {};
    return user.role === 'USER' && a.status === 'REJECTED';
  });

  const makeHiringDecision = async (decision) => {
    try {
      setError('');
      const result = await createHiringDecision(decision);
      
      if (result.success) {
        await loadData(); // Reload to get updated data
    setShowDecisionModal(false);
        setSelectedApplication(null);
        toast.success('Hiring decision submitted successfully!');
      } else {
        setError(result.error || 'Failed to submit hiring decision');
      }
    } catch (err) {
      console.error('Error making hiring decision:', err);
      setError('Failed to submit hiring decision');
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading hiring data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hiring Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Make hiring decisions and manage the final stages of recruitment.
          </p>
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

      <div className="mt-8">
        {/* Recent Hiring Decisions */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Decisions</h3>
            <p className="text-sm text-gray-600">Latest hiring outcomes</p>
          </div>
          <div className="p-6">
            {hiringDecisions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent decisions</p>
            ) : (
              <div className="space-y-4">
                {hiringDecisions.map((decision) => (
                  <DecisionCard 
                    key={decision.id} 
                    decision={decision}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Hiring Decision Modal */}
      {showDecisionModal && selectedApplication && (
        <HiringDecisionModal
          application={selectedApplication}
          interviews={interviews.filter(i => i.application?.id === selectedApplication.id)}
          onClose={() => {
            setShowDecisionModal(false);
            setSelectedApplication(null);
          }}
          onDecision={makeHiringDecision}
        />
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, color, description }) {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`${color} p-3 rounded-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-2xl font-bold text-gray-900">{value}</dd>
              <dd className="text-xs text-gray-500">{description}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}


function DecisionCard({ decision }) {
  const application = decision.application || {};
  const user = application.user || {};
  const vacancy = application.vacancy || {};
  
  const getDecisionColor = (decisionType) => {
    switch (decisionType) {
      case 'HIRE':
      case 'SELECTED': return 'text-green-600 bg-green-50 border-green-200';
      case 'REJECT':
      case 'REJECTED': return 'text-red-600 bg-red-50 border-red-200';
      case 'HOLD': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDecisionIcon = (decisionType) => {
    switch (decisionType) {
      case 'HIRE':
      case 'SELECTED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECT':
      case 'REJECTED': return <UserX className="h-4 w-4" />;
      case 'HOLD': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getDecisionDisplay = (decisionType) => {
    switch (decisionType) {
      case 'HIRE': 
      case 'SELECTED': return 'Hire';
      case 'REJECT':
      case 'REJECTED': return 'Reject';
      case 'HOLD': return 'Hold';
      default: return decisionType;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">
            {user.firstName || 'Unknown'} {user.lastName || 'User'}
          </h4>
          <p className="text-sm text-gray-600">{vacancy.title || 'Position not specified'}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDecisionColor(decision.decision)}`}>
          {getDecisionIcon(decision.decision)}
          <span className="ml-1">{getDecisionDisplay(decision.decision)}</span>
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-3">{decision.reason || 'No reason provided'}</p>

      {decision.decision === 'HIRE' && decision.salaryOffered && (
        <div className="flex items-center text-sm text-gray-600 mb-2">
          Salary Offered: ₹{decision.salaryOffered.toLocaleString('en-IN')}
        </div>
      )}

      {decision.startDate && (
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          Start Date: {new Date(decision.startDate).toLocaleDateString()}
        </div>
      )}

      <div className="text-xs text-gray-500">
        Decision made on {decision.createdAt || decision.decidedDate 
          ? new Date(decision.createdAt || decision.decidedDate).toLocaleDateString()
          : 'Date not available'}
      </div>
    </div>
  );
}

function HireCard({ application, decision }) {
  const user = application.user || {};
  const vacancy = application.vacancy || {};
  
  return (
    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
      <div className="flex items-center space-x-3 mb-3">
        <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-white">
            {(user.firstName?.[0] || 'U')}{(user.lastName?.[0] || 'U')}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">
            {user.firstName || 'Unknown'} {user.lastName || 'User'}
          </h4>
          <p className="text-sm text-gray-600">{vacancy.title || 'Position not specified'}</p>
        </div>
      </div>

      {decision?.salaryOffered && (
        <div className="flex items-center text-sm text-gray-700 mb-2">
          Salary Offered: ₹{decision.salaryOffered.toLocaleString('en-IN')}
        </div>
      )}

      {decision?.startDate && (
        <div className="flex items-center text-sm text-gray-700">
          <Calendar className="h-4 w-4 mr-2" />
          Starts: {new Date(decision.startDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

function HiringDecisionModal({ application, interviews, onClose, onDecision }) {
  const [formData, setFormData] = useState({
    decision: 'SELECTED',
    reason: '',
    salaryOffered: '',
    startDate: '',
    notes: ''
  });

  const user = application.user || {};
  const vacancy = application.vacancy || {};
  const completedInterviews = interviews.filter(i => i.status === 'COMPLETED');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const decision = {
      applicationId: application.id,
      vacancyId: application.vacancy?.id || application.vacancyId,
      decision: formData.decision, // Direct use of SELECTED, REJECTED, HOLD
      reason: formData.reason,
      salaryOffered: formData.salaryOffered ? parseInt(formData.salaryOffered) : (formData.decision === 'SELECTED' ? 500000 : 0),
      startDate: formData.startDate || (formData.decision === 'SELECTED' ? new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
      notes: formData.notes || `${formData.decision === 'SELECTED' ? 'Selected' : formData.decision === 'REJECTED' ? 'Rejected' : 'On hold'} based on interview evaluation.`,
      interviewerName: `HR Manager` // Will be set by backend from authenticated user
    };
    onDecision(decision);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Hiring Decision - {user.firstName || 'Unknown'} {user.lastName || 'User'}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            {/* Candidate Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Candidate Summary</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Position:</span>
                  <span className="ml-2 text-sm text-gray-900">{vacancy.title || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-sm text-gray-900">{user.email || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Phone:</span>
                  <span className="ml-2 text-sm text-gray-900">{user.phoneNumber || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Application Date:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {new Date(application.createdAt || application.applicationDate).toLocaleDateString()}
                  </span>
                </div>
                {application.coverLetter && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Cover Letter:</span>
                    <p className="ml-2 text-sm text-gray-900 mt-1 line-clamp-3">{application.coverLetter}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Interview Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Interview Summary</h4>
              <div className="space-y-3">
                {completedInterviews.length === 0 ? (
                  <p className="text-sm text-gray-500">No completed interviews found</p>
                ) : (
                  completedInterviews.map((interview, index) => (
                    <div key={interview.id} className="text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          {interview.type || 'Interview'} - {new Date(interview.scheduledDate).toLocaleDateString()}
                        </span>
                        <span className="text-gray-900">Completed</span>
                      </div>
                      <p className="text-gray-600 text-xs mt-1">
                        Interviewer: {interview.interviewer || 'Not specified'}
                      </p>
                      {interview.notes && (
                        <p className="text-gray-600 text-xs mt-1">{interview.notes}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: 'SELECTED', label: 'Selected', icon: UserCheck },
                  { value: 'REJECTED', label: 'Rejected', icon: UserX },
                  { value: 'HOLD', label: 'Hold', icon: Clock }
                ]).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, decision: option.value })}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                      formData.decision === option.value
                        ? option.value === 'SELECTED' ? 'border-green-500 bg-green-50 text-green-700'
                          : option.value === 'REJECTED' ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <option.icon className="h-5 w-5 mx-auto mb-1" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Reason for Decision</label>
              <textarea
                required
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide detailed reasoning for your decision..."
              />
            </div>

            {formData.decision === 'SELECTED' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Salary Offer (₹)</label>
                  <input
                    type="number"
                    value={formData.salaryOffered}
                    onChange={(e) => setFormData({ ...formData, salaryOffered: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2500000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Proposed Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional notes or next steps..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2 inline" />
                Submit Decision
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HRHirings;