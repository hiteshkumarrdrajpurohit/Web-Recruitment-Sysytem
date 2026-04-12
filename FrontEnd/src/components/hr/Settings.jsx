import React, { useState, useEffect } from 'react';
import { getAllApplications, deleteApplication } from '../../services/hr';

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');
  
  // Step 1: Initialize with empty array instead of mock data
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true); // Step 4: Loading state
  const [deleteApplicantMsg, setDeleteApplicantMsg] = useState('');

  // Fetch applicants from backend
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const result = await getAllApplications();
        if (result.success) {
          const rows = (result.data || []).map(app => ({
            id: app.id,
            firstName: app.user?.firstName || 'Unknown',
            lastName: app.user?.lastName || 'User',
            email: app.user?.email || '-',
            position: app.vacancy?.title || 'Position not specified',
            status: app.status || 'UNKNOWN'
          }));
          setApplicants(rows);
        } else {
          console.warn('Failed to load applications:', result.error);
        }
      } catch (error) {
        console.error('Failed to fetch applicants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);


  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg('Please fill all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match.');
      return;
    }
    setPasswordMsg('Password changed successfully! (Demo only)');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    // TODO: Wire to backend endpoint when available
    setDeleteMsg('Account deletion is not available at this time.');
  };

  const handleDeleteApplicant = async (id) => {
    try {
      const result = await deleteApplication(id);
      if (result.success) {
        setApplicants(prev => prev.filter(a => a.id !== id));
        setDeleteApplicantMsg('Application deleted successfully.');
        setTimeout(() => setDeleteApplicantMsg(''), 2000);
      } else {
        setDeleteApplicantMsg(result.error || 'Failed to delete application');
        setTimeout(() => setDeleteApplicantMsg(''), 3000);
      }
    } catch (err) {
      console.error('Error deleting application:', err);
      setDeleteApplicantMsg('Failed to delete application');
      setTimeout(() => setDeleteApplicantMsg(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* Settings Content */}
      <div className="max-w-3xl mx-auto mt-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>

        {/* Applicant Management */}
        <div className="mb-10">
          <h3 className="font-semibold mb-2">Manage Applicants</h3>
          {deleteApplicantMsg && <div className="text-red-600 text-sm mb-2">{deleteApplicantMsg}</div>}

          {loading ? (
            <div className="text-gray-500 text-sm">Loading applicants...</div> // Step 4: Show loading
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Position</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map(applicant => (
                    <tr key={applicant.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2">{applicant.firstName} {applicant.lastName}</td>
                      <td className="px-4 py-2">{applicant.email}</td>
                      <td className="px-4 py-2">{applicant.position}</td>
                      <td className="px-4 py-2">{applicant.status}</td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => handleDeleteApplicant(applicant.id)} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 text-xs font-semibold transition-all">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Current Password</label>
              <input type="password" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">New Password</label>
              <input type="password" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Confirm New Password</label>
              <input type="password" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            {passwordMsg && <div className="text-blue-600 text-sm">{passwordMsg}</div>}
            <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all">Change Password</button>
          </form>
        </div>

        {/* Delete HR Account */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-red-600">Delete My HR Account</h3>
          <p className="mb-2 text-gray-600">Once you delete your account, there is no going back. Please be certain.</p>
          {deleteMsg && <div className="text-red-600 text-sm mb-2">{deleteMsg}</div>}
          <button onClick={handleDeleteAccount} className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-md transition-all">Delete My Account</button>
        </div>
      </div>
    </div>
  );
}
