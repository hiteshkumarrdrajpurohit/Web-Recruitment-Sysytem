import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getAllJobs, applyForJob, getMyApplications, hasAppliedForVacancy } from '../../services/applicant';
import { AuthContext } from '../../App';
import { toast } from 'react-toastify';

export default function JobListings() {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedInfo, setAppliedInfo] = useState({}); // vacancyId -> { status, date }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(null);

  // Load jobs and applied jobs on component mount
  useEffect(() => {
    console.log('JobListings - User state:', user); // Debug log
    loadJobs();
    if (user?.token) {
      loadMyApplications();
    }
  }, [user]);

  // Filter jobs based on search input
  useEffect(() => {
    if (search) {
    const searchLower = search.toLowerCase();
      const filtered = jobs.filter(job => {
    const title = job.title ? job.title.toLowerCase() : '';
    const department = job.department ? job.department.toLowerCase() : '';
    const location = job.location ? job.location.toLowerCase() : '';
    const description = job.description ? job.description.toLowerCase() : '';
        const requirements = job.requirements ? job.requirements.toLowerCase() : '';
    return (
      title.includes(searchLower) ||
      department.includes(searchLower) ||
      location.includes(searchLower) ||
          description.includes(searchLower) ||
          requirements.includes(searchLower)
    );
  });
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [search, jobs]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getAllJobs();
      
      if (result.success) {
        setJobs(result.data);
        setFilteredJobs(result.data);
      } else {
        setError(result.error || 'Failed to load jobs');
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const loadMyApplications = async () => {
    try {
      if (!user?.token) return;
      
      const result = await getMyApplications();
      if (result.success) {
        // Extract vacancy IDs from applications
        const appliedVacancyIds = result.data.map(app => app.vacancyId || app.vacancy?.id).filter(Boolean);
        setAppliedJobs(appliedVacancyIds);

        // Build quick lookup for status/date by vacancy
        const info = {};
        result.data.forEach(app => {
          const vid = app.vacancyId || app.vacancy?.id;
          if (vid) {
            info[vid] = {
              status: app.status,
              date: app.createdAt || app.appliedDate
            };
          }
        });
        setAppliedInfo(info);
      }
    } catch (err) {
      console.error('Error loading applications:', err);
    }
  };

  const handleApply = async (jobId) => {
    // Check if user is logged in and has a token
    if (!user || !user.token) {
      toast.warning('Please sign in to apply for jobs');
      return;
    }

    // Check if user has already applied and show alert
    if (appliedJobs.includes(jobId)) {
      toast.info('You have already applied for this position');
      return;
    }

    try {
      // Backend pre-check to avoid 400 responses and alerts
      const precheck = await hasAppliedForVacancy(jobId);
      if (!precheck.success) {
        // If precheck failed (e.g., 401/403), refresh local state and exit silently
        await loadMyApplications();
        return;
      }
      if (precheck.data === true) {
        setAppliedJobs(prev => (prev.includes(jobId) ? prev : [...prev, jobId]));
        toast.info('You have already applied for this position');
        return;
      }

      setApplying(jobId);
      const result = await applyForJob(jobId);
      
      if (result.success) {
        setAppliedJobs(prev => [...prev, jobId]);
        // Success - no alert needed, visual feedback from UI change is sufficient
      } else {
        // Show error alert for actual failures and duplicate applications
        const errText = typeof result.error === 'string' ? result.error : '';
        if (errText.toLowerCase().includes('already applied')) {
          toast.info('You have already applied for this position');
          await loadMyApplications();
        } else {
          toast.error('Failed to apply for job. Please try again.');
        }
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      // Handle both failures and duplicate applications 
      const respData = err?.response?.data;
      const serverMsg = typeof respData === 'string' ? respData : (respData?.message || '');
      if (serverMsg.toLowerCase().includes('already applied')) {
        toast.info('You have already applied for this position');
        await loadMyApplications();
      } else {
        toast.error('Failed to apply for job. Please try again.');
      }
    } finally {
      setApplying(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return 'Recently';
    }
  };

  const formatSalary = (job) => {
    if (job.minSalary && job.maxSalary) {
      return `₹${job.minSalary.toLocaleString()} - ₹${job.maxSalary.toLocaleString()}`;
    }
    if (job.salary) {
      return `₹${job.salary.toLocaleString()}`;
    }
    return 'Salary not disclosed';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadJobs}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Gradient Header */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white max-w-6xl mx-auto mt-8 mb-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-1">Find Your Dream Job</h2>
        <p className="text-blue-100">Discover {filteredJobs.length} opportunities from top companies</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto px-2 mb-4">
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
      </div>
      )}

      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-4 mb-6 px-2">
        <input
          type="text"
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="Search jobs, companies, departments, or keywords..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        
      </div>

      {/* Job List */}
      <div className="max-w-6xl mx-auto px-2">
        <div className="text-gray-500 text-sm mb-2">
          Showing {filteredJobs.length} of {jobs.length} jobs
          {search && ` matching "${search}"`}
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              {search ? 'No jobs found matching your search' : 'No job opportunities available'}
            </div>
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear search to see all jobs
              </button>
            )}
          </div>
        ) : (
        <div className="space-y-6">
            {filteredJobs.map((job, idx) => {
              const hasApplied = appliedJobs.includes(job.id);
              return (
            <div key={job.id || idx} className={`bg-white rounded-2xl border shadow-sm p-6 flex flex-col md:flex-row md:items-start md:justify-between transition-all duration-300 ${
              hasApplied 
                ? 'opacity-75 bg-gray-50 border-gray-200' 
                : 'border-gray-100 hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5'
            }`}>
              <div className="flex-1">
                {/* Job Title and Company */}
                <div className={`font-bold text-lg mb-1 flex items-center gap-2 ${hasApplied ? 'text-gray-600' : 'text-gray-900'}`}>
                  {job.title || 'Untitled Position'}
                  {hasApplied && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      ✓ Applied
                    </span>
                  )}
                </div>
                {hasApplied && (
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {appliedInfo[job.id]?.status || 'SUBMITTED'}
                    </span>
                    <span className="text-gray-500">
                      Applied {formatDate(appliedInfo[job.id]?.date)}
                    </span>
                    <Link
                      to="/applicantlayout/user/applications"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View application
                    </Link>
                  </div>
                )}
                <div className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                  {job.department && (
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                      {job.department}
                    </span>
                  )}
                  {job.location && (
                    <span className="flex items-center gap-1">
                      📍 {job.location}
                    </span>
                  )}
                </div>

                {/* Job Description */}
                <div className="mb-3 text-gray-700 text-sm leading-relaxed">
                  {job.description || 'No description provided'}
                </div>

                {/* Requirements */}
                {job.requirements && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-600 mb-2">Requirements:</div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
                      {job.requirements}
                </div>
                </div>
                )}

                {/* Job Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    💰 {formatSalary(job)}
                  </span>
                  <span className="flex items-center gap-1">
                    📅 Posted {formatDate(job.createdAt)}
                  </span>
                  {job.applicationDeadline && (
                    <span className="flex items-center gap-1 text-red-600">
                      ⏰ Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Section */}
              <div className="flex flex-col items-end gap-2 mt-4 md:mt-0 md:ml-6 md:min-w-[120px]">
                {/* Job Type Badge */}
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  job.type === 'FULL_TIME' ? 'bg-green-100 text-green-700' : 
                  job.type === 'PART_TIME' ? 'bg-blue-100 text-blue-700' :
                  job.type === 'CONTRACT' ? 'bg-purple-100 text-purple-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {job.type ? job.type.replace('_', ' ') : 'FULL TIME'}
                </span>

                {/* Status Badge */}
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  job.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {job.status || 'ACTIVE'}
                </span>

                {/* Apply Button */}
                {hasApplied ? (
                    <button
                    className="mt-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-200 text-gray-500 cursor-not-allowed flex items-center gap-2"
                      disabled
                      title="You have already applied for this position"
                      onClick={(e) => e.preventDefault()}
                    >
                    ✓ Applied
                    </button>
                ) : (
                  <button
                    className={`mt-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                      applying === job.id 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/20'
                    }`}
                    onClick={() => !hasApplied && handleApply(job.id)}
                    disabled={applying === job.id || hasApplied}
                  >
                    {applying === job.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Applying...
                      </>
                    ) : (
                      '📄 Apply Now'
                    )}
                  </button>
                )}
              </div>
            </div>
          );
            })}
        </div>
        )}
      </div>
    </div>
  );
} 