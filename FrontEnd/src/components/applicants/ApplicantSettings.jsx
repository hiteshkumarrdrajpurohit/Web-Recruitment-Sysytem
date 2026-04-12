import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ApplicantSettings() {
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");

  // 1️⃣ Fetch applicant data on mount
  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const res = await axios.get("/api/applicant"); // ✅ Adjust API as needed
        setApplicant(res.data);
      } catch (err) {
        console.error("Failed to load applicant:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicant();
  }, []);

  // 2️⃣ Password change simulation
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg("Please fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("New passwords do not match.");
      return;
    }
    setPasswordMsg("Password changed successfully! (Demo only)");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // 3️⃣ Delete simulation
  const handleDeleteAccount = () => {
    setDeleteMsg("Account deleted! (Demo only)");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading settings...
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        Failed to load applicant settings.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Settings Content */}
      <div className="max-w-2xl mx-auto mt-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

        {/* Change Password */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {passwordMsg && (
              <div className="text-blue-600 text-sm">{passwordMsg}</div>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-red-600">Delete Account</h3>
          <p className="mb-2 text-gray-600">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          {deleteMsg && (
            <div className="text-red-600 text-sm mb-2">{deleteMsg}</div>
          )}
          <button
            onClick={handleDeleteAccount}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-md transition-all"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}