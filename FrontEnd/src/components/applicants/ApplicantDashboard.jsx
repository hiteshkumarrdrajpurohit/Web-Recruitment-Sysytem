import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProfile, getMyApplications, getAllJobs } from "../../services/applicant";

export default function ApplicantDashboard() {
  const [applicant, setApplicant] = useState(null);
  const [applications, setApplications] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, appsRes, jobsRes] = await Promise.all([
          getProfile(),
          getMyApplications(),
          getAllJobs()
        ]);

        if (profileRes?.success) setApplicant(profileRes.data);
        if (appsRes?.success) setApplications(appsRes.data.slice(0, 5)); // Just recent 5
        if (jobsRes?.success) setFeaturedJobs(jobsRes.data.slice(0, 4)); // Just 4 featured
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );
  }

  // Fallback to empty applicant so HR managers looking at this screen don't crash it
  const displayUser = applicant || { firstName: 'User', lastName: '' };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Welcome Card */}
      <div className="max-w-6xl mx-auto mt-2">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white flex flex-col md:flex-row md:items-center md:justify-between mb-8 shadow-lg">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {displayUser.firstName} {displayUser.lastName}!
            </h2>
            <p className="mb-5 text-blue-100">
              Ready to find your next opportunity? Let's explore the latest job
              openings.
            </p>
            <Link
              to="/applicantlayout/user/jobs"
              className="inline-block px-6 py-2.5 bg-white text-blue-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Browse Jobs
            </Link>
          </div>
        </div>

        

        {/* Applications & Featured Jobs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Recent Applications</h3>
              <Link
                 to="/applicantlayout/user/applications"
                className="text-blue-600 text-sm hover:underline"
              >
                View all
              </Link>
            </div>
            <div>
              {applications.map((app, idx) => (
                <div
                  key={idx}
                  className="border border-gray-100 rounded-xl p-4 flex flex-col gap-1 mb-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium">{app.vacancy?.title || 'Unknown Job'}</div>
                  <div className="text-sm text-gray-500">{app.vacancy?.department || ''}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
                      {app.status || 'SUBMITTED'}
                    </span>
                    <span className="text-xs text-gray-400">
                      Applied {new Date(app.createdAt || app.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Jobs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Featured Jobs</h3>
              <Link
                to="/applicantlayout/user/jobs"
                className="text-blue-600 text-sm hover:underline"
              >
                View all
              </Link>
            </div>
            <div>
              {featuredJobs.map((job, idx) => (
                <div
                  key={idx}
                  className="border border-gray-100 rounded-xl p-4 flex flex-col gap-1 mb-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium">{job.title}</div>
                  <div className="text-sm text-gray-500">
                    {job.department} {job.location ? "| " + job.location : ""}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                      {job.type || "full-time"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {job.minSalary && job.maxSalary
                        ? `₹${job.minSalary.toLocaleString('en-IN')} - ₹${job.maxSalary.toLocaleString('en-IN')}`
                        : "Salary not disclosed"}
                    </span>
                  </div>
                  <Link
                    to="/applicantlayout/user/jobs"
                    className="text-blue-600 text-xs hover:underline mt-1"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
             to="/applicantlayout/user/jobs"
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
          >
            <span className="bg-blue-100 p-2 rounded">🔍</span>
            <span className="font-medium">Browse Jobs</span>
          </Link>
          <Link
           to="/applicantlayout/user/profile"
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-green-200 transition-all"
          >
            <span className="bg-green-100 p-2 rounded">👤</span>
            <span className="font-medium">Update Profile</span>
          </Link>
          <Link
           to="/applicantlayout/user/applications"
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-purple-200 transition-all"
          >
            <span className="bg-purple-100 p-2 rounded">📄</span>
            <span className="font-medium">Track Applications</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
