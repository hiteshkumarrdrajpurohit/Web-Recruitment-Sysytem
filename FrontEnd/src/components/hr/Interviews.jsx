import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Briefcase, 
  Video, 
  Building, 
  Search, 
  
  Edit3, 
  Trash2, 
  Eye, 
  Star,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  MoreVertical
} from 'lucide-react';
import { 
  getAllInterviews, 
  getAllApplications, 
  getAllVacancies, 
  scheduleInterview, 
  updateInterviewStatus, 
  updateInterview, 
  deleteInterview, 
  getInterviewById,
  getAllCandidates 
} from '../../services/hr';
import { toast } from 'react-toastify';

export function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInterviews, setSelectedInterviews] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [sortBy, setSortBy] = useState('scheduledDate');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load interviews, applications, vacancies, and candidates in parallel
      const [interviewsResult, applicationsResult, vacanciesResult, candidatesResult] = await Promise.all([
        getAllInterviews(),
        getAllApplications(),
        getAllVacancies(),
        getAllCandidates()
      ]);

      if (interviewsResult.success) {
        setInterviews(interviewsResult.data);
      } else {
        setError(interviewsResult.error || 'Failed to load interviews');
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

      if (candidatesResult.success) {
        setCandidates(candidatesResult.data);
      } else {
        console.warn('Failed to load candidates:', candidatesResult.error);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

    const handleScheduleInterview = async (interviewData) => {
    try {
      setError('');
      
      // If we have candidateId and vacancyId, we need to first find or create an application
      if (interviewData.candidateId && interviewData.vacancyId) {
        // Try to find existing application for this candidate and vacancy
        const existingApplication = applications.find(app => 
          app.user?.id === parseInt(interviewData.candidateId) && 
          app.vacancy?.id === parseInt(interviewData.vacancyId)
        );
        
        if (existingApplication) {
          // Use existing application
          const finalInterviewData = {
            applicationId: existingApplication.id,
            type: interviewData.type,
            scheduledDateTime: interviewData.scheduledDateTime,
            interviewerName: interviewData.interviewerName,
            location: interviewData.location,
            meetUrl: interviewData.meetUrl,
            notes: interviewData.notes
          };
          
          const result = await scheduleInterview(finalInterviewData);
          
          if (result.success) {
            await loadData();
            setShowScheduleModal(false);
            toast.success('Interview scheduled successfully!');
          } else {
            setError(result.error || 'Failed to schedule interview');
          }
        } else {
          // For now, show message that candidate must apply first
          setError('This candidate must apply for the position before an interview can be scheduled. Please ask them to submit an application first.');
        }
      } else {
        // Handle regular application-based interview scheduling
        const result = await scheduleInterview(interviewData);
        
        if (result.success) {
          await loadData();
          setShowScheduleModal(false);
          toast.success('Interview scheduled successfully!');
        } else {
          setError(result.error || 'Failed to schedule interview');
        }
      }
    } catch (err) {
      console.error('Error scheduling interview:', err);
      setError('Failed to schedule interview');
    }
  };

  const handleUpdateInterviewStatus = async (interviewId, newStatus) => {
    try {
      setError('');
      const result = await updateInterviewStatus(interviewId, newStatus);
      
      if (result.success) {
        await loadData(); // Reload to get updated list
        toast.success(`Interview status updated to ${newStatus} successfully!`);
      } else {
        setError(result.error || 'Failed to update interview status');
      }
    } catch (err) {
      console.error('Error updating interview status:', err);
      setError('Failed to update interview status');
    }
  };

  const handleEditInterview = async (interviewData) => {
    try {
      setError('');
      const result = await updateInterview(selectedInterview.id, interviewData);
      
      if (result.success) {
        await loadData();
        setShowEditModal(false);
        setSelectedInterview(null);
        toast.success('Interview updated successfully!');
      } else {
        setError(result.error || 'Failed to update interview');
      }
    } catch (err) {
      console.error('Error updating interview:', err);
      setError('Failed to update interview');
    }
  };

  const handleDeleteInterview = async (interviewId) => {
    try {
      setError('');
      const result = await deleteInterview(interviewId);
      
      if (result.success) {
        await loadData();
        setShowDeleteModal(false);
        setSelectedInterview(null);
        toast.success('Interview deleted successfully!');
      } else {
        setError(result.error || 'Failed to delete interview');
      }
    } catch (err) {
      console.error('Error deleting interview:', err);
      setError('Failed to delete interview');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedInterviews.length === 0) {
      toast.warning('Please select interviews first');
      return;
    }

    try {
      setError('');
      for (const interviewId of selectedInterviews) {
        if (action === 'cancel') {
          await updateInterviewStatus(interviewId, 'CANCELLED');
        } else if (action === 'delete') {
          await deleteInterview(interviewId);
        }
      }
      await loadData();
      setSelectedInterviews([]);
      toast.success(`${action === 'cancel' ? 'Cancelled' : 'Deleted'} ${selectedInterviews.length} interviews successfully!`);
    } catch (err) {
      console.error(`Error with bulk ${action}:`, err);
      setError(`Failed to ${action} interviews`);
    }
  };

  const handleSelectInterview = (interviewId) => {
    setSelectedInterviews(prev => 
      prev.includes(interviewId) 
        ? prev.filter(id => id !== interviewId)
        : [...prev, interviewId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInterviews.length === filteredInterviews.length) {
      setSelectedInterviews([]);
    } else {
      setSelectedInterviews(filteredInterviews.map(interview => interview.id));
    }
  };

  const filteredAndSortedInterviews = interviews
    .filter(interview => {
      const application = interview.application || {};
      const user = application.user || {};
      const vacancy = application.vacancy || {};
      
      // Only show interviews for users with 'USER' role (exclude HR managers)
      if (user.role && user.role !== 'USER') {
        return false;
      }
      
      // Search filter
    const matchesSearch = !searchTerm || 
        `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vacancy.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (interview.interviewerName || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const interviewStatus = interview.status?.toLowerCase() || '';
      const matchesStatus = filterStatus === 'all' || interviewStatus === filterStatus;
      
      // Type filter
      const interviewType = interview.type?.toLowerCase() || '';
      const matchesType = filterType === 'all' || interviewType === filterType;
      
      // Date range filter
      let matchesDateRange = true;
      if (dateRange.start || dateRange.end) {
        const interviewDate = new Date(interview.scheduledDateTime);
        if (dateRange.start) {
          matchesDateRange = matchesDateRange && interviewDate >= new Date(dateRange.start);
        }
        if (dateRange.end) {
          matchesDateRange = matchesDateRange && interviewDate <= new Date(dateRange.end + 'T23:59:59');
        }
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDateRange;
    })
    .sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'scheduledDate':
          aVal = new Date(a.scheduledDateTime);
          bVal = new Date(b.scheduledDateTime);
          break;
        case 'candidateName':
          aVal = `${a.application?.user?.firstName || ''} ${a.application?.user?.lastName || ''}`;
          bVal = `${b.application?.user?.firstName || ''} ${b.application?.user?.lastName || ''}`;
          break;
        case 'position':
          aVal = a.application?.vacancy?.title || '';
          bVal = b.application?.vacancy?.title || '';
          break;
        case 'status':
          aVal = a.status || '';
          bVal = b.status || '';
          break;
        case 'type':
          aVal = a.type || '';
          bVal = b.type || '';
          break;
        default:
          return 0;
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const filteredInterviews = filteredAndSortedInterviews; // For backward compatibility

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading interviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="mt-2 text-sm text-gray-700">
            Schedule and manage interviews with candidates ({filteredInterviews.length} interviews)
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {viewMode === 'list' ? <Calendar className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
            {viewMode === 'list' ? 'Calendar' : 'List'} View
          </button>
          
          <button
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Interview
          </button>
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

      {/* Enhanced Filters */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filters & Controls</h3>
          <div className="flex space-x-2">
            {selectedInterviews.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('cancel')}
                  className="inline-flex items-center px-3 py-2 border border-orange-300 rounded-md text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Selected ({selectedInterviews.length})
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search interviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="video">Video</option>
            <option value="phone">Phone</option>
            <option value="in_person">In Person</option>
          </select>
          
          {/* Sort Options */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="scheduledDate-asc">Date: Earliest First</option>
            <option value="scheduledDate-desc">Date: Latest First</option>
            <option value="candidateName-asc">Candidate: A-Z</option>
            <option value="candidateName-desc">Candidate: Z-A</option>
            <option value="position-asc">Position: A-Z</option>
            <option value="status-asc">Status: A-Z</option>
          </select>
        </div>
        
        {/* Date Range Filter */}
        <div className="mt-4 flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setDateRange({ start: '', end: '' })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear Dates
            </button>
          </div>
        </div>
      </div>

      {/* Interview List */}
      <div className="mt-6">
        {filteredInterviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              {searchTerm || filterStatus !== "all" ? 
                'No interviews found matching your criteria' : 
                'No interviews scheduled'
              }
            </div>
            {searchTerm || filterStatus !== "all" ? (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear filters to see all interviews
              </button>
            ) : (
              <div>
                <p className="text-gray-500 mb-4">Schedule interviews with candidates to manage your recruitment process.</p>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule First Interview
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
          {/* Select All Checkbox */}
          <div className="mb-4 flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedInterviews.length === filteredInterviews.length && filteredInterviews.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Select All ({filteredInterviews.length} interviews)
              </span>
            </label>
          </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInterviews.map((interview) => {
              const application = interview.application || {};
              const user = application.user || {};
              const vacancy = application.vacancy || {};
            
            return (
              <div key={interview.id} className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedInterviews.includes(interview.id)}
                        onChange={() => handleSelectInterview(interview.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${interview.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                          interview.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          interview.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'}`}>
                        {interview.status === 'SCHEDULED' ? 'Scheduled' :
                         interview.status === 'COMPLETED' ? 'Completed' :
                         interview.status === 'CANCELLED' ? 'Cancelled' : interview.status}
                  </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {interview.type || 'Interview'}
                    </span>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {user.firstName || 'Unknown'} {user.lastName || 'Candidate'}
                </h3>
                  <p className="text-sm text-gray-600 mb-3">{vacancy.title || 'Position not specified'}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                      {interview.scheduledDateTime || interview.scheduledDate || interview.interviewDate 
                        ? new Date(interview.scheduledDateTime || interview.scheduledDate || interview.interviewDate).toLocaleDateString() 
                        : 'Date TBD'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                      {interview.scheduledDateTime || interview.scheduledDate || interview.interviewDate 
                        ? new Date(interview.scheduledDateTime || interview.scheduledDate || interview.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : 'Time TBD'}
                  </div>
                    {interview.interviewer && (
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    {interview.interviewer}
                  </div>
                    )}
                  <div className="flex items-center text-sm text-gray-500">
                      {interview.type === 'VIDEO' ? (
                      <>
                        <Video className="h-4 w-4 mr-2" />
                        Online Meeting
                      </>
                      ) : interview.type === 'IN_PERSON' ? (
                      <>
                        <Building className="h-4 w-4 mr-2" />
                          {interview.location || 'Location TBD'}
                        </>
                      ) : (
                        <>
                          <Briefcase className="h-4 w-4 mr-2" />
                          {interview.type || 'Interview'}
                      </>
                    )}
                  </div>
                </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedInterview(interview);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    
                    {interview.status === 'SCHEDULED' && (
                      <>
                        <button 
                          onClick={() => {
                            setSelectedInterview(interview);
                            setShowEditModal(true);
                          }}
                          className="flex-1 text-sm text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-md flex items-center justify-center"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                    <button 
                      onClick={() => {
                        setSelectedInterview(interview);
                        setShowResultModal(true);
                      }}
                          className="flex-1 text-sm text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-md flex items-center justify-center"
                    >
                          <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </button>
                      </>
                    )}
                    
                    {interview.status !== 'CANCELLED' && (
                    <button 
                      onClick={() => {
                          setSelectedInterview(interview);
                          setShowDeleteModal(true);
                        }}
                        className="text-sm text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
                  </div>
              </div>
            );
          })}
        </div>
          </>
        )}
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <ScheduleInterviewModal
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleInterview}
          applications={applications}
          vacancies={vacancies}
          candidates={candidates}
        />
      )}

      {/* Interview Result Modal */}
      {showResultModal && selectedInterview && (
        <InterviewResultModal
          interview={selectedInterview}
          onClose={() => {
            setShowResultModal(false);
            setSelectedInterview(null);
          }}
          onSubmit={async (result) => {
            try {
              await handleUpdateInterviewStatus(selectedInterview.id, 'COMPLETED');
            setShowResultModal(false);
            setSelectedInterview(null);
            } catch (err) {
              console.error('Error completing interview:', err);
              setError('Failed to complete interview');
            }
          }}
        />
      )}

      {/* Interview Details Modal */}
      {showDetailsModal && selectedInterview && (
        <InterviewDetailsModal
          interview={selectedInterview}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedInterview(null);
          }}
        />
      )}

      {/* Edit Interview Modal */}
      {showEditModal && selectedInterview && (
        <EditInterviewModal
          interview={selectedInterview}
          applications={applications}
          vacancies={vacancies}
          onClose={() => {
            setShowEditModal(false);
            setSelectedInterview(null);
          }}
          onSave={handleEditInterview}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedInterview && (
        <DeleteConfirmationModal
          interview={selectedInterview}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedInterview(null);
          }}
          onConfirm={() => handleDeleteInterview(selectedInterview.id)}
        />
      )}
    </div>
  );
}

function ScheduleInterviewModal({ onClose, onSchedule, applications, vacancies, candidates }) {
  const [formData, setFormData] = useState({
    mode: 'application', // 'application' or 'direct'
    applicationId: '',
    candidateId: '',
    vacancyId: '',
    type: 'VIDEO',
    scheduledDate: '',
    scheduledTime: '',
    interviewer: '',
    interviewerEmail: '',
    location: '',
    meetingLink: '',
    notes: ''
  });

  // Get selected details based on mode
  const selectedApplication = applications.find(app => app.id === parseInt(formData.applicationId));
  const selectedUser = selectedApplication?.user || {};
  const selectedCandidate = candidates.find(candidate => candidate.id === parseInt(formData.candidateId));
  const selectedVacancy = formData.mode === 'application' 
    ? selectedApplication?.vacancy 
    : vacancies.find(vacancy => vacancy.id === parseInt(formData.vacancyId));

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduledDateTime = new Date(formData.scheduledDate + 'T' + formData.scheduledTime);
    
    let interviewData;
    
    if (formData.mode === 'application') {
      // Application-based interview scheduling
      interviewData = {
        applicationId: formData.applicationId,
        type: formData.type,
        scheduledDateTime: scheduledDateTime.toISOString(),
        interviewerName: formData.interviewer,
        location: formData.location,
        meetUrl: formData.meetingLink,
        notes: formData.notes
      };
    } else {
      // Direct candidate + vacancy scheduling
      interviewData = {
        candidateId: formData.candidateId,
        vacancyId: formData.vacancyId,
        type: formData.type,
        scheduledDateTime: scheduledDateTime.toISOString(),
        interviewerName: formData.interviewer,
        location: formData.location,
        meetUrl: formData.meetingLink,
        notes: formData.notes
      };
    }
    
    onSchedule(interviewData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Schedule Interview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

                <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Mode Selection */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">Interview Scheduling Mode</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="application"
                    checked={formData.mode === 'application'}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value, candidateId: '', vacancyId: '', applicationId: '' })}
                    className="mr-2"
                  />
                  <span className="text-sm">📝 From Applications (Recommended)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="direct"
                    checked={formData.mode === 'direct'}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value, candidateId: '', vacancyId: '', applicationId: '' })}
                    className="mr-2"
                  />
                  <span className="text-sm">👤 Direct Candidate Selection</span>
                </label>
              </div>
            </div>

            {/* Application-based Selection */}
            {formData.mode === 'application' && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Application
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  required
                  value={formData.applicationId}
                  onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select an application for interview</option>
                  {applications
                    .filter(app => {
                      const user = app.user || {};
                      return user.role === 'USER' && (app.status === 'SHORTLISTED' || app.status === 'REVIEWED');
                    }).length === 0 ? (
                    <option disabled>No eligible applications available</option>
                  ) : (
                    applications
                      .filter(app => {
                        const user = app.user || {};
                        return user.role === 'USER' && (app.status === 'SHORTLISTED' || app.status === 'REVIEWED');
                      })
                      .map((application) => {
                        const user = application.user || {};
                        const vacancy = application.vacancy || {};
                        return (
                          <option key={application.id} value={application.id}>
                            👤 {user.firstName || 'Unknown'} {user.lastName || 'User'} → 💼 {vacancy.title || 'Position'} ({application.status})
                          </option>
                        );
                      })
                  )}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Candidates who have applied and been shortlisted or reviewed.
                </p>
              </div>
            )}

            {/* Direct Candidate Selection */}
            {formData.mode === 'direct' && (
              <>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Candidate
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    required
                    value={formData.candidateId}
                    onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a candidate for interview</option>
                    {candidates.length === 0 ? (
                      <option disabled>No candidates available</option>
                    ) : (
                      candidates.map((candidate) => (
                        <option key={candidate.id} value={candidate.id}>
                          👤 {candidate.firstName || 'Unknown'} {candidate.lastName || 'User'} - {candidate.email}
                        </option>
                      ))
                    )}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    All users with 'USER' role from the database.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Position
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    required
                    value={formData.vacancyId}
                    onChange={(e) => setFormData({ ...formData, vacancyId: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select position for interview</option>
                    {vacancies.length === 0 ? (
                      <option disabled>No positions available</option>
                    ) : (
                      vacancies
                        .filter(vacancy => vacancy.status === 'ACTIVE')
                        .map((vacancy) => (
                          <option key={vacancy.id} value={vacancy.id}>
                            💼 {vacancy.title} - {vacancy.department} ({vacancy.location})
                          </option>
                        ))
                    )}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Only active job positions are available.
                  </p>
                </div>
              </>
            )}

            {/* Selected Information Display */}
            {((formData.mode === 'application' && selectedApplication) || 
              (formData.mode === 'direct' && (selectedCandidate || selectedVacancy))) && (
              <div className="sm:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-md font-medium text-blue-900 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Interview Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Display based on mode */}
                  {formData.mode === 'application' && selectedApplication && (
                    <>
                      <div>
                        <h5 className="font-medium text-blue-800 mb-2">👤 Candidate Information</h5>
                        <p className="text-sm"><span className="font-medium">Name:</span> {selectedUser.firstName} {selectedUser.lastName}</p>
                        <p className="text-sm"><span className="font-medium">Email:</span> {selectedUser.email}</p>
                        <p className="text-sm"><span className="font-medium">Phone:</span> {selectedUser.phoneNumber || 'Not provided'}</p>
                        <p className="text-sm"><span className="font-medium">Status:</span> 
                          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                            selectedApplication.status === 'SHORTLISTED' ? 'bg-yellow-100 text-yellow-800' :
                            selectedApplication.status === 'REVIEWED' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedApplication.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-blue-800 mb-2">💼 Position Information</h5>
                        <p className="text-sm"><span className="font-medium">Position:</span> {selectedVacancy.title}</p>
                        <p className="text-sm"><span className="font-medium">Department:</span> {selectedVacancy.department}</p>
                        <p className="text-sm"><span className="font-medium">Location:</span> {selectedVacancy.location}</p>
                        <p className="text-sm"><span className="font-medium">Applied:</span> {
                          selectedApplication.createdAt ? 
                            new Date(selectedApplication.createdAt).toLocaleDateString() : 
                            'Date not available'
                        }</p>
                      </div>
                    </>
                  )}
                  
                  {formData.mode === 'direct' && (
                    <>
                      {selectedCandidate && (
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">👤 Candidate Information</h5>
                          <p className="text-sm"><span className="font-medium">Name:</span> {selectedCandidate.firstName} {selectedCandidate.lastName}</p>
                          <p className="text-sm"><span className="font-medium">Email:</span> {selectedCandidate.email}</p>
                          <p className="text-sm"><span className="font-medium">Phone:</span> {selectedCandidate.phoneNumber || 'Not provided'}</p>
                          <p className="text-sm"><span className="font-medium">Skills:</span> {selectedCandidate.skills || 'Not specified'}</p>
                        </div>
                      )}
                      {selectedVacancy && (
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">💼 Position Information</h5>
                          <p className="text-sm"><span className="font-medium">Position:</span> {selectedVacancy.title}</p>
                          <p className="text-sm"><span className="font-medium">Department:</span> {selectedVacancy.department}</p>
                          <p className="text-sm"><span className="font-medium">Location:</span> {selectedVacancy.location}</p>
                          <p className="text-sm"><span className="font-medium">Salary Range:</span> 
                            {selectedVacancy.minSalary && selectedVacancy.maxSalary ? 
                              `₹${selectedVacancy.minSalary.toLocaleString('en-IN')} - ₹${selectedVacancy.maxSalary.toLocaleString('en-IN')}` :
                              'Not disclosed'
                            }
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {/* Warning for direct mode */}
                {formData.mode === 'direct' && selectedCandidate && selectedVacancy && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs text-yellow-800">
                      ⚠️ <strong>Note:</strong> This candidate hasn't applied for this position yet. 
                      The interview will be scheduled, but you may want to confirm their interest first.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Interview Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Interview Type</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="VIDEO">Video Interview</option>
                <option value="IN_PERSON">In-person Interview</option>
                <option value="PHONE">Phone Interview</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                required
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                required
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>



            {/* Interviewer */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Interviewer Name</label>
              <input
                type="text"
                required
                value={formData.interviewer}
                onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Interviewer Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Interviewer Email</label>
              <input
                type="email"
                required
                value={formData.interviewerEmail}
                onChange={(e) => setFormData({ ...formData, interviewerEmail: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Location/Meeting Link based on type */}
            {formData.type === 'IN_PERSON' ? (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Conference Room A, 3rd Floor"
                />
              </div>
            ) : formData.type === 'VIDEO' && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Meeting Link</label>
                <input
                  type="url"
                  required
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., https://zoom.us/j/123456789"
                />
              </div>
            )}

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional notes or instructions..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Schedule Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InterviewResultModal({ interview, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    rating: 3,
    feedback: '',
    recommendation: 'Consider',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Interview Result</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`p-1 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recommendation</label>
            <select
              value={formData.recommendation}
              onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Hire">Hire</option>
              <option value="Consider">Consider</option>
              <option value="Reject">Reject</option>
            </select>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
            <textarea
              required
              rows="3"
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide detailed feedback about the interview..."
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional notes or observations..."
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Result
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Interview Details Modal
function InterviewDetailsModal({ interview, onClose }) {
  const application = interview.application || {};
  const user = application.user || {};
  const vacancy = application.vacancy || {};

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Interview Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Candidate Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Candidate Information
            </h4>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Phone:</span> {user.phoneNumber || 'Not provided'}</p>
              <p><span className="font-medium">Experience:</span> {user.experience || 'Not specified'}</p>
              <p><span className="font-medium">Skills:</span> {user.skills || 'Not specified'}</p>
            </div>
          </div>

          {/* Position Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Position Information
            </h4>
            <div className="space-y-2">
              <p><span className="font-medium">Position:</span> {vacancy.title}</p>
              <p><span className="font-medium">Department:</span> {vacancy.department}</p>
              <p><span className="font-medium">Location:</span> {vacancy.location}</p>
              <p><span className="font-medium">Salary Range:</span> 
                {vacancy.minSalary && vacancy.maxSalary ? 
                  `₹${vacancy.minSalary.toLocaleString('en-IN')} - ₹${vacancy.maxSalary.toLocaleString('en-IN')}` :
                  'Not disclosed'
                }
              </p>
            </div>
          </div>

          {/* Interview Details */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Interview Details
            </h4>
            <div className="space-y-2">
              <p><span className="font-medium">Date & Time:</span> 
                {interview.scheduledDateTime ? 
                  new Date(interview.scheduledDateTime).toLocaleString() : 
                  'Not scheduled'
                }
              </p>
              <p><span className="font-medium">Type:</span> {interview.type}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  interview.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                  interview.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  interview.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {interview.status}
                </span>
              </p>
              <p><span className="font-medium">Interviewer:</span> {interview.interviewerName || 'Not assigned'}</p>
              {interview.location && (
                <p><span className="font-medium">Location:</span> {interview.location}</p>
              )}
              {interview.meetUrl && (
                <p><span className="font-medium">Meeting Link:</span> 
                  <a href={interview.meetUrl} target="_blank" rel="noopener noreferrer" 
                     className="ml-2 text-blue-600 hover:text-blue-800">
                    Join Meeting
                  </a>
                </p>
              )}
              {interview.duration && (
                <p><span className="font-medium">Duration:</span> {interview.duration} minutes</p>
              )}
            </div>
          </div>

          {/* Feedback (if available) */}
          {interview.feedback && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Interview Feedback
              </h4>
              <p className="text-gray-700">{interview.feedback}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Edit Interview Modal
function EditInterviewModal({ interview, applications, vacancies, onClose, onSave }) {
  const [formData, setFormData] = useState({
    applicationId: interview.applicationId || '',
    type: interview.type || 'VIDEO',
    scheduledDate: interview.scheduledDateTime ? new Date(interview.scheduledDateTime).toISOString().split('T')[0] : '',
    scheduledTime: interview.scheduledDateTime ? new Date(interview.scheduledDateTime).toTimeString().slice(0,5) : '',
    interviewer: interview.interviewerName || '',
    location: interview.location || '',
    meetingLink: interview.meetUrl || '',
    duration: interview.duration || 60,
    notes: interview.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduledDateTime = new Date(formData.scheduledDate + 'T' + formData.scheduledTime);
    onSave({
      ...formData,
      scheduledDateTime: scheduledDateTime.toISOString(),
    });
  };

  const eligibleApplications = applications.filter(app => 
    app.user?.role === 'USER' && 
    ['SHORTLISTED', 'REVIEWED'].includes(app.status)
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Edit Interview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Application Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application</label>
              <select
                required
                value={formData.applicationId}
                onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Application</option>
                {eligibleApplications.map(app => (
                  <option key={app.id} value={app.id}>
                    {app.user?.firstName} {app.user?.lastName} - {app.vacancy?.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Interview Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="VIDEO">Video Call</option>
                <option value="PHONE">Phone Call</option>
                <option value="IN_PERSON">In Person</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                required
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                required
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            {/* Interviewer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interviewer Name</label>
              <input
                type="text"
                required
                value={formData.interviewer}
                onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter interviewer name"
              />
            </div>
          </div>

          {/* Conditional Fields */}
          {formData.type === 'VIDEO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link</label>
              <input
                type="url"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://meet.google.com/... or https://zoom.us/..."
              />
            </div>
          )}

          {formData.type === 'IN_PERSON' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Office address or meeting room"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any additional notes for the interview..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Update Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmationModal({ interview, onClose, onConfirm }) {
  const application = interview.application || {};
  const user = application.user || {};
  const vacancy = application.vacancy || {};

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Delete Interview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-sm text-gray-500 text-center mb-4">
            Are you sure you want to delete this interview? This action cannot be undone.
          </p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-600">{vacancy.title}</p>
            <p className="text-xs text-gray-500">
              {interview.scheduledDateTime ? 
                new Date(interview.scheduledDateTime).toLocaleString() : 
                'Not scheduled'
              }
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Delete Interview
          </button>
        </div>
      </div>
    </div>
  );
}

export default Interviews;