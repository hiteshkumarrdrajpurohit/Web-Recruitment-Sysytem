import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications, getInterviewsByApplication } from '../../services/applicant';

export default function MyInterviews() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const appsRes = await getMyApplications();
        if (!appsRes.success) {
          setError(appsRes.error || 'Failed to load applications');
          setLoading(false);
          return;
        }
        const applicationIds = (appsRes.data || []).map(a => a.id);
        if (applicationIds.length === 0) {
          setInterviews([]);
          setLoading(false);
          return;
        }
        const results = await Promise.all(
          applicationIds.map(id => getInterviewsByApplication(id))
        );
        const merged = results
          .filter(r => r.success)
          .flatMap(r => r.data || [])
          .sort((a, b) => new Date(a.scheduledDateTime || a.scheduledDate || a.interviewDate || 0) - new Date(b.scheduledDateTime || b.scheduledDate || b.interviewDate || 0));
        setInterviews(merged);
      } catch (err) {
        console.error('Failed to load interviews', err);
        setError('Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatDateTime = (dt) => {
    if (!dt) return 'Not scheduled';
    try {
      const d = new Date(dt);
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return 'Not scheduled';
    }
  };

  const statusPill = (status) => {
    const s = (status || '').toUpperCase();
    const cls = s === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' : s === 'COMPLETED' ? 'bg-green-100 text-green-800' : s === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700';
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{s || 'UNKNOWN'}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">Loading interviews...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white max-w-6xl mx-auto mt-8 mb-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-1">My Interviews</h2>
        <p className="text-blue-100">View interviews scheduled by HR for your applications</p>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto px-2 mb-4">
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl">{error}</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-2 mb-8">
        {interviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="text-gray-400 text-lg mb-2">No Interviews Yet</div>
            <p className="text-gray-500 mb-4">You have no interviews scheduled.</p>
            <Link to="/applicantlayout/user/jobs" className="inline-block px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md transition-all">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => {
              const application = interview.application || {};
              const user = application.user || {};
              const vacancy = application.vacancy || {};
              return (
                <div key={interview.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-semibold">{vacancy.title || 'Position not specified'}</div>
                    {statusPill(interview.status)}
                  </div>
                  <div className="text-gray-600 text-sm mb-1">Department: {vacancy.department || 'N/A'}</div>
                  <div className="text-gray-600 text-sm mb-1">Type: {interview.type || 'Interview'}</div>
                  <div className="text-gray-600 text-sm mb-1">When: {formatDateTime(interview.scheduledDateTime || interview.scheduledDate || interview.interviewDate)}</div>
                  {interview.location && (
                    <div className="text-gray-600 text-sm mb-1">Location: {interview.location}</div>
                  )}
                  {interview.meetUrl && (
                    <div className="text-gray-600 text-sm">Meeting: <a className="text-blue-600 hover:text-blue-700" href={interview.meetUrl} target="_blank" rel="noreferrer">Join</a></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


