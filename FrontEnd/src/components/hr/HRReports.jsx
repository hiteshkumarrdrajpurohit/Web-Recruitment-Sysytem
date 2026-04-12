import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  Briefcase,
  Calendar,
  CheckCircle,
  FileText
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { getAllVacancies, getAllApplications, getAllInterviews } from '../../services/hr';

function HRReports() {
  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState([]);
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
      
      const [vacRes, appRes, intRes] = await Promise.all([
        getAllVacancies(),
        getAllApplications(),
        getAllInterviews(),
      ]);

      if (vacRes.success) setVacancies(vacRes.data);
      if (appRes.success) setApplications(appRes.data);
      if (intRes.success) setInterviews(intRes.data);

    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load reporting data.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Overall Statistics
  const totalVacancies = vacancies.length;
  const activeVacancies = vacancies.filter((v) => v.status === 'ACTIVE').length;
  
  // Exclude HR test applications or focus only on USER role applications
  const validApplications = applications.filter(a => a.user?.role === 'USER');
  const totalApplicants = validApplications.length;
  
  const hiredApplicants = validApplications.filter((a) => a.status === 'SELECTED').length;
  const rejectedApplicants = validApplications.filter((a) => a.status === 'REJECTED').length;
  const reviewingApplicants = validApplications.filter(a => ['UNDER_REVIEW', 'SHORTLISTED'].includes(a.status)).length;
  
  const scheduledInterviews = interviews.filter((i) => i.status !== 'CANCELLED').length;
  const completedInterviews = interviews.filter((i) => i.status === 'COMPLETED').length;

  const hiringRate = totalApplicants ? ((hiredApplicants / totalApplicants) * 100).toFixed(1) : '0';

  // 2. Pie Chart Data: Overall Application Statuses
  const appStatusData = [
    { name: 'Hired', value: hiredApplicants },
    { name: 'In Progress', value: validApplications.length - hiredApplicants - rejectedApplicants },
    { name: 'Rejected', value: rejectedApplicants },
  ].filter(d => d.value > 0);
  
  const COLORS = ['#4ade80', '#fbbf24', '#f87171']; // Green, Yellow, Red

  // 3. Per-Vacancy Statistics Generation
  const vacancyStats = vacancies.map(vacancy => {
    const appsForVacancy = validApplications.filter(app => (app.vacancy?.id === vacancy.id) || (app.vacancyId === vacancy.id));
    const totalApps = appsForVacancy.length;
    
    const hired = appsForVacancy.filter(a => a.status === 'SELECTED').length;
    const shortlisted = appsForVacancy.filter(a => a.status === 'SHORTLISTED').length;
    const rejected = appsForVacancy.filter(a => a.status === 'REJECTED').length;
    
    // Find interviews connected to these applications
    const intsForVacancy = interviews.filter(i => appsForVacancy.some(a => a.id === i.application?.id));
    const intsCount = intsForVacancy.length;

    return {
      id: vacancy.id,
      title: vacancy.title,
      department: vacancy.department || 'N/A',
      status: vacancy.status,
      applicantsCount: totalApps,
      shortlistedCount: shortlisted,
      interviewCount: intsCount,
      hiredCount: hired,
      rejectedCount: rejected,
      conversionRate: totalApps ? ((hired / totalApps) * 100).toFixed(1) : 0
    };
  }).sort((a, b) => b.applicantsCount - a.applicantsCount);

  // Bar Chart Data
  const barChartData = vacancyStats.slice(0, 5).map(v => ({
    name: v.title.length > 20 ? v.title.substring(0, 20) + '...' : v.title,
    Applicants: v.applicantsCount,
    Hired: v.hiredCount,
  }));

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 text-center text-red-600 mt-8">
        <p>{error}</p>
        <button onClick={loadData} className="mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md transition-all">Retry</button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 relative max-w-7xl mx-auto">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Track recruitment performance and candidate pipelines.</p>
        </div>
      </div>

      {/* 1. Overall Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Active Vacancies"
          value={activeVacancies}
          subtitle={`${totalVacancies} total listed`}
          icon={Briefcase}
          color="bg-blue-100 text-blue-600"
        />
        <MetricCard
          title="Total Applications"
          value={totalApplicants}
          subtitle={`${reviewingApplicants} currently in review`}
          icon={Users}
          color="bg-indigo-100 text-indigo-600"
        />
        <MetricCard
          title="Interviews Held"
          value={completedInterviews}
          subtitle={`Out of ${scheduledInterviews} scheduled`}
          icon={Calendar}
          color="bg-purple-100 text-purple-600"
        />
        <MetricCard
          title="Hired Candidates"
          value={hiredApplicants}
          subtitle={`${hiringRate}% overall conversion`}
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
        />
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Application Statuses Pie */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Status Overview</h3>
          <div className="h-64">
            {appStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {appStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">No application data yet</div>
            )}
          </div>
        </div>

        {/* Top Jobs by Applicants Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Vacancies by Applications</h3>
          <div className="h-64">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} />
                  <Legend />
                  <Bar dataKey="Applicants" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Hired" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">No vacancy data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Detailed Per-Vacancy Statistics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Per-Vacancy Statistics</h3>
          <p className="text-sm text-gray-500 mt-1">Detailed breakdown of recruitment performance for every listed job role.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vacancy</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicants</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Interviews</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Hired</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Conversion</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vacancyStats.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No vacancies open</td></tr>
              ) : (
                vacancyStats.map((stat, i) => (
                  <tr key={stat.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{stat.title}</div>
                      <div className="text-sm text-gray-500">{stat.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        stat.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {stat.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700 font-medium">
                      {stat.applicantsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700 font-medium">
                      {stat.interviewCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-green-600 font-semibold">
                      {stat.hiredCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <span className="text-sm font-medium text-gray-900">{stat.conversionRate}%</span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${Math.min(stat.conversionRate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-xl ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-4 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-2xl font-bold text-gray-900 mt-1">{value}</dd>
              <dd className="text-xs text-gray-400 mt-1">{subtitle}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRReports;