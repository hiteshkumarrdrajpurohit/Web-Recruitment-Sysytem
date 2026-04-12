import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Calendar, TrendingUp, Plus, ArrowRight, Target } from 'lucide-react';
import { useAuth } from '../../App';
import { getHRDashboardStats, getAllApplications, getAllInterviews, getAllVacancies } from '../../services/hr';

function StatusBadge({ status }) {
  let colorClass = 'bg-gray-300 text-gray-700';
  
  // Map backend status to display colors
  const normalizedStatus = status?.toString().toUpperCase();
  if (normalizedStatus === 'SELECTED' || normalizedStatus === 'ACCEPTED' || normalizedStatus === 'ACTIVE') {
    colorClass = 'bg-green-100 text-green-800';
  } else if (normalizedStatus === 'SUBMITTED' || normalizedStatus === 'PENDING' || normalizedStatus === 'APPLIED') {
    colorClass = 'bg-yellow-100 text-yellow-800';
  } else if (normalizedStatus === 'UNDER_REVIEW' || normalizedStatus === 'REVIEWED') {
    colorClass = 'bg-blue-100 text-blue-800';
  } else if (normalizedStatus === 'SHORTLISTED') {
    colorClass = 'bg-purple-100 text-purple-800';
  } else if (normalizedStatus === 'INTERVIEWED') {
    colorClass = 'bg-indigo-100 text-indigo-800';
  } else if (normalizedStatus === 'REJECTED' || normalizedStatus === 'CANCELLED') {
    colorClass = 'bg-red-100 text-red-800';
  } else if (normalizedStatus === 'SCHEDULED') {
    colorClass = 'bg-blue-100 text-blue-800';
  }

  // Display friendly status names
  const displayStatus = status === 'SUBMITTED' ? 'Submitted' :
                       status === 'UNDER_REVIEW' ? 'Under Review' :
                       status === 'SHORTLISTED' ? 'Shortlisted' :
                       status === 'INTERVIEWED' ? 'Interviewed' :
                       status === 'SELECTED' ? 'Hired' :
                       status === 'ACCEPTED' ? 'Hired' :
                       status === 'REJECTED' ? 'Rejected' :
                       status === 'PENDING' ? 'Pending' :
                       status === 'SCHEDULED' ? 'Scheduled' :
                       status === 'ACTIVE' ? 'Active' : status;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}
    >
      {displayStatus}
    </span>
  );
}

function HRDashboard() {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load dashboard stats, recent applications, and upcoming interviews in parallel
      const [statsResult, applicationsResult, interviewsResult] = await Promise.all([
        getHRDashboardStats(),
        getAllApplications(),
        getAllInterviews()
      ]);

      if (statsResult.success) {
        setDashboardStats(statsResult.data);
      } else {
        console.warn('Failed to load dashboard stats:', statsResult.error);
      }

      if (applicationsResult.success) {
        // Get the 5 most recent applications
        const sortedApplications = applicationsResult.data
          .sort((a, b) => new Date(b.createdAt || b.applicationDate) - new Date(a.createdAt || a.applicationDate))
          .slice(0, 5);
        setRecentApplications(sortedApplications);
      } else {
        console.warn('Failed to load applications:', applicationsResult.error);
      }

      if (interviewsResult.success) {
        // Get upcoming interviews (scheduled status)
        const upcoming = interviewsResult.data
          .filter(interview => interview.status === 'SCHEDULED')
          .sort((a, b) => {
            const dateA = new Date(a.scheduledDateTime || a.scheduledDate || a.interviewDate || 0);
            const dateB = new Date(b.scheduledDateTime || b.scheduledDate || b.interviewDate || 0);
            return dateA - dateB;
          })
          .slice(0, 4);
        setUpcomingInterviews(upcoming);
      } else {
        console.warn('Failed to load interviews:', interviewsResult.error);
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Create stats from real data or defaults
  const stats = [
    {
      name: 'Open Vacancies',
      value: dashboardStats?.openVacancies || 0,
      icon: Briefcase,
      color: 'bg-blue-500',
      description: 'Active job postings',
    },
    {
      name: 'Total Applications',
      value: dashboardStats?.totalApplications || recentApplications.length || 0,
      icon: Users,
      color: 'bg-green-500',
      description: 'Applications received',
    },
    {
      name: 'Interviews Scheduled',
      value: dashboardStats?.scheduledInterviews || upcomingInterviews.length || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      description: 'Upcoming interviews',
    },
  ];

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your recruitment process.
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 w-full mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-5 flex items-center">
                <div
                  className={`p-3 rounded-xl flex-shrink-0 ${stat.color} bg-opacity-10`}
                >
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Applicants
              </h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500"
              onClick={() => navigate('/layout/applicants')}
              >
                View all <ArrowRight className="h-4 w-4 inline ml-1" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {recentApplications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No recent applications</p>
                </div>
              ) : (
                recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-full shadow-sm bg-gradient-to-br from-blue-500 to-blue-600">
                        <span className="text-sm font-bold text-white">
                          {application.user?.firstName?.[0] || 'A'}
                          {application.user?.lastName?.[0] || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {application.user?.firstName || 'Unknown'} {application.user?.lastName || 'User'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {application.vacancy?.title || 'Position not specified'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Applied for {application.vacancy?.department || 'Unknown Department'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={application.status} />
                      <span className="text-xs text-gray-500">
                        {application.createdAt || application.applicationDate 
                          ? new Date(application.createdAt || application.applicationDate).toLocaleDateString() 
                          : 'Date not available'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Upcoming Interviews
              </h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500"
              onClick={() => navigate('/layout/interviews')}
              >
                View all <ArrowRight className="h-4 w-4 inline ml-1" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {upcomingInterviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No upcoming interviews</p>
                </div>
              ) : (
                upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {interview.application?.user?.firstName || 'Unknown'} {interview.application?.user?.lastName || 'Candidate'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {interview.scheduledDateTime || interview.scheduledDate || interview.interviewDate 
                            ? new Date(interview.scheduledDateTime || interview.scheduledDate || interview.interviewDate).toLocaleString()
                            : 'Date not available'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Position: {interview.application?.vacancy?.title || 'Not specified'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Type: {interview.type || 'Interview'}
                        </p>
                      </div>
                      <StatusBadge status={interview.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default HRDashboard;
